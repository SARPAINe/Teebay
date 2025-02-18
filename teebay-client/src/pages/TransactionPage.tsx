import { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_BOUGHT_PRODUCTS,
  GET_SOLD_PRODUCTS,
  GET_BORROWED_PRODUCTS,
  GET_LENT_PRODUCTS,
} from "../graphql/queries";
import ProductCard from "../components/ProductCard";

const TabButton = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    className={`px-4 py-2 font-semibold ${
      isActive
        ? "text-purple-600 border-b-2 border-purple-600"
        : "text-gray-600"
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

const ProductList = ({
  loading,
  error,
  data,
  productKey,
}: {
  loading: boolean;
  error: any;
  data: any;
  productKey: string;
}) => {
  if (loading) return <p>Loading items...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      {data?.[productKey].map((product: any) => (
        <ProductCard
          key={product.id}
          id={product.id}
          title={product.title}
          category={product.category}
          price={product.price}
          description={product.description}
        />
      ))}
    </div>
  );
};

const TransactionPage = () => {
  const [activeTab, setActiveTab] = useState<
    "bought" | "sold" | "borrowed" | "lent"
  >("bought");

  const {
    data: boughtData,
    loading: boughtLoading,
    error: boughtError,
  } = useQuery(GET_BOUGHT_PRODUCTS, { skip: activeTab !== "bought" });
  const {
    data: soldData,
    loading: soldLoading,
    error: soldError,
  } = useQuery(GET_SOLD_PRODUCTS, { skip: activeTab !== "sold" });
  const {
    data: borrowedData,
    loading: borrowedLoading,
    error: borrowedError,
  } = useQuery(GET_BORROWED_PRODUCTS, { skip: activeTab !== "borrowed" });
  const {
    data: lentData,
    loading: lentLoading,
    error: lentError,
  } = useQuery(GET_LENT_PRODUCTS, { skip: activeTab !== "lent" });

  const renderContent = () => {
    switch (activeTab) {
      case "bought":
        return (
          <ProductList
            loading={boughtLoading}
            error={boughtError}
            data={boughtData}
            productKey="boughtProducts"
          />
        );
      case "sold":
        return (
          <ProductList
            loading={soldLoading}
            error={soldError}
            data={soldData}
            productKey="soldProducts"
          />
        );
      case "borrowed":
        return (
          <ProductList
            loading={borrowedLoading}
            error={borrowedError}
            data={borrowedData}
            productKey="borrowedProducts"
          />
        );
      case "lent":
        return (
          <ProductList
            loading={lentLoading}
            error={lentError}
            data={lentData}
            productKey="lentProducts"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-6">
        Transaction History
      </h1>
      <div className="flex justify-center space-x-8 mb-8">
        <TabButton
          label="Bought"
          isActive={activeTab === "bought"}
          onClick={() => setActiveTab("bought")}
        />
        <TabButton
          label="Sold"
          isActive={activeTab === "sold"}
          onClick={() => setActiveTab("sold")}
        />
        <TabButton
          label="Borrowed"
          isActive={activeTab === "borrowed"}
          onClick={() => setActiveTab("borrowed")}
        />
        <TabButton
          label="Lent"
          isActive={activeTab === "lent"}
          onClick={() => setActiveTab("lent")}
        />
      </div>
      <div>{renderContent()}</div>
    </div>
  );
};

export default TransactionPage;
