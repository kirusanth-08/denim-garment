import { StockIncomeStatus } from '../../../constants/status';

export type StockIncome = {
  incomeId: string;
  supplier: string;
  receivedDate: string;
  materialLots: number;
  stockValue: number;
  stockValueLabel: string;
  status: StockIncomeStatus;
  orderId?: string;
  date?: string;
  items?: number;
  total?: string;
  totalValue?: number;
};

export type Purchase = StockIncome;
