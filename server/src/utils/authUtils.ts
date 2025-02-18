import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import config from "../config";
import { Request } from "express";
import { GraphQLError } from "graphql";

export const generateAccessToken = (userId: number): string => {
  return jwt.sign({ userId }, config.jwtSecret!, {
    expiresIn: config.accessTokeExpiry as any,
  });
};

export const generateRefreshToken = async (
  userId: number,
  prisma: PrismaClient
): Promise<string> => {
  const refreshToken = jwt.sign({ userId }, config.jwtSecret!, {
    expiresIn: config.refreshTokenExpiry as any,
  });
  await prisma.refreshToken.create({
    data: { token: refreshToken, userId },
  });
  return refreshToken;
};

export const verifyAndCheckTokenExpiry = (
  token: string
): { userId: number } => {
  const decodedToken = jwt.verify(token, config.jwtSecret!) as {
    userId: number;
    exp: number;
  };
  if (Date.now() >= decodedToken.exp * 1000) {
    throw new GraphQLError("Token expired", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
  return { userId: decodedToken.userId };
};

export const extractToken = (
  req: Request,
  tokenType: "accessToken" | "refreshToken"
): string | null => {
  // Check for token in cookies
  let token = req.cookies[tokenType];

  // If not found in cookies, check headers
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  return token || null;
};

export const getAuthenticatedUserId = (req: Request): number => {
  const accessToken = extractToken(req, "accessToken");
  if (!accessToken) {
    throw new GraphQLError("No access token provided", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }
  return verifyAndCheckTokenExpiry(accessToken).userId;
};
