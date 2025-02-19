import { gql } from "@apollo/client";

// GraphQL Mutation for logging in User
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      refreshToken
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

// GraphQL Mutation for Registering User
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

// GraphQL Mutation for Creating a Product
export const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      title
      description
      category
      price
      rentPrice
      rentCategory
    }
  }
`;

// GraphQL Mutation for Buying a product
export const BUY_PRODUCT_MUTATION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      type
    }
  }
`;

export const DELETE_PRODUCT_MUTATION = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;
