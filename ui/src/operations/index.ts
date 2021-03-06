import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Ca = {
  __typename?: 'CA';
  name: Scalars['String'];
  namespace: Scalars['String'];
  yaml: Scalars['String'];
};

export type CreateCaInput = {
  yaml: Scalars['String'];
};

export type CreateOrdererInput = {
  yaml: Scalars['String'];
};

export type CreatePeerInput = {
  yaml: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPeer?: Maybe<Peer>;
  updatePeer?: Maybe<Peer>;
  createOrderer?: Maybe<Orderer>;
  updateOrderer?: Maybe<Orderer>;
  createCA?: Maybe<Ca>;
  updateCA?: Maybe<Ca>;
};


export type MutationCreatePeerArgs = {
  input: CreatePeerInput;
};


export type MutationUpdatePeerArgs = {
  filter: NameAndNamespace;
  input: UpdateePeerInput;
};


export type MutationCreateOrdererArgs = {
  input: CreateOrdererInput;
};


export type MutationUpdateOrdererArgs = {
  filter: NameAndNamespace;
  input: UpdateeOrdererInput;
};


export type MutationCreateCaArgs = {
  input: CreateCaInput;
};


export type MutationUpdateCaArgs = {
  filter: NameAndNamespace;
  input: UpdateeCaInput;
};

export type NameAndNamespace = {
  name: Scalars['String'];
  namespace: Scalars['String'];
};

export type Namespace = {
  __typename?: 'Namespace';
  name: Scalars['String'];
};

export type Orderer = {
  __typename?: 'Orderer';
  name: Scalars['String'];
  namespace: Scalars['String'];
  yaml: Scalars['String'];
};

export type Peer = {
  __typename?: 'Peer';
  name: Scalars['String'];
  namespace: Scalars['String'];
  yaml: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  peers?: Maybe<Array<Peer>>;
  peer?: Maybe<Peer>;
  orderers?: Maybe<Array<Orderer>>;
  orderer?: Maybe<Orderer>;
  cas?: Maybe<Array<Ca>>;
  ca?: Maybe<Ca>;
  namespaces?: Maybe<Array<Namespace>>;
};


export type QueryPeerArgs = {
  input: NameAndNamespace;
};


export type QueryOrdererArgs = {
  input: NameAndNamespace;
};


export type QueryCaArgs = {
  input: NameAndNamespace;
};

export type UpdateeCaInput = {
  yaml?: Maybe<Scalars['String']>;
};

export type UpdateeOrdererInput = {
  yaml?: Maybe<Scalars['String']>;
};

export type UpdateePeerInput = {
  yaml?: Maybe<Scalars['String']>;
};

export type GetCAsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCAsQuery = (
  { __typename?: 'Query' }
  & { cas?: Maybe<Array<(
    { __typename?: 'CA' }
    & Pick<Ca, 'name' | 'namespace' | 'yaml'>
  )>> }
);

export type GetNamespacesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetNamespacesQuery = (
  { __typename?: 'Query' }
  & { namespaces?: Maybe<Array<(
    { __typename?: 'Namespace' }
    & Pick<Namespace, 'name'>
  )>> }
);

export type GetOrderersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOrderersQuery = (
  { __typename?: 'Query' }
  & { orderers?: Maybe<Array<(
    { __typename?: 'Orderer' }
    & Pick<Orderer, 'name' | 'namespace' | 'yaml'>
  )>> }
);

export type GetPeersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPeersQuery = (
  { __typename?: 'Query' }
  & { peers?: Maybe<Array<(
    { __typename?: 'Peer' }
    & Pick<Peer, 'name' | 'namespace' | 'yaml'>
  )>> }
);


export const GetCAsDocument = gql`
    query GetCAs {
  cas {
    name
    namespace
    yaml
  }
}
    `;

/**
 * __useGetCAsQuery__
 *
 * To run a query within a React component, call `useGetCAsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCAsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCAsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCAsQuery(baseOptions?: Apollo.QueryHookOptions<GetCAsQuery, GetCAsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCAsQuery, GetCAsQueryVariables>(GetCAsDocument, options);
      }
export function useGetCAsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCAsQuery, GetCAsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCAsQuery, GetCAsQueryVariables>(GetCAsDocument, options);
        }
export type GetCAsQueryHookResult = ReturnType<typeof useGetCAsQuery>;
export type GetCAsLazyQueryHookResult = ReturnType<typeof useGetCAsLazyQuery>;
export type GetCAsQueryResult = Apollo.QueryResult<GetCAsQuery, GetCAsQueryVariables>;
export const GetNamespacesDocument = gql`
    query GetNamespaces {
  namespaces {
    name
  }
}
    `;

/**
 * __useGetNamespacesQuery__
 *
 * To run a query within a React component, call `useGetNamespacesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNamespacesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNamespacesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetNamespacesQuery(baseOptions?: Apollo.QueryHookOptions<GetNamespacesQuery, GetNamespacesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNamespacesQuery, GetNamespacesQueryVariables>(GetNamespacesDocument, options);
      }
export function useGetNamespacesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNamespacesQuery, GetNamespacesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNamespacesQuery, GetNamespacesQueryVariables>(GetNamespacesDocument, options);
        }
export type GetNamespacesQueryHookResult = ReturnType<typeof useGetNamespacesQuery>;
export type GetNamespacesLazyQueryHookResult = ReturnType<typeof useGetNamespacesLazyQuery>;
export type GetNamespacesQueryResult = Apollo.QueryResult<GetNamespacesQuery, GetNamespacesQueryVariables>;
export const GetOrderersDocument = gql`
    query GetOrderers {
  orderers {
    name
    namespace
    yaml
  }
}
    `;

/**
 * __useGetOrderersQuery__
 *
 * To run a query within a React component, call `useGetOrderersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrderersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrderersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetOrderersQuery(baseOptions?: Apollo.QueryHookOptions<GetOrderersQuery, GetOrderersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrderersQuery, GetOrderersQueryVariables>(GetOrderersDocument, options);
      }
export function useGetOrderersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrderersQuery, GetOrderersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrderersQuery, GetOrderersQueryVariables>(GetOrderersDocument, options);
        }
export type GetOrderersQueryHookResult = ReturnType<typeof useGetOrderersQuery>;
export type GetOrderersLazyQueryHookResult = ReturnType<typeof useGetOrderersLazyQuery>;
export type GetOrderersQueryResult = Apollo.QueryResult<GetOrderersQuery, GetOrderersQueryVariables>;
export const GetPeersDocument = gql`
    query GetPeers {
  peers {
    name
    namespace
    yaml
  }
}
    `;

/**
 * __useGetPeersQuery__
 *
 * To run a query within a React component, call `useGetPeersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPeersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPeersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPeersQuery(baseOptions?: Apollo.QueryHookOptions<GetPeersQuery, GetPeersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPeersQuery, GetPeersQueryVariables>(GetPeersDocument, options);
      }
export function useGetPeersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPeersQuery, GetPeersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPeersQuery, GetPeersQueryVariables>(GetPeersDocument, options);
        }
export type GetPeersQueryHookResult = ReturnType<typeof useGetPeersQuery>;
export type GetPeersLazyQueryHookResult = ReturnType<typeof useGetPeersLazyQuery>;
export type GetPeersQueryResult = Apollo.QueryResult<GetPeersQuery, GetPeersQueryVariables>;