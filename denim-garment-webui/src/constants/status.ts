export const PURCHASE_STATUSES = ['Delivered', 'Approved', 'Pending'] as const;
export type PurchaseStatus = (typeof PURCHASE_STATUSES)[number];

