import { gql } from "@apollo/client";

export const GET_AVAILABLE_PRODUCTS = gql`
  query Products {
    products {
      id
      title
      price
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      refreshToken
    }
  }
`;

// GraphQL Mutation for Refresh Token
export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken {
    refreshToken {
      refreshToken
      accessToken
    }
  }
`;
