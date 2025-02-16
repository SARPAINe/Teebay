import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import config from "../config";

export const generateAccessToken = (userId: number): string => {
  return jwt.sign({ userId }, config.jwtSecret!, { expiresIn: "15m" });
};

export const generateRefreshToken = async (
  userId: number,
  prisma: PrismaClient
): Promise<string> => {
  const refreshToken = jwt.sign({ userId }, config.jwtSecret!, {
    expiresIn: "7d",
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
    throw new Error("Token expired");
  }
  return { userId: decodedToken.userId };
};
