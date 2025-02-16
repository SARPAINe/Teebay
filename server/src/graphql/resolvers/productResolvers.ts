import { Context } from "../../context";
import { GraphQLError } from "graphql";
import { extractToken, verifyAndCheckTokenExpiry } from "../../utils/authUtils";
import { CreateProductInput, EditProductInput } from "../../types";

const productResolvers = {
  Query: {
    products: async (_: any, __: any, { prisma }: Context) =>
      await prisma.product.findMany(),
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
      const accessToken = extractToken(req, "accessToken");
      if (!accessToken) {
        throw new GraphQLError("No access token provided", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      const { title, description, price, category, rentPrice, rentCategory } =
        input;
      const userId = verifyAndCheckTokenExpiry(accessToken).userId;
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
      const accessToken = extractToken(req, "accessToken");
      if (!accessToken) {
        throw new GraphQLError("No access token provided", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      const userId = verifyAndCheckTokenExpiry(accessToken).userId;
      const existingProduct = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!existingProduct) {
        throw new GraphQLError("Product not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      if (existingProduct.userId !== userId) {
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
      const accessToken = extractToken(req, "accessToken");
      if (!accessToken) {
        throw new GraphQLError("No access token provided", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      const userId = verifyAndCheckTokenExpiry(accessToken).userId;
      const existingProduct = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!existingProduct) {
        throw new GraphQLError("Product not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      if (existingProduct.userId !== userId) {
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
