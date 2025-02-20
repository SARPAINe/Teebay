import { onError } from "@apollo/client/link/error";
import { refreshToken } from "../refreshToken";
import { setAccessToken } from "../../utils/tokenManager";
import { Observable } from "@apollo/client";

export const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  console.log("🚀 ~ graphQLErrors in errorLink:", graphQLErrors);
  const graphqlErrorMessage = graphQLErrors?.[0]?.message;

  if (
    graphqlErrorMessage === "jwt expired" ||
    graphqlErrorMessage === "No access token provided"
  ) {
    console.warn("[errorLink] Detected 401 Unauthorized or expired token.");

    // Return a new Observable to retry the failed request
    return new Observable((observer) => {
      refreshToken()
        .then((newToken) => {
          if (newToken) {
            console.log("[errorLink] Successfully refreshed token.");
            setAccessToken(newToken); // Update memory and storage with new token

            // Update headers with the new token
            operation.setContext(({ headers = {} }) => ({
              headers: {
                ...headers,
                authorization: `Bearer ${newToken}`,
              },
            }));

            // Retry the failed request
            forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          } else {
            console.error("[errorLink] Token refresh failed. Logging out...");
            setAccessToken(null); // Clear tokens
            window.location.href = "/signin"; // Redirect to login page
          }
        })
        .catch((error) => {
          console.error("[errorLink] Token refresh failed with error:", error);
          observer.error(error); // Trigger failure
        });
    });
  }

  return forward(operation); // Continue with the request
});
