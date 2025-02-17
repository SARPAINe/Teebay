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
