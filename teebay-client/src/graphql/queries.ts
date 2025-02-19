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

export const GET_PRODUCT_DETAILS = gql`
  query Product($id: Int!) {
    product(id: $id) {
      id
      title
      category
      price
      description
      createdAt
      rentCategory
      rentPrice
    }
  }
`;

export const GET_USER_PRODUCTS = gql`
  query MyProducts {
    userAvailableProducts {
      id
      title
      category
      price
      description
      createdAt
      rentPrice
      rentCategory
    }
  }
`;

export const GET_BOUGHT_PRODUCTS = gql`
  query BoughtProducts {
    boughtProducts {
      id
      title
      category
      price
      description
      createdAt
    }
  }
`;

export const GET_SOLD_PRODUCTS = gql`
  query SoldProducts {
    soldProducts {
      id
      title
      category
      price
      description
      createdAt
    }
  }
`;

export const GET_BORROWED_PRODUCTS = gql`
  query BorrowedProducts {
    borrowedProducts {
      id
      title
      category
      price
      description
      createdAt
    }
  }
`;

export const GET_LENT_PRODUCTS = gql`
  query LentProducts {
    lentProducts {
      id
      title
      category
      price
      description
      createdAt
    }
  }
`;
