import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import App from "./App";
import client from "./apollo/client"; // Import the Apollo Client instance
import { AuthProvider } from "./context/AuthContext"; // Import the AuthProvider
import "./index.css";

// Render the application with ApolloProvider and AuthProvider
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>
);
