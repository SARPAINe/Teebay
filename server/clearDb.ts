import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    // Clear all entries from the database
    await prisma.refreshToken.deleteMany({});
    await prisma.transaction.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});

    console.log("Database cleared successfully!");
  } catch (error) {
    console.error("Error clearing database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
