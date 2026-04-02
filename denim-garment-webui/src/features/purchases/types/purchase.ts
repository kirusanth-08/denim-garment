import { PurchaseStatus } from '../../../constants/status';

export type Purchase = {
  orderId: string;
  supplier: string;
  date: string;
  items: number;
  total: string;
  status: PurchaseStatus;
};
