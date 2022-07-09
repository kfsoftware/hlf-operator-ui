package serve

import (
	"crypto/x509"
	"fmt"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/apollotracing"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/hyperledger/fabric-gateway/pkg/client"
	"github.com/hyperledger/fabric-gateway/pkg/identity"
	"github.com/hyperledger/fabric-sdk-go/pkg/common/providers/core"
	"github.com/hyperledger/fabric-sdk-go/pkg/core/config"
	"github.com/hyperledger/fabric-sdk-go/pkg/fabsdk"
	"github.com/kfsoftware/hlf-operator-ui/api/gql"
	"github.com/kfsoftware/hlf-operator-ui/api/gql/resolvers"
	"github.com/kfsoftware/hlf-operator-ui/api/log"
	"github.com/kfsoftware/hlf-operator/controllers/utils"
	operatorv1 "github.com/kfsoftware/hlf-operator/pkg/client/clientset/versioned"
	"github.com/spf13/cobra"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
	"net/http"
	"os"
	"strings"
	"time"
)

type serveConfig struct {
	address   string
	hlfConfig string
	user      string
	mspID     string
}
type serveCmd struct {
	address   string
	hlfConfig string
	user      string
	mspID     string
}
type IdentityStruct struct {
	Identity identity.Identity
	Sign     identity.Sign
}

func getGateway(clientConnection *grpc.ClientConn, identity *IdentityStruct) (*client.Gateway, error) {
	gw, err := client.Connect(
		identity.Identity,
		client.WithSign(identity.Sign),
		client.WithClientConnection(clientConnection),
		client.WithEvaluateTimeout(5*time.Second),
		client.WithEndorseTimeout(15*time.Second),
		client.WithSubmitTimeout(5*time.Second),
		client.WithCommitStatusTimeout(1*time.Minute),
	)
	if err != nil {
		return nil, err
	}
	return gw, nil
}
func (s serveCmd) run() error {
	kubeConfigPath := os.Getenv("KUBECONFIG")
	kubeConfig, err := clientcmd.BuildConfigFromFlags("", kubeConfigPath)
	if err != nil {
		return err
	}
	kubeClient, err := kubernetes.NewForConfig(kubeConfig)
	if err != nil {
		return err
	}
	hlfClient, err := operatorv1.NewForConfig(kubeConfig)
	if err != nil {
		return err
	}
	var sdk *fabsdk.FabricSDK
	var cfgProvider []core.ConfigBackend
	var gw *client.Gateway
	if s.hlfConfig != "" {
		configBackend := config.FromFile(s.hlfConfig)
		cfgProvider, err = configBackend()
		if err != nil {
			return err
		}
		sdk, err := fabsdk.New(configBackend)
		if err != nil {
			return err
		}
		configBackend1, err := sdk.Config()
		if err != nil {
			return err
		}

		peersInt, _ := configBackend1.Lookup(fmt.Sprintf("organizations.%s.peers", s.mspID))
		peersArrayInterface := peersInt.([]interface{})
		var peers []string
		idx := 0
		var peerUrl string
		var peerTLSCACert []byte
		for _, item := range peersArrayInterface {
			peerName := item.(string)
			peers = append(peers, peerName)
			peerUrlKey := fmt.Sprintf("peers.%s.url", peerName)
			peerTLSCACertKey := fmt.Sprintf("peers.%s.tlsCACerts.pem", peerName)
			peerUrlInt, _ := configBackend1.Lookup(peerUrlKey)
			peerTLSCACertInt, _ := configBackend1.Lookup(peerTLSCACertKey)
			peerUrl = strings.Replace(peerUrlInt.(string), "grpcs://", "", -1)
			peerTLSCACert = []byte(peerTLSCACertInt.(string))
			idx++
			if idx >= 1 {
				break
			}
		}
		userCertKey := fmt.Sprintf("organizations.%s.users.%s.cert.pem", s.mspID, s.user)
		userPrivateKey := fmt.Sprintf("organizations.%s.users.%s.key.pem", s.mspID, s.user)
		userPrivateCertString, certExists := configBackend1.Lookup(userCertKey)
		if !certExists {
			return fmt.Errorf("user cert not found")
		}
		userPrivateKeyString, keyExists := configBackend1.Lookup(userPrivateKey)
		if !keyExists {
			return fmt.Errorf("user key not found")
		}
		grpcConn, err := newGrpcConnection(peerUrl, peerTLSCACert)
		if err != nil {
			return err
		}
		cert, err := utils.ParseX509Certificate([]byte(userPrivateCertString.(string)))
		if err != nil {
			return err
		}
		x509Identity, err := identity.NewX509Identity(s.mspID, cert)
		if err != nil {
			return err
		}
		privateKey, err := identity.PrivateKeyFromPEM([]byte(userPrivateKeyString.(string)))
		if err != nil {
			return err
		}
		sign, err := identity.NewPrivateKeySign(privateKey)
		if err != nil {
			return err
		}
		gw, err = getGateway(grpcConn, &IdentityStruct{
			Identity: x509Identity,
			Sign:     sign,
		})
		if err != nil {
			return err
		}
	}
	gqlConfig := gql.Config{
		Resolvers: &resolvers.Resolver{
			MSPID:          s.mspID,
			User:           s.user,
			KubeClient:     kubeClient,
			Config:         kubeConfig,
			HLFClient:      hlfClient,
			FabricSDK:      sdk,
			ConfigBackends: cfgProvider,
			Gateway:        gw,
		},
	}
	es := gql.NewExecutableSchema(gqlConfig)
	h := handler.New(es)
	h.AddTransport(transport.Options{})
	h.AddTransport(transport.GET{})
	h.AddTransport(transport.POST{})
	h.AddTransport(transport.MultipartForm{})

	h.SetQueryCache(lru.New(1000))
	h.Use(extension.Introspection{})
	h.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New(100),
	})
	h.Use(apollotracing.Tracer{})
	playgroundHandler := playground.Handler("GraphQL", "/graphql")

	graphqlHandler := http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		writer.Header().Set("Access-Control-Allow-Origin", "*")
		writer.Header().Set("Access-Control-Allow-Credentials", "true")
		writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, X-Identity")
		writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")
		h.ServeHTTP(writer, request)
	})
	serverMux := http.NewServeMux()
	serverMux.HandleFunc(
		"/graphql",
		graphqlHandler,
	)
	serverMux.HandleFunc(
		"/playground",
		playgroundHandler,
	)
	log.Infof("Server listening on %s", s.address)
	return http.ListenAndServe(s.address, serverMux)
}

// newGrpcConnection creates a gRPC connection to the Gateway server.
func newGrpcConnection(peerEndpoint string, tlsCert []byte) (*grpc.ClientConn, error) {
	certificate, err := identity.CertificateFromPEM(tlsCert)
	if err != nil {
		return nil, fmt.Errorf("failed to obtain commit status: %w", err)
	}

	certPool := x509.NewCertPool()
	certPool.AddCert(certificate)
	transportCredentials := credentials.NewClientTLSFromCert(certPool, "")

	connection, err := grpc.Dial(peerEndpoint, grpc.WithTransportCredentials(transportCredentials))
	if err != nil {
		return nil, fmt.Errorf("failed to evaluate transaction: %w", err)
	}

	return connection, nil
}

func NewServeCommand() *cobra.Command {
	conf := &serveConfig{}
	cmd := &cobra.Command{
		Use:   "serve",
		Short: "serve",
		Long:  "serve",
		RunE: func(cmd *cobra.Command, args []string) error {
			s := &serveCmd{
				address:   conf.address,
				hlfConfig: conf.hlfConfig,
				user:      conf.user,
				mspID:     conf.mspID,
			}
			return s.run()
		},
	}
	f := cmd.Flags()
	f.StringVar(&conf.address, "address", "", "address for the server")
	f.StringVar(&conf.hlfConfig, "hlf-config", "", "HLF configuration")
	f.StringVar(&conf.mspID, "msp-id", "", "MSP ID to use for the HLF configuration")
	f.StringVar(&conf.user, "user", "", "User to use for the HLF configuration")
	return cmd
}
