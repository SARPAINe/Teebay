import { Context } from "../../context";
import { GraphQLError } from "graphql";
import { extractToken, verifyAndCheckTokenExpiry } from "../../utils/authUtils";
import { Category } from "@prisma/client";

interface CreateProductInput {
  title: string;
  description: string;
  price: number;
  category: Category[];
}

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
      const { title, description, price, category } = input;
      const userId = verifyAndCheckTokenExpiry(accessToken).userId;
      const product = await prisma.product.create({
        data: {
          title,
          description,
          price,
          category,
          creator: { connect: { id: userId } },
        },
      });
      return product;
    },
  },
};

export default productResolvers;
