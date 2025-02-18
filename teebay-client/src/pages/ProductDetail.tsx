import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { PRODUCT_DETAILS } from "../graphql/queries";
import Button from "../components/Button";

const ProductDetail = () => {
  const { id: productId } = useParams<{ id: string }>();
  const intProductId = parseInt(productId!, 10); // Convert id to integer
  const { loading, error, data } = useQuery(PRODUCT_DETAILS, {
    variables: { id: intProductId },
  });

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading product details...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Error: {error.message}
      </div>
    );

  const product = data.product;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      <p className="text-gray-600 mb-2">
        <span className="font-semibold">Categories:</span>{" "}
        {product.category.join(", ")}
      </p>
      <p className="text-gray-600 mb-2">
        <span className="font-semibold">Price:</span> ${product.price}
      </p>
      <p className="text-gray-600 mb-6">{product.description}</p>

      <div className="flex gap-4">
        <Button type="confirm">Rent</Button>
        <Button type="confirm">Buy</Button>
      </div>
    </div>
  );
};

export default ProductDetail;
