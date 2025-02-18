import { useQuery } from "@apollo/client";
import { GET_AVAILABLE_PRODUCTS } from "../graphql/queries";
import ProductCard from "../components/ProductCard";
import { ProductCardProps } from "../types";

const Product = () => {
  const { data, loading, error } = useQuery(GET_AVAILABLE_PRODUCTS, {
    fetchPolicy: "cache-first",
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Error loading products: {error.message}</div>
      </div>
    );
  }

  const products = data.products;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-6">ALL PRODUCTS</h1>
      <div className="max-w-4xl mx-auto">
        {products.map((product: ProductCardProps) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            category={product.category}
            price={product.price}
            description={product.description}
            createdAt={product.createdAt}
          />
        ))}
      </div>
    </div>
  );
};

export default Product;
