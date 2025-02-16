# Full Product Project

This project is a full-stack application built with React, Apollo Client, Node.js, Express, GraphQL, and Prisma, using TypeScript. It consists of a client-side application and a server-side application, both of which are structured to work seamlessly together.

## Project Structure

```
full-product-project
├── client                # Client-side application
│   ├── src               # Source files for the client
│   ├── public            # Public assets for the client
│   ├── package.json      # Client package configuration
│   ├── tsconfig.json     # TypeScript configuration for the client
│   └── README.md         # Client documentation
├── server                # Server-side application
│   ├── src               # Source files for the server
│   ├── package.json      # Server package configuration
│   ├── tsconfig.json     # TypeScript configuration for the server
│   └── README.md         # Server documentation
├── .gitignore            # Git ignore file
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL (for the database)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd full-product-project
   ```

2. Install dependencies for the client:
   ```
   cd client
   npm install
   ```

3. Install dependencies for the server:
   ```
   cd server
   npm install
   ```

### Running the Application

1. Start the server:
   ```
   cd server
   npm run dev
   ```

2. Start the client:
   ```
   cd client
   npm start
   ```

### Usage

- The client application will be available at `http://localhost:3000`.
- The server will be running on `http://localhost:4000`.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

### License

This project is licensed under the MIT License. See the LICENSE file for details.