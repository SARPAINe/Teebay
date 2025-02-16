import bcrypt from "bcrypt";
import { Context } from "../../context";

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
  },
};

export default resolvers;
