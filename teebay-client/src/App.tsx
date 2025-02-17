import { useQuery } from "@apollo/client";
import { GET_AVAILABLE_PRODUCTS } from "./graphql/queries";

function App() {
  const { loading, error, data } = useQuery(GET_AVAILABLE_PRODUCTS);
  console.log("🚀  App  data:", data);
  return (
    <p className="border-solid border-8 border-blue-500 p-4 text-2xl">
      Click on the Vite and React logos to learn more
    </p>
  );
}

export default App;
