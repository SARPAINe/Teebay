import { useQuery } from "@apollo/client";
import { GET_USER_PRODUCTS } from "../graphql/queries";
import ProductCard from "../components/ProductCard";
import { ProductCardProps } from "../types";

const MyProduct = () => {
  const { data, loading, error } = useQuery(GET_USER_PRODUCTS);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading your products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Error loading your products: {error.message}</div>
      </div>
    );
  }

  const products = data.userAvailableProducts;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-6">MY PRODUCTS</h1>
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

export default MyProduct;
