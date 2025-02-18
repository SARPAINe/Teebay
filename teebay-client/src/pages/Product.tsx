import { useQuery } from "@apollo/client";
import React from "react";
import { GET_AVAILABLE_PRODUCTS } from "../graphql/queries";

const Product = () => {
  const { data, error } = useQuery(GET_AVAILABLE_PRODUCTS);
  console.log("🚀 ~ Product ~ data:", data);
  console.log("🚀 ~ Product ~ error:", error);
  return <div>Product Page</div>;
};

export default Product;
