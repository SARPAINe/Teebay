import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from "@apollo/client";
import { authLink } from "./links/authLink";
import { errorLink } from "./links/errorLink";

export function createApolloClient(): ApolloClient<any> {
  // HTTP Connection to the API
  const httpLink = new HttpLink({
    uri: "http://localhost:4000/graphql", // Replace with your GraphQL endpoint
    credentials: "include",
  });

  // Combine all links: authLink → errorLink → httpLink
  const link = ApolloLink.from([authLink, errorLink, httpLink]);

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
}
