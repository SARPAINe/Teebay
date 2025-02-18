import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import {
  GET_PRODUCT_DETAILS,
  GET_AVAILABLE_PRODUCTS,
} from "../graphql/queries";
import { BUY_PRODUCT_MUTATION } from "../graphql/mutation";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { toast } from "react-toastify";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ProductDetail = () => {
  const { id: productId } = useParams<{ id: string }>();
  const intProductId = parseInt(productId!, 10); // Convert id to integer

  const { loading, error, data } = useQuery(GET_PRODUCT_DETAILS, {
    variables: { id: intProductId },
  });

  const [
    createTransaction,
    { loading: transactionLoading, error: transactionError },
  ] = useMutation(BUY_PRODUCT_MUTATION, {
    onCompleted: (data) => {
      console.log("Product bought successfully", data);
      toast.success("Product bought successfully");
    },
    onError: (error) => {
      console.error("Error buying product", error);
      toast.error("Error buying product: " + error.message);
    },
    update: (cache, { data: { createTransaction } }) => {
      // Remove the bought product from the GET_AVAILABLE_PRODUCTS cache
      const { products } = cache.readQuery({ query: GET_AVAILABLE_PRODUCTS });
      const updatedProducts = products.filter(
        (product) => product.id !== intProductId
      );
      cache.writeQuery({
        query: GET_AVAILABLE_PRODUCTS,
        data: { products: updatedProducts },
      });
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"BUY" | "RENT">("BUY");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleBuyORRentProduct = (type: "BUY" | "RENT") => {
    setTransactionType(type);
    setIsModalOpen(true);
  };

  const handleConfirmTransaction = () => {
    const transactionInput = {
      type: transactionType,
      productId: intProductId,
      startDate: startDate ? startDate.toISOString() : new Date().toISOString(), // Example start date
      endDate: endDate ? endDate.toISOString() : null, // Optional end date
    };

    createTransaction({ variables: { input: transactionInput } }).catch(
      (error) => {
        console.error("Error buying product", transactionError?.message);
        toast.error("Error buying product: " + transactionError?.message);
      }
    );

    setIsModalOpen(false);
  };

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
        <Button
          type="confirm"
          onClick={() => handleBuyORRentProduct("RENT")}
          disabled={transactionLoading}
        >
          Rent
        </Button>
        <Button
          type="confirm"
          onClick={() => handleBuyORRentProduct("BUY")}
          disabled={transactionLoading}
        >
          Buy
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmTransaction}
        title={transactionType === "BUY" ? "Confirm Purchase" : "Rental Period"}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      >
        {transactionType === "RENT" ? (
          <>
            <label className="block mb-2">From:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date as Date)}
              className="w-full px-4 py-2 border rounded-md"
            />
            <label className="block mt-4 mb-2">To:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date as Date)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </>
        ) : (
          "Are you sure you want to buy the product?"
        )}
      </Modal>
    </div>
  );
};

export default ProductDetail;
