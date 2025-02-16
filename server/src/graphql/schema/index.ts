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
        category: Category!
        createdAt: String!
        isAvailable: Boolean!
        transactions: [Transaction!]
        creator: User!
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
        category: Category!
        userId: Int!
    }

    input CreateTransactionInput {
        type: TransactionType!
        productId: Int!
        buyerId: Int!
        startDate: String!
        endDate: String
    }

    type Query {
        users: [User!]
        user(id: Int!): User
        products: [Product!]!
        product(id: Int!): Product
        transactions: [Transaction!]!
        transaction(id: Int!): Transaction
    }

    type Mutation {
        createUser(input: CreateUserInput!): User!
        createProduct(input: CreateProductInput!): Product!
        createTransaction(input: CreateTransactionInput!): Transaction!
    }
`;

export default typeDefs;
