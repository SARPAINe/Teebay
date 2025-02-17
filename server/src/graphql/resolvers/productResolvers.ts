import { Context } from "../../context";
import { GraphQLError } from "graphql";
import { getAuthenticatedUserId } from "../../utils/authUtils";
import { CreateProductInput, EditProductInput } from "../../types";
import { TransactionType } from "@prisma/client";

const productResolvers = {
  Query: {
    products: async (_: any, __: any, { prisma }: Context) =>
      await prisma.product.findMany({
        where: { isAvailable: true },
      }),
    userAvailableProducts: async (
      _: any,
      __: any,
      { prisma, req }: Context
    ) => {
      const userId = getAuthenticatedUserId(req);
      const products = await prisma.product.findMany({
        where: { creatorId: userId, owner: userId },
      });
      return products;
    },
    borrowedProducts: async (_: any, __: any, { prisma, req }: Context) => {
      const userId = getAuthenticatedUserId(req);
      const today = new Date();
      const transactions = await prisma.transaction.findMany({
        where: {
          buyerId: userId,
          type: TransactionType.RENT,
          endDate: {
            gt: today,
          },
        },
        include: {
          product: true,
        },
      });
      const products = transactions.map((transaction) => transaction.product);
      return products;
    },
    lentProducts: async (_: any, __: any, { prisma, req }: Context) => {
      const userId = getAuthenticatedUserId(req);
      const today = new Date();
      const transactions = await prisma.transaction.findMany({
        where: {
          product: { owner: userId },
          type: TransactionType.RENT,
          endDate: {
            gt: today,
          },
        },
        include: {
          product: true,
        },
      });
      const products = transactions.map((transaction) => transaction.product);
      return products;
    },
    boughtProducts: async (_: any, __: any, { prisma, req }: Context) => {
      const userId = getAuthenticatedUserId(req);
      const transactions = await prisma.transaction.findMany({
        where: {
          buyerId: userId,
          type: TransactionType.BUY,
        },
        include: {
          product: true,
        },
      });
      const products = transactions.map((transaction) => transaction.product);
      return products;
    },
    soldProducts: async (_: any, __: any, { prisma, req }: Context) => {
      const userId = getAuthenticatedUserId(req);
      const transactions = await prisma.transaction.findMany({
        where: {
          product: { creatorId: userId },
          type: TransactionType.BUY,
        },
        include: {
          product: true,
        },
      });
      const products = transactions.map((transaction) => transaction.product);
      return products;
    },
    product: async (_: any, { id }: { id: number }, { prisma }: Context) => {
      const product = await prisma.product.findUnique({ where: { id } });
      if (!product) {
        throw new GraphQLError("Product not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return product;
    },
  },
  Mutation: {
    createProduct: async (
      _: any,
      { input }: { input: CreateProductInput },
      { prisma, req }: Context
    ) => {
      const userId = getAuthenticatedUserId(req);
      const { title, description, price, category, rentPrice, rentCategory } =
        input;
      const existingProduct = await prisma.product.findFirst({
        where: {
          title,
        },
      });
      if (existingProduct) {
        throw new GraphQLError("Product already exists", {
          extensions: { code: "BAD_REQUEST" },
        });
      }
      const product = await prisma.product.create({
        data: {
          title,
          description,
          price,
          category,
          rentPrice,
          rentCategory,
          owner: userId,
          creator: { connect: { id: userId } },
        },
      });
      return product;
    },
    editProduct: async (
      _: any,
      { id, editInput }: { id: number; editInput: EditProductInput },
      { prisma, req }: Context
    ) => {
      const productId = Number(id); // Ensure the id is treated as a number
      const userId = getAuthenticatedUserId(req);
      const existingProduct = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!existingProduct) {
        throw new GraphQLError("Product not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      if (existingProduct.creatorId !== userId) {
        throw new GraphQLError("Not authorized to edit this product", {
          extensions: { code: "FORBIDDEN" },
        });
      }
      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: editInput,
      });
      return updatedProduct;
    },
    deleteProduct: async (
      _: any,
      { id }: { id: number },
      { prisma, req }: Context
    ) => {
      const productId = Number(id); // Ensure the id is treated as a number
      const userId = getAuthenticatedUserId(req);
      const existingProduct = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!existingProduct) {
        throw new GraphQLError("Product not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      if (existingProduct.creatorId !== userId) {
        throw new GraphQLError("Not authorized to delete this product", {
          extensions: { code: "FORBIDDEN" },
        });
      }
      const deletedProduct = await prisma.product.delete({
        where: { id: productId },
      });
      return deletedProduct;
    },
  },
};

export default productResolvers;
