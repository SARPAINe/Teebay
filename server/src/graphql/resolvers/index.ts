import bcrypt from "bcrypt";
import { Context } from "../../context";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAndCheckTokenExpiry,
} from "../../utils/authUtils";

const resolvers = {
  Query: {
    users: async (_: any, __: any, { prisma }: Context) =>
      await prisma.user.findMany(),
    user: async (_: any, { id }: { id: number }, { prisma }: Context) =>
      await prisma.user.findUnique({ where: { id } }),
    products: async (_: any, __: any, { prisma }: Context) =>
      await prisma.product.findMany(),
    product: async (_: any, { id }: { id: number }, { prisma }: Context) =>
      await prisma.product.findUnique({ where: { id } }),
    transactions: async (_: any, __: any, { prisma }: Context) =>
      await prisma.transaction.findMany(),
    transaction: async (_: any, { id }: { id: number }, { prisma }: Context) =>
      await prisma.transaction.findUnique({ where: { id } }),
  },
  Mutation: {
    createUser: async (
      _: any,
      { input }: { input: any },
      { prisma }: Context
    ) => {
      const { email, phone, firstName, lastName, address, password } = input;
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
        throw new Error("Invalid credentials");
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
        throw new Error("No refresh token provided");
      }
      try {
        const payload = verifyAndCheckTokenExpiry(refreshToken);
        const storedToken = await prisma.refreshToken.findUnique({
          where: { token: refreshToken },
        });
        if (!storedToken) {
          throw new Error("Invalid refresh token");
        }
        const newAccessToken = generateAccessToken(payload.userId);
        res.cookie("accessToken", newAccessToken, { httpOnly: true });
        return { accessToken: newAccessToken, refreshToken };
      } catch (error) {
        throw new Error("Invalid refresh token");
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
