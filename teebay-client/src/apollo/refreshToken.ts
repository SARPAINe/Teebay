import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { REFRESH_TOKEN_MUTATION } from "../graphql/mutation";
import { setAccessToken } from "../utils/tokenManager";

// Create a separate ApolloClient for refreshing tokens
const refreshClient = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
  credentials: "include", // Include cookies
});

// Refresh token function
export async function refreshToken(): Promise<string | null> {
  console.log("[refreshToken] Attempting to refresh token...");
  try {
    const response = await refreshClient.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
    });

    if (response?.data?.refreshToken) {
      const newAccessToken = response.data.refreshToken.accessToken;
      setAccessToken(newAccessToken); // Persist the new token
      return newAccessToken;
    }

    throw new Error("Token refresh failed. No token returned.");
  } catch (err) {
    console.error("[refreshToken] Error refreshing token:", err.message);
    return null;
  }
}
