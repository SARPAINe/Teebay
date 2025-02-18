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

const setHttpPlugin = {
  async requestDidStart() {
    return {
      async willSendResponse({ response }: { response: any }) {
        if (response.body.kind === "single") {
          const errors = response.body.singleResult.errors;

          if (errors && errors.length > 0) {
            const error = errors[0];
            const errorCode = error.extensions?.code;

            switch (errorCode) {
              case "BAD_USER_INPUT":
                response.http.status = 400;
                break;
              case "UNAUTHENTICATED":
                response.http.status = 401;
                break;
              case "FORBIDDEN":
                response.http.status = 403;
                break;
              case "NOT_FOUND":
                response.http.status = 404;
                break;
              case "INTERNAL_SERVER_ERROR":
                response.http.status = 500;
                break;
              default:
                response.http.status = 500;
                break;
            }
          }
        }
      },
    };
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [setHttpPlugin],
});

async function startServer() {
  try {
    await server.start();
    app.use(cors({ origin: "http://localhost:5173", credentials: true }));
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
