# Teebay Project

This project is a full-stack application built with React, Apollo Client, Node.js, Express, GraphQL, and Prisma, using TypeScript. It consists of a client-side application and a server-side application, both of which are structured to work seamlessly together.

## Project Structure

```
Teebay
├── teebay-client                # Client-side application
│   ├── src                      # Source files for the client
│   ├── public                   # Public assets for the client
│   ├── package.json             # Client package configuration
│   ├── tsconfig.json            # TypeScript configuration for the client
│   ├── Dockerfile               # Dockerfile for the client
│   ├── postcss.config.cjs       # PostCSS configuration
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── vite.config.ts           # Vite configuration
│   └── README.md                # Client documentation
├── server                       # Server-side application
│   ├── src                      # Source files for the server
│   ├── package.json             # Server package configuration
│   ├── tsconfig.json            # TypeScript configuration for the server
│   ├── Dockerfile               # Dockerfile for the server
│   ├── nodemon.json             # Nodemon configuration
│   ├── clearDb.ts               # Script to clear the database
│   ├── populateDb.ts            # Script to populate the database
│   └── README.md                # Server documentation
├── docker-compose.yml           # Docker Compose configuration
├── .gitignore                   # Git ignore file
└── README.md                    # Project documentation
```

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL (for the database)
- Docker, Docker-compose (for containerization)

### Running with Docker

1. Stop and remove any existing containers:

   ```bash
   sudo docker-compose down
   ```

2. Build and start the containers:

   ```bash
   sudo docker-compose up --build
   ```

3. The client application will be available at `http://localhost:5173`.
4. The server will be running on `http://localhost:4000`.
