import { Address } from '../../auth/types/customer';

export type CustomerOrderItem = {
  productId: string;
  sku: string;
  name: string;
  category: string;
  units: number;
  unitPrice: number;
  unitPriceLabel: string;
  lineTotal: number;
  lineTotalLabel: string;
};

export type PaymentSummary = {
  brand: string;
  last4: string;
  label: string;
  holderName?: string;
};

export type CustomerOrder = {
  id: string;
  customerId: string;
  customerName: string;
  company: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  shippingMethod: string;
  subtotal: number;
  subtotalLabel: string;
  shippingFee: number;
  shippingFeeLabel: string;
  taxAmount: number;
  taxAmountLabel: string;
  totalUnits: number;
  totalAmount: number;
  totalAmountLabel: string;
  estimatedDelivery: string;
  notes: string;
  shippingAddress: Address;
  billingAddress: Address;
  paymentSummary: PaymentSummary;
  items: CustomerOrderItem[];
};
