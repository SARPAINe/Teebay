export interface ProductCardProps {
  id: number;
  title: string;
  category: string[];
  price: number;
  description: string;
  createdAt?: string;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
  routePath?: string;
  rentPrice?: number;
  rentCategory?: string;
}

export enum CATEGORIES {
  ELECTRONICS = "Electronics",
  FURNITURE = "Furniture",
  HOME_APPLIANCES = "Home Appliances",
  SPORTING_GOODS = "Sporting Goods",
  OUTDOOR = "Outdoor",
  TOYS = "Toys",
}

export enum RENT_CATEGORIES {
  DAILY = "Daily",
  HOURLY = "Hourly",
}

export type CategoryType = keyof typeof CATEGORIES;
export type RentCategoryType = keyof typeof RENT_CATEGORIES;
