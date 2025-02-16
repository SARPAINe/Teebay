import { mergeResolvers } from "@graphql-tools/merge";
import userResolvers from "./userResolvers";
import productResolvers from "./productResolvers";
import transactionResolvers from "./transactionResolvers";

const resolvers = mergeResolvers([
  userResolvers,
  productResolvers,
  transactionResolvers,
]);

export default resolvers;
