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
