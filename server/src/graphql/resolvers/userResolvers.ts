import bcrypt from "bcrypt";
import { Context } from "../../context";
import { GraphQLError } from "graphql";
import {
  generateAccessToken,
  generateRefreshToken,
  extractToken,
  verifyAndCheckTokenExpiry,
} from "../../utils/authUtils";

interface CreateUserInput {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

const userResolvers = {
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
  },
  Mutation: {
    createUser: async (
      _: any,
      { input }: { input: CreateUserInput },
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
      { email, password }: LoginInput,
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
      const refreshToken = extractToken(req, "refreshToken");
      if (!refreshToken) {
        throw new GraphQLError("No refresh token provided", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return true;
    },
    refreshToken: async (_: any, __: any, { prisma, req, res }: Context) => {
      const refreshToken = extractToken(req, "refreshToken");
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
  },
};

export default userResolvers;
