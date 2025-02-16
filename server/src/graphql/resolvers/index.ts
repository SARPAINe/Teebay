import bcrypt from "bcrypt";
import { Context } from "../../context";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAndCheckTokenExpiry,
} from "../../utils/authUtils";
import { GraphQLError } from "graphql";

const resolvers = {
  Query: {
    users: async (_: any, __: any, { prisma }: Context) =>
      await prisma.user.findMany(),
    user: async (_: any, { id }: { id: number }, { prisma }: Context) => {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new GraphQLError("User not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return user;
    },
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
    createUser: async (
      _: any,
      { input }: { input: any },
      { prisma }: Context
    ) => {
      const { email, phone, firstName, lastName, address, password } = input;
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new GraphQLError("Email already in use", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          phone,
          firstName,
          lastName,
          address,
          password: hashedPassword,
        },
      });
      return user;
    },
    login: async (
      _: any,
      { email, password }: { email: string; password: string },
      { prisma, res }: Context
    ) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new GraphQLError("Invalid credentials", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      const accessToken = generateAccessToken(user.id);
      const refreshToken = await generateRefreshToken(user.id, prisma);
      res.cookie("accessToken", accessToken, { httpOnly: true });
      res.cookie("refreshToken", refreshToken, { httpOnly: true });
      return { accessToken, refreshToken };
    },
    logout: async (_: any, __: any, { prisma, req, res }: Context) => {
      const { refreshToken } = req.cookies;
      if (refreshToken) {
        await prisma.refreshToken.deleteMany({
          where: { token: refreshToken },
        });
      }
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return true;
    },
    refreshToken: async (_: any, __: any, { prisma, req, res }: Context) => {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        throw new GraphQLError("No refresh token provided", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });
      if (!storedToken) {
        throw new GraphQLError("Invalid refresh token", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      try {
        const { userId } = verifyAndCheckTokenExpiry(refreshToken);
        const newAccessToken = generateAccessToken(userId);
        res.cookie("accessToken", newAccessToken, { httpOnly: true });
        return { accessToken: newAccessToken, refreshToken };
      } catch (error) {
        throw new GraphQLError("Invalid refresh token", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
    },
    createProduct: async (
      _: any,
      { input }: { input: any },
      { prisma, req }: Context
    ) => {
      const { title, description, price, category } = input;
      const { accessToken } = req.cookies;
      const userId = verifyAndCheckTokenExpiry(accessToken).userId;
      const product = await prisma.product.create({
        data: { title, description, price, category, userId },
      });
      return product;
    },
    createTransaction: async (
      _: any,
      { input }: { input: any },
      { prisma, req }: Context
    ) => {
      const { accessToken } = req.cookies;
      const buyerId = verifyAndCheckTokenExpiry(accessToken).userId;
      const { type, productId, startDate, endDate } = input;
      const transaction = await prisma.transaction.create({
        data: { type, productId, buyerId, startDate, endDate },
      });
      return transaction;
    },
  },
};

export default resolvers;
