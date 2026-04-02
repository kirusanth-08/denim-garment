import { PurchaseStatus } from '../../../constants/status';

export type Purchase = {
  orderId: string;
  supplier: string;
  date: string;
  items: number;
  totalValue: number;
  total: string;
  status: PurchaseStatus;
};

export type PurchaseInput = {
  supplier: string;
  date: string;
  items: number;
  totalValue: number;
  status: PurchaseStatus;
};

