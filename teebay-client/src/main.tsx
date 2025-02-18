import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import App from "./App";
import { createApolloClient } from "./apollo/client";
import "./index.css";

// Create a new Apollo Client
const client = createApolloClient();

// Render the application with ApolloProvider
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
);
