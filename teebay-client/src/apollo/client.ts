import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from "@apollo/client";
import { authLink } from "./links/authLink";
import { errorLink } from "./links/errorLink";

// HTTP Connection to the API
const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql", // Replace with your GraphQL endpoint
  credentials: "include",
});

// Combine all links: authLink → errorLink → httpLink
const link = ApolloLink.from([authLink, errorLink, httpLink]);

// Create and export the Apollo Client instance
const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
