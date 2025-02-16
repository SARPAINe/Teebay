import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT ?? 4000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
};

if (!config.databaseUrl) {
  throw new Error("DATABASE_URL is not defined in the environment variables.");
}

if (!config.jwtSecret) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

export default config;
