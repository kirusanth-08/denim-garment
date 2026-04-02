export type Address = {
  company: string;
  recipient: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  phone: string;
};

export type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  holderName: string;
  isDefault: boolean;
  label: string;
};

export type CustomerStats = {
  ordersPlaced: number;
  totalSpend: number;
  totalSpendLabel: string;
  totalUnits: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  company: string;
  tier: string;
  role: string;
  phone: string;
  memberSince: string;
  preferredCurrency: string;
  preferredShippingMethod: string;
  marketingOptIn: boolean;
  addresses: {
    shipping: Address;
    billing: Address;
  };
  paymentMethods: PaymentMethod[];
  stats?: CustomerStats;
};

export type CustomerSession = {
  token: string;
  customer: Customer;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = CustomerSession;

export type CustomerProfileUpdatePayload = {
  name: string;
  email: string;
  company: string;
  tier: string;
  role: string;
  phone: string;
  preferredShippingMethod: string;
  marketingOptIn: boolean;
  defaultPaymentMethodId: string;
  addresses: {
    shipping: Address;
    billing: Address;
  };
};
