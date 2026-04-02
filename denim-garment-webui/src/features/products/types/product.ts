export type Product = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  pricePerUnit: number;
  priceLabel: string;
  availableUnits: number;
  minUnits: number;
  color: string;
  leadTimeDays: number;
  featured: boolean;
  fabric: string;
  badge: string;
  fit: string;
};

export type ProductsResponse = {
  categories: string[];
  products: Product[];
};
