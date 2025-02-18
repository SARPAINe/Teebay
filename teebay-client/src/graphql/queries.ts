import { gql } from "@apollo/client";

export const GET_AVAILABLE_PRODUCTS = gql`
  query Products {
    products {
      id
      title
      category
      price
      description
      category
      createdAt
    }
  }
`;

export const PRODUCT_DETAILS = gql`
  query Product($id: Int!) {
    product(id: $id) {
      id
      title
      category
      price
      description
      createdAt
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

export const REGISTER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
      phone
      firstName
      lastName
      address
      password
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
