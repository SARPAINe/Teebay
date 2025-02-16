import { Category, RentCategory, TransactionType } from "@prisma/client";
export interface CreateUserInput {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface CreateProductInput {
  title: string;
  description: string;
  price: number;
  category: Category[];
  rentPrice: number;
  rentCategory: RentCategory;
}

export interface EditProductInput {
  title?: string;
  description?: string;
  price?: number;
  category?: Category[];
  rentPrice?: number;
  rentCategory?: RentCategory;
}

export interface CreateTransactionInput {
  type: TransactionType;
  productId: number;
  startDate: string;
  endDate?: string;
}
