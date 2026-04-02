export const STOCK_INCOME_STATUSES = ['Received', 'Quality Checked', 'Pending Inspection'] as const;
export type StockIncomeStatus = (typeof STOCK_INCOME_STATUSES)[number];

export const PURCHASE_STATUSES = STOCK_INCOME_STATUSES;
export type PurchaseStatus = StockIncomeStatus;
