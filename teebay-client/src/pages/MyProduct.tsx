import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { GET_USER_PRODUCTS } from "../graphql/queries";
import { DELETE_PRODUCT_MUTATION } from "../graphql/mutation";
import ProductCard from "../components/ProductCard";
import Modal from "../components/Modal";
import { ProductCardProps } from "../types";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { toast } from "react-toastify";

const MyProduct = () => {
  const { data, loading, error, refetch } = useQuery(GET_USER_PRODUCTS);
  const [deleteProduct] = useMutation(DELETE_PRODUCT_MUTATION, {
    onCompleted: () => {
      toast.success("Product deleted successfully");
      refetch();
      setModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  const navigate = useNavigate();

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
  console.log("🚀 ~ MyProduct ~ products:", products);

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
        <div className="flex justify-end mb-4">
          <Button onClick={() => navigate("/user/create-product")}>
            Add Product
          </Button>
        </div>
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
            showDelete={true}
            routePath={`/products/edit/${product.id}`}
            rentPrice={product.rentPrice}
            rentCategory={product.rentCategory}
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
