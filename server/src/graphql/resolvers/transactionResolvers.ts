import { Context } from "../../context";
import { GraphQLError } from "graphql";
import { CreateTransactionInput } from "../../types";
import { TransactionType } from "@prisma/client";
import { getAuthenticatedUserId } from "../../utils/authUtils";
import { getCurrentLocalISOTime, isoToLocalTime } from "../../utils/dateUtils";

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
    excludedDates: async (
      _: any,
      { id }: { id: number },
      { prisma }: Context
    ) => {
      const transaction = await prisma.transaction.findMany({
        where: { productId: id, type: TransactionType.RENT },
        select: { startDate: true, endDate: true },
      });
      console.log("🚀 ~ transaction:", transaction);
      if (!transaction) {
        return [];
      }
      const dates: any = [];
      transaction.forEach(({ startDate, endDate }) => {
        if (startDate && endDate) {
          dates.push({
            startDate: startDate,
            endDate: endDate,
          });
        }
      });
      return dates;
    },
    endDate: async (
      _: any,
      { inputStartDate, id }: { inputStartDate: string; id: number },
      { prisma }: Context
    ) => {
      const transactions = await prisma.transaction.findMany({
        where: {
          productId: id,
          type: TransactionType.RENT,
          startDate: {
            gt: inputStartDate,
          },
        },
        select: { endDate: true, startDate: true },
      });
      console.log("🚀 ~ transactions:", transactions);

      if (transactions.length === 0) {
        return null;
      }

      // Sort transactions by startDate
      transactions.sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
      console.log("🚀 ~ transactions:", transactions);

      // Get the endDate of the transaction with the lowest startDate
      const earliestTransaction = transactions[0];
      if (!earliestTransaction.endDate) {
        throw new GraphQLError("End date is null", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return earliestTransaction.startDate.toISOString();
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

      const localISOTime = getCurrentLocalISOTime();

      const transactions = await prisma.transaction.findMany({
        where: {
          buyerId,
          productId,
          type: TransactionType.RENT,
          endDate: {
            gt: localISOTime,
          },
        },
      });
      console.log("🚀 ~ transactions:", transactions);

      if (transactions.length > 0) {
        throw new GraphQLError(
          "You already have an active rent transaction for this product",
          {
            extensions: { code: "BAD_USER_INPUT" },
          }
        );
      }

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
        throw new GraphQLError("You cannot buy/rent your own product", {
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
            data: { owner: buyerId, isAvailable: false },
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
