# Part 4 Documentation

## Overview

The Teebay Project is a full-stack application built with React, Apollo Client, Node.js, Express, GraphQL, and Prisma, using TypeScript. This document provides a technical explanation of how various functionalities of the application work, including user authentication, product management, and transaction handling.

## Functionalities

### 1. User Signin and Signup

#### Signin

- **Frontend**: The `SignIn` component uses `react-hook-form` for form handling and validation with `zod`. The form data is submitted to the `LOGIN_MUTATION` GraphQL mutation.
- **Backend**: The `login` mutation in `userResolvers.ts` verifies the user's credentials using bcrypt. If valid, it generates an access token and a refresh token, which are sent back to the client and stored in cookies.

#### Signup

- **Frontend**: The `SignUp` component also uses `react-hook-form` and `zod` for form handling and validation. The form data is submitted to the `REGISTER_MUTATION` GraphQL mutation.
- **Backend**: The `createUser` mutation in `userResolvers.ts` creates a new user in the database after hashing the password with bcrypt.

### 2. Creating a Product

- **Frontend**: The `CreateProduct` component uses `react-hook-form` and `zod` for form handling and validation. The form data is submitted to the `CREATE_PRODUCT_MUTATION` GraphQL mutation.
- **Backend**: The `createProduct` mutation in `productResolvers.ts` creates a new product in the database, associating it with the authenticated user.

### 3. Editing a Product

- **Frontend**: The `EditProduct` component fetches the product details using the `GET_PRODUCT_DETAILS` query and populates the form fields. The updated data is submitted to the `UPDATE_PRODUCT_MUTATION` GraphQL mutation.
- **Backend**: The `editProduct` mutation in `productResolvers.ts` updates the product details in the database, ensuring that only the product creator can edit it.

### 4. List All Available Products for Sale

- **Frontend**: The `Product` component fetches the list of available products using the `GET_AVAILABLE_PRODUCTS` query and displays them using the `ProductCard` component.
- **Backend**: The `products` query in `productResolvers.ts` retrieves all products marked as available from the database.

### 5. Buy a Product

- **Frontend**: The `ProductDetail` component allows users to buy a product by submitting the `BUY_PRODUCT_MUTATION` GraphQL mutation.
- **Backend**: The `createTransaction` mutation in `transactionResolvers.ts` handles the purchase transaction, updating the product's owner and availability status. There are two types of transaction, during buy transaction type is `BUY`

### 6. Rent a Product

- **Frontend**: The `ProductDetail` component allows users to rent a product by selecting a rental period and submitting the `BUY_PRODUCT_MUTATION` GraphQL mutation.
- **Backend**: The `createTransaction` mutation in `transactionResolvers.ts` handles the rental transaction, ensuring that the rental period does not overlap with existing rentals.During rent transaction type is `RENT`

### 7. Display All the Products Bought/Sold/Borrowed/Lent by the User

- **Frontend**: The `TransactionPage` component fetches and displays the user's transactions using the `GET_BOUGHT_PRODUCTS`, `GET_SOLD_PRODUCTS`, `GET_BORROWED_PRODUCTS`, and `GET_LENT_PRODUCTS` queries.
- **Backend**: The respective queries in `transactionResolvers.ts` retrieve the user's transactions from the database, including the associated products. The queries are structured to filter transactions based on the user ID and transaction type (bought, sold, borrowed, lent). Each query joins the transaction data with the product data to provide comprehensive details about each transaction. The backend ensures that only authenticated users can access their transaction data by verifying the user's token before executing the query.

### 8. Database Schema Changes

- Used Prisma migrations to handle database schema changes and ensure consistency across environments.

### 9. Error Handling

- Implemented comprehensive error handling in both the client and server to provide meaningful error messages to users.

### 10. Form Validation

- Used `zod` for schema-based form validation to ensure data integrity and provide user-friendly error messages.

## Corner Cases and Solutions

### 1. Token Expiry Handling:

- Implemented an `errorLink` in Apollo Client to handle token expiry and refresh tokens automatically.

### How `authLink`, `errorLink`, and `httpLink` Work Together

- **authLink**: This link is responsible for attaching the authentication token to each outgoing request. It intercepts the request and adds the `Authorization` header with the token, ensuring that the server can authenticate the user.

- **errorLink**: This link handles errors that occur during the request. Specifically, it checks for authentication errors (e.g., token expiry) and attempts to refresh the token. If the token is successfully refreshed, it retries the failed request with the new token. This ensures that the user does not experience interruptions due to token expiry.

- **httpLink**: This link is responsible for making the actual HTTP request to the GraphQL endpoint. It sends the request to the server and handles the response.

By combining these links in the order `authLink → errorLink → httpLink`, the Apollo Client ensures that each request is authenticated, errors are handled gracefully, and the request is sent to the correct endpoint. This setup provides a robust mechanism for managing authentication and error handling in the application.

### 2. Real-Time Updates:

- Used Apollo Client's cache and refetch queries to ensure the UI is updated in real-time when data changes.

### How Apollo Client's Cache and Refetch Queries Work for Real-Time Updates

- **Apollo Client's Cache**: Apollo Client uses an in-memory cache to store the results of GraphQL queries. This cache allows the client to quickly retrieve data without making unnecessary network requests. When a query is executed, Apollo Client first checks the cache for existing data. If the data is found, it is returned immediately. If not, a network request is made to fetch the data from the server.

- **Refetch Queries**: Refetch queries are used to explicitly refresh the data in the cache by making a new network request. This is particularly useful when the data has changed on the server, and the client needs to display the updated data. In the Teebay Project, refetch queries are used in various components to ensure that the UI reflects the latest data.

For example, after a user creates or edits a product, the relevant queries are refetched to update the list of products displayed to the user. This ensures that any changes made by the user are immediately visible in the UI.

By combining Apollo Client's cache and refetch queries, the Teebay Project ensures that the UI is always up-to-date with the latest data from the server. This provides a seamless and responsive user experience, as users can see the results of their actions in real-time.

### 3. Product Deletion:

Ensured that products with active rental transactions cannot be deleted by checking for active transactions before allowing deletion.Before allowing a product to be deleted, the `deleteProduct` mutation in `productResolvers.ts` checks for any active rental transactions associated with the product. This is done by querying the `Transaction` table in the database to see if there are any transactions with the type `RENT` and an end date that is in the future. If such transactions exist, the deletion is blocked, and an appropriate error message is returned to the client.

By performing this check, the application ensures that products currently rented out cannot be deleted, maintaining data integrity and preventing potential issues for users who have rented the product.

### 4. Rent Time Overlap:

In the UI, we use the `excludeDateIntervals` prop of the `DatePicker` component to exclude dates that are not available for renting the product because someone else is borrowing it during that time. This ensures that users can only select dates that are available for renting the product.

The `DatePicker` component is used to select the start and end dates for renting a product. The `excludeDateIntervals` prop is populated with date ranges fetched from the `GET_EXCLUDED_DATE_RANGES` query. This query retrieves the date ranges during which the product is already rented out, and these dates are excluded from the date picker to prevent overlapping rentals.

The `GET_EXCLUDED_DATE_RANGES` query fetches the date ranges during which the product is already rented out. The data is used to populate the `excludeDateIntervals` prop of the `DatePicker` component. Additionally, the `GET_END_DATE` query fetches the latest possible end date based on the selected start date. When a user selects a start date, the `GET_END_DATE` query is executed to determine the available end dates. The `maxDate` prop of the `DatePicker` component for the end date is set based on the result of this query.

When a user selects a start date, the `GET_END_DATE` query is executed with the selected start date as a variable. The query returns the latest possible end date, which is then used to set the `maxDate` prop of the `DatePicker` component for the end date. This ensures that only available end dates can be selected based on the chosen start date.

By using these queries and the `excludeDateIntervals` prop, the UI ensures that users can only select valid rental periods, preventing any overlap with existing rentals. This approach provides a seamless and user-friendly experience for selecting rental periods while maintaining the integrity of the rental system.

## Conclusion

The Teebay Project is a robust full-stack application that leverages modern technologies to provide a seamless user experience. The use of Docker for containerization ensures that the application can be easily deployed and run in different environments. The project structure and code organization make it easy to maintain and extend the application in the future.
