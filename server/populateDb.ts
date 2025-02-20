import {
  PrismaClient,
  TransactionType,
  Category,
  RentCategory,
} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create two random users
  const user1 = await prisma.user.create({
    data: {
      email: "user1@gmail.com",
      phone: "1234567890",
      firstName: "John",
      lastName: "Doe",
      address: "123 Main St",
      password: await bcrypt.hash("secret", 10),
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "user2@gmail.com",
      phone: "0987654321",
      firstName: "Jane",
      lastName: "Smith",
      address: "456 Elm St",
      password: await bcrypt.hash("secret", 10),
    },
  });

  // Create multiple products for each user
  const productsUser1 = await prisma.product.createMany({
    data: [
      {
        title: "Laptop",
        description: "A powerful laptop",
        price: 1000,
        category: [Category.ELECTRONICS],
        rentPrice: 50,
        rentCategory: RentCategory.DAILY,
        owner: user1.id,
        creatorId: user1.id,
      },
      {
        title: "Bike",
        description: "A mountain bike",
        price: 500,
        category: [Category.SPORTING_GOODS],
        rentPrice: 20,
        rentCategory: RentCategory.DAILY,
        owner: user1.id,
        creatorId: user1.id,
      },
      {
        title: "Phone",
        description: "A smartphone",
        price: 700,
        category: [Category.ELECTRONICS],
        rentPrice: 30,
        rentCategory: RentCategory.DAILY,
        owner: user1.id,
        creatorId: user1.id,
      },
    ],
  });

  const productsUser2 = await prisma.product.createMany({
    data: [
      {
        title: "Camera",
        description: "A DSLR camera",
        price: 800,
        category: [Category.ELECTRONICS],
        rentPrice: 40,
        rentCategory: RentCategory.DAILY,
        owner: user2.id,
        creatorId: user2.id,
      },
      {
        title: "Tent",
        description: "A camping tent",
        price: 200,
        category: [Category.OUTDOOR],
        rentPrice: 15,
        rentCategory: RentCategory.DAILY,
        owner: user2.id,
        creatorId: user2.id,
      },
      {
        title: "Watch",
        description: "A smartwatch",
        price: 300,
        category: [Category.ELECTRONICS],
        rentPrice: 25,
        rentCategory: RentCategory.DAILY,
        owner: user2.id,
        creatorId: user2.id,
      },
    ],
  });

  // Fetch the created products
  const user1Products = await prisma.product.findMany({
    where: { creatorId: user1.id },
  });
  const user2Products = await prisma.product.findMany({
    where: { creatorId: user2.id },
  });

  // User1 buys 1 product from User2
  const user1BuysProductFromUser2 = user2Products[0];
  await prisma.transaction.create({
    data: {
      type: TransactionType.BUY,
      productId: user1BuysProductFromUser2.id,
      buyerId: user1.id,
      startDate: new Date().toISOString(),
    },
  });
  await prisma.product.update({
    where: { id: user1BuysProductFromUser2.id },
    data: { owner: user1.id, isAvailable: false },
  });

  // User1 borrows 1 product from User2
  const user1BorrowsProductFromUser2 = user2Products[1];
  const user1BorrowStartDate = new Date();
  const user1BorrowEndDate = new Date(user1BorrowStartDate);
  user1BorrowStartDate.setHours(0, 0, 0, 0);
  user1BorrowEndDate.setDate(user1BorrowEndDate.getDate() + 7); // 1 week rental
  user1BorrowEndDate.setHours(23, 59, 59, 999);
  await prisma.transaction.create({
    data: {
      type: TransactionType.RENT,
      productId: user1BorrowsProductFromUser2.id,
      buyerId: user1.id,
      startDate: user1BorrowStartDate.toISOString(),
      endDate: user1BorrowEndDate.toISOString(), // 1 week rental
    },
  });

  // User2 buys 1 product from User1
  const user2BuysProductFromUser1 = user1Products[0];
  await prisma.transaction.create({
    data: {
      type: TransactionType.BUY,
      productId: user2BuysProductFromUser1.id,
      buyerId: user2.id,
      startDate: new Date().toISOString(),
    },
  });
  await prisma.product.update({
    where: { id: user2BuysProductFromUser1.id },
    data: { owner: user2.id, isAvailable: false },
  });

  // User2 borrows 1 product from User1
  const user2BorrowsProductFromUser1 = user1Products[1];
  const user2BorrowStartDate = new Date();
  const user2BorrowEndDate = new Date(user2BorrowStartDate);
  user2BorrowStartDate.setHours(0, 0, 0, 0);
  user2BorrowEndDate.setDate(user2BorrowEndDate.getDate() + 7); // 1 week rental
  user2BorrowEndDate.setHours(23, 59, 59, 999);
  await prisma.transaction.create({
    data: {
      type: TransactionType.RENT,
      productId: user2BorrowsProductFromUser1.id,
      buyerId: user2.id,
      startDate: user2BorrowStartDate.toISOString(),
      endDate: user2BorrowEndDate.toISOString(), // 1 week rental
    },
  });

  console.log("Database populated successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
