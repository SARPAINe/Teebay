import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { GET_USER_PRODUCTS } from "../graphql/queries";
import { DELETE_PRODUCT_MUTATION } from "../graphql/mutation";
import ProductCard from "../components/ProductCard";
import Modal from "../components/Modal";
import { ProductCardProps } from "../types";

const MyProduct = () => {
  const { data, loading, error, refetch } = useQuery(GET_USER_PRODUCTS);
  const [deleteProduct] = useMutation(DELETE_PRODUCT_MUTATION, {
    onCompleted: () => {
      refetch();
      setModalOpen(false);
    },
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

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

  const handleDelete = (id: string) => {
    setSelectedProductId(id);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProductId) {
      deleteProduct({ variables: { id: selectedProductId } });
    }
  };

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
            onDelete={handleDelete}
          />
        ))}
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
      >
        <p>Are you sure you want to delete this product?</p>
      </Modal>
    </div>
  );
};

export default MyProduct;
