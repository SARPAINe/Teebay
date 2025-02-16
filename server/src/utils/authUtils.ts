import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import config from "../config";
import { Request } from "express";

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

export const extractToken = (
  req: Request,
  tokenType: "accessToken" | "refreshToken"
): string | null => {
  // Check for token in cookies
  let token = req.cookies[tokenType];

  // If not found in cookies, check headers
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  return token || null;
};
