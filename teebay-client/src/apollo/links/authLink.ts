import { setContext } from "@apollo/client/link/context";
import { getAccessToken } from "../../utils/tokenManager";

// Middleware: Attach `Authorization` header
export const authLink = setContext(async (_, { headers }) => {
  const token = await getAccessToken(); // Retrieve cached or stored token

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
