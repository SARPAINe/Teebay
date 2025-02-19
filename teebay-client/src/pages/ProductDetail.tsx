import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import {
  GET_END_DATE,
  GET_EXCLUDED_DATE_RANGES,
  GET_PRODUCT_DETAILS,
} from "../graphql/queries";
import { BUY_PRODUCT_MUTATION } from "../graphql/mutation";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { toast } from "react-toastify";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { convertEpochToISO, formatCategory } from "../utils/helper";

const ProductDetail = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"BUY" | "RENT">("BUY");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [dateLimiter, setDateLimiter] = useState<Date | null>(
    new Date(new Date().setMonth(new Date().getMonth() + 1))
  );
  console.log("🚀 ~ ProductDetail ~ dateLimiter:", dateLimiter);
  const { id: productId } = useParams<{ id: string }>();
  const intProductId = parseInt(productId!, 10); // Convert id to integer
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_PRODUCT_DETAILS, {
    variables: { id: intProductId },
  });

  const product = data?.product;

  const {
    loading: dateRangeLoading,
    error: dateRangeError,
    data: dateRangeData,
  } = useQuery(GET_EXCLUDED_DATE_RANGES, {
    variables: { id: intProductId },
  });
  const {
    data: endDateData,
    error: endDateDataError,
    loading: endDateDataLoading,
  } = useQuery(GET_END_DATE, {
    variables: { id: intProductId, inputStartDate: startDate?.toISOString() },
    skip: !startDate,
    onCompleted: (data) => {
      console.log("🚀 ~ ProductDetail ~ data end:", data);
      if (data.endDate) setDateLimiter(new Date(data.endDate));
      else {
        setDateLimiter(
          new Date(new Date().setMonth(new Date().getMonth() + 1))
        );
      }
    },
  });

  const [
    createTransaction,
    { loading: transactionLoading, error: transactionError },
  ] = useMutation(BUY_PRODUCT_MUTATION, {
    onCompleted: (data) => {
      const message =
        data.createTransaction.type === "BUY"
          ? "Product bought successfully"
          : "Product borrowed successfully";
      console.log(message, data);
      toast.success(message);
      navigate("/user/transaction");
    },
    onError: (error) => {
      console.error("Error buying product", error);
      toast.error("Error buying product: " + error.message);
    },
    update: (cache, { data: { createTransaction } }) => {
      if (createTransaction.type === "BUY") {
        // Evict the bought product from the GET_BOUGHT_PRODUCTS cache
        cache.evict({ fieldName: "boughtProducts" });
      } else if (createTransaction.type === "RENT") {
        // Evict the borrowed product from the GET_BORROWED_PRODUCTS cache
        cache.evict({ fieldName: "borrowedProducts" });
        // Evict the excluded dates from the GET_EXCLUDED_DATE_RANGES cache
        cache.evict({ fieldName: "excludedDates" });
      }
      // Evict the product from the GET_AVAILABLE_PRODUCTS cache
      cache.evict({ fieldName: "products" });
    },
  });

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
    console.log(
      "🚀 ~ handleConfirmTransaction ~ transactionInput:",
      transactionInput
    );

    createTransaction({ variables: { input: transactionInput } }).catch(
      (error) => {
        console.error("Error buying product", transactionError?.message);
        toast.error("Error buying product: " + transactionError?.message);
      }
    );

    setIsModalOpen(false);
  };

  const excludeDateIntervals = dateRangeData?.excludedDates.map(
    (dateRange: any) => {
      const start = convertEpochToISO(Number(dateRange.startDate));
      const end = convertEpochToISO(Number(dateRange.endDate));
      console.log("🚀 ~ ProductDetail ~ start, end:", start, end);
      return { start, end };
    }
  );

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

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      <p className="text-gray-600 mb-2">
        <span className="font-semibold">Categories:</span>{" "}
        {product.category.map(formatCategory).join(", ")}
      </p>
      <p className="text-gray-600 mb-2">
        <span className="font-semibold">Price:</span> ${product.price}
      </p>
      <p className="text-gray-600 mb-6">{product.description}</p>

      <div className="flex gap-4">
        <Button
          variant="confirm"
          onClick={() => handleBuyORRentProduct("RENT")}
          disabled={transactionLoading}
        >
          Rent
        </Button>
        <Button
          variant="confirm"
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
              onChange={(date) => {
                console.log("🚀 ~ ProductDetail ~ date:", date);
                if (date) {
                  const localDate = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    0,
                    0,
                    0,
                    0
                  );
                  console.log(
                    "🚀 ~ ProductDetail ~ localDate:",
                    localDate.toISOString()
                  );
                  setStartDate(localDate);
                }
              }}
              excludeDateIntervals={excludeDateIntervals}
              minDate={new Date()}
              maxDate={new Date(new Date().setMonth(new Date().getMonth() + 1))}
              className="w-full px-4 py-2 border rounded-md"
            />
            <label className="block mt-4 mb-2">To:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => {
                console.log("🚀 ~ ProductDetail ~ date:", date);
                if (date) {
                  const localDate = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    23,
                    59,
                    59,
                    59
                  );
                  console.log("🚀 ~ ProductDetail ~ localDate:", localDate);
                  setEndDate(localDate);
                }
              }}
              excludeDateIntervals={excludeDateIntervals}
              className="w-full px-4 py-2 border rounded-md"
              maxDate={
                dateLimiter
                  ? dateLimiter
                  : new Date(new Date().setMonth(new Date().getMonth() + 1))
              }
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
