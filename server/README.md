# Server Documentation

This README file provides an overview of the server-side implementation of the full product project, which is built using Node.js, Express, GraphQL, and Prisma with PostgreSQL.

## Project Structure

The server directory contains the following key components:

- **src/**: Contains the source code for the server.
  - **graphql/**: Contains the GraphQL schema and resolvers.
    - **resolvers/**: Contains resolver functions for handling GraphQL queries and mutations.
    - **schema/**: Contains the GraphQL schema definition.
  - **prisma/**: Contains the Prisma schema for the PostgreSQL database.
  - **types/**: Contains TypeScript types and interfaces used throughout the server application.
  - **index.ts**: The entry point for the Node.js server, setting up the Express server and Apollo Server.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL database

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd full-product-project/server
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Set up your PostgreSQL database and update the connection string in the Prisma schema file located at `src/prisma/schema.prisma`.

### Running the Server

To start the server, run the following command:
```
npm run dev
```

This will start the server in development mode.

### GraphQL Playground

Once the server is running, you can access the GraphQL Playground at `http://localhost:4000/graphql` to test your queries and mutations.

## Scripts

- `dev`: Starts the server in development mode.
- `build`: Compiles the TypeScript code to JavaScript.
- `start`: Starts the compiled server.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.