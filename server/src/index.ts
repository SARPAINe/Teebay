import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import { createContext, Context } from "./context";

const app = express();

const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

async function startServer() {
  try {
    await server.start();
    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());
    app.use(
      "/graphql",
      expressMiddleware(server, {
        context: async ({ req, res }) => createContext(req, res),
      })
    );

    app.listen(config.port, () => {
      console.log(`🚀 Server ready at http://localhost:${config.port}/graphql`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();
