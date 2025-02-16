const typeDefs = `#graphql
    type User {
        id: Int!
        email: String!
        phone: String!
        firstName: String!
        lastName: String!
        address: String!
        password: String!
        products: [Product!]
        transactions: [Transaction!]
    }

    type Product {
        id: Int!
        title: String!
        description: String!
        price: Float!
        rentPrice:Float!
        category: [Category!]!
        rentCategory:RentCategory!
        createdAt: String!
        isAvailable: Boolean!
        transactions: [Transaction!]
        creator: User!
        owner: Int!
    }

    type Transaction {
        id: Int!
        type: TransactionType!
        product: Product!
        buyer: User!
        startDate: String!
        endDate: String
        createdAt: String!
        updatedAt: String!
    }

    enum Category {
        ELECTRONICS
        FURNITURE
        HOME_APPLIANCES
        SPORTING_GOODS
        OUTDOOR
        TOYS
    }

    enum RentCategory{
        DAILY
        HOURLY}

    enum TransactionType {
        BUY
        RENT
    }

    input CreateUserInput {
        email: String!
        phone: String!
        firstName: String!
        lastName: String!
        address: String!
        password: String!
    }

    input CreateProductInput {
        title: String!
        description: String!
        price: Float!
        category: [Category!]!  # Update to accept an array of enums
        rentPrice:Float!
        rentCategory:RentCategory!
    }

    input EditProductInput{
        title: String
        description: String
        price: Float
        category: [Category!]
        rentPrice:Float
        rentCategory:RentCategory
    }

    input CreateTransactionInput {
        type: TransactionType!
        productId: Int!
        startDate: String!
        endDate: String
    }

    type Query {
        users: [User!]
        user(id: Int!): User
        products: [Product!]!
        userAvailableProducts: [Product!]!
        borrowedProducts: [Product!]!
        lentProducts: [Product!]!
        boughtProducts: [Product!]!
        soldProducts: [Product!]!
        product(id: Int!): Product
        transactions: [Transaction!]!
        transaction(id: Int!): Transaction
    }

    type Mutation {
        createUser(input: CreateUserInput!): User!
        createProduct(input: CreateProductInput!): Product!
        editProduct(id:ID!,editInput:EditProductInput): Product!
        deleteProduct(id:ID!): Product!
        createTransaction(input: CreateTransactionInput!): Transaction!
        login(email: String!, password: String!): AuthPayload!
        logout: Boolean!
        refreshToken: AuthPayload!
    }

    type AuthPayload {
        accessToken: String!
        refreshToken: String!
    }
`;

export default typeDefs;
