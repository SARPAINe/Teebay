export interface ProductCardProps {
  id: number;
  title: string;
  category: string[];
  price: number;
  description: string;
  createdAt?: string;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}
