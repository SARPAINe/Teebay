import { Context } from "../../context";
import { GraphQLError } from "graphql";
import { CreateTransactionInput } from "../../types";
import { TransactionType } from "@prisma/client";
import { getAuthenticatedUserId } from "../../utils/authUtils";

const transactionResolvers = {
  Query: {
    transactions: async (_: any, __: any, { prisma }: Context) =>
      await prisma.transaction.findMany(),
    transaction: async (
      _: any,
      { id }: { id: number },
      { prisma }: Context
    ) => {
      const transaction = await prisma.transaction.findUnique({
        where: { id },
      });
      if (!transaction) {
        throw new GraphQLError("Transaction not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return transaction;
    },
  },
  Mutation: {
    createTransaction: async (
      _: any,
      { input }: { input: CreateTransactionInput },
      { prisma, req }: Context
    ) => {
      const buyerId = getAuthenticatedUserId(req);
      const { type, productId, startDate, endDate } = input;

      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { creatorId: true },
      });
      if (!product) {
        throw new GraphQLError("Product not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      if (product.creatorId === buyerId) {
        throw new GraphQLError("You cannot buy your own product", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      let transaction;
      if (type === TransactionType.BUY) {
        transaction = await prisma.$transaction(async (prisma) => {
          const createdTransaction = await prisma.transaction.create({
            data: { type, productId, buyerId, startDate },
          });
          await prisma.product.update({
            where: { id: productId },
            data: { owner: buyerId },
          });
          return createdTransaction;
        });
      } else if (type === TransactionType.RENT) {
        if (!endDate) {
          throw new GraphQLError("End date is required for rent transactions", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        } else {
          transaction = await prisma.transaction.create({
            data: { type, productId, buyerId, startDate, endDate },
          });
        }
      }

      return transaction;
    },
  },
};

export default transactionResolvers;
