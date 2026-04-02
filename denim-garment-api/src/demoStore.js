import { randomUUID } from 'node:crypto';

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

export const PURCHASE_STATUSES = ['Delivered', 'Approved', 'Pending'];
export const CUSTOMER_SHIPPING_METHODS = ['Standard Freight', 'Priority Dispatch', 'Store Pickup'];

const supplierCatalog = [
  { id: 'SUP-001', name: 'Fabric World Ltd', contact: '+94 77 456 9001', email: 'info@fabricworld.com' },
  { id: 'SUP-002', name: 'Thread Masters', contact: '+94 71 320 4402', email: 'sales@threadmasters.com' },
  { id: 'SUP-003', name: 'Button & Zip Co', contact: '+94 76 889 1770', email: 'orders@buttonzip.com' },
  { id: 'SUP-004', name: 'Denim Direct', contact: '+94 75 998 2014', email: 'bulk@denimdirect.com' },
  { id: 'SUP-005', name: 'Packaging Plus', contact: '+94 78 612 5605', email: 'hello@packplus.com' },
  { id: 'SUP-006', name: 'Indigo Mills', contact: '+94 70 247 1188', email: 'support@indigomills.com' },
];

const initialPurchaseLedger = [
  { orderId: 'PO-001', supplier: 'Fabric World Ltd', date: '2025-09-03', items: 3, totalValue: 331000, status: 'Delivered' },
  { orderId: 'PO-002', supplier: 'Thread Masters', date: '2025-10-08', items: 2, totalValue: 215000, status: 'Approved' },
  { orderId: 'PO-003', supplier: 'Denim Direct', date: '2025-11-16', items: 4, totalValue: 360000, status: 'Pending' },
  { orderId: 'PO-004', supplier: 'Button & Zip Co', date: '2025-12-06', items: 2, totalValue: 130000, status: 'Approved' },
  { orderId: 'PO-005', supplier: 'Packaging Plus', date: '2026-01-19', items: 1, totalValue: 50000, status: 'Pending' },
  { orderId: 'PO-006', supplier: 'Indigo Mills', date: '2026-02-11', items: 3, totalValue: 290000, status: 'Delivered' },
  { orderId: 'PO-007', supplier: 'Denim Direct', date: '2026-03-07', items: 2, totalValue: 205000, status: 'Pending' },
  { orderId: 'PO-008', supplier: 'Fabric World Ltd', date: '2026-04-14', items: 2, totalValue: 152000, status: 'Approved' },
];

const supplierColorMap = {
  'Fabric World Ltd': '#3B82F6',
  'Thread Masters': '#22C55E',
  'Button & Zip Co': '#EF4444',
  'Denim Direct': '#F4A207',
  'Packaging Plus': '#A855F7',
  'Indigo Mills': '#0F172A',
};

const createAddress = (address) => ({
  company: address.company,
  recipient: address.recipient,
  line1: address.line1,
  line2: address.line2 ?? '',
  city: address.city,
  region: address.region,
  postalCode: address.postalCode,
  country: address.country,
  phone: address.phone,
});

const initialCustomerAccounts = [
  {
    id: 'CUS-001',
    name: 'Maya Fernando',
    email: 'customer@dermas.com',
    password: 'denim123',
    company: 'Indigo Atelier',
    tier: 'Wholesale Buyer',
    role: 'Procurement Lead',
    phone: '+94 77 456 3012',
    memberSince: '2024-03-14',
    preferredCurrency: 'LKR',
    preferredShippingMethod: 'Priority Dispatch',
    marketingOptIn: true,
    addresses: {
      shipping: createAddress({
        company: 'Indigo Atelier',
        recipient: 'Maya Fernando',
        line1: '18 Galle Road',
        line2: 'Level 4',
        city: 'Colombo',
        region: 'Western',
        postalCode: '00300',
        country: 'Sri Lanka',
        phone: '+94 77 456 3012',
      }),
      billing: createAddress({
        company: 'Indigo Atelier',
        recipient: 'Accounts Team',
        line1: '18 Galle Road',
        line2: 'Level 3',
        city: 'Colombo',
        region: 'Western',
        postalCode: '00300',
        country: 'Sri Lanka',
        phone: '+94 11 456 8890',
      }),
    },
    paymentMethods: [
      {
        id: 'PM-001',
        brand: 'Visa',
        last4: '4242',
        expiryMonth: '08',
        expiryYear: '2028',
        holderName: 'Maya Fernando',
        isDefault: true,
      },
      {
        id: 'PM-002',
        brand: 'Mastercard',
        last4: '9810',
        expiryMonth: '02',
        expiryYear: '2029',
        holderName: 'Indigo Atelier Purchasing',
        isDefault: false,
      },
    ],
  },
  {
    id: 'CUS-002',
    name: 'Rehan Silva',
    email: 'buyer@dermas.com',
    password: 'demo123',
    company: 'Threadhouse Retail',
    tier: 'Retail Partner',
    role: 'Merchandising Manager',
    phone: '+94 71 887 4401',
    memberSince: '2024-09-02',
    preferredCurrency: 'LKR',
    preferredShippingMethod: 'Standard Freight',
    marketingOptIn: false,
    addresses: {
      shipping: createAddress({
        company: 'Threadhouse Retail',
        recipient: 'Rehan Silva',
        line1: '42 Flower Road',
        line2: '',
        city: 'Colombo',
        region: 'Western',
        postalCode: '00500',
        country: 'Sri Lanka',
        phone: '+94 71 887 4401',
      }),
      billing: createAddress({
        company: 'Threadhouse Retail',
        recipient: 'Finance Desk',
        line1: '42 Flower Road',
        line2: '',
        city: 'Colombo',
        region: 'Western',
        postalCode: '00500',
        country: 'Sri Lanka',
        phone: '+94 11 442 7711',
      }),
    },
    paymentMethods: [
      {
        id: 'PM-101',
        brand: 'Visa',
        last4: '1108',
        expiryMonth: '06',
        expiryYear: '2027',
        holderName: 'Rehan Silva',
        isDefault: true,
      },
    ],
  },
];

const initialProductCatalog = [
  {
    id: 'PRD-001',
    sku: 'DG-JN-1001',
    slug: 'classic-straight-denim',
    name: 'Classic Straight Denim',
    category: 'Jeans',
    description: 'Mid-wash straight-leg denim with durable stitching for everyday retail runs.',
    pricePerUnit: 4800,
    availableUnits: 160,
    minUnits: 1,
    color: '#254F7A',
    leadTimeDays: 4,
    featured: true,
    fabric: '12 oz cotton denim',
    badge: 'Best seller',
    fit: 'Straight',
  },
  {
    id: 'PRD-002',
    sku: 'DG-JN-1002',
    slug: 'vintage-indigo-slim',
    name: 'Vintage Indigo Slim',
    category: 'Jeans',
    description: 'A slimmer silhouette with softened enzyme wash and premium stretch comfort.',
    pricePerUnit: 5200,
    availableUnits: 124,
    minUnits: 1,
    color: '#1E3A5F',
    leadTimeDays: 5,
    featured: true,
    fabric: 'Stretch indigo denim',
    badge: 'New wash',
    fit: 'Slim',
  },
  {
    id: 'PRD-003',
    sku: 'DG-JK-2101',
    slug: 'utility-denim-jacket',
    name: 'Utility Denim Jacket',
    category: 'Jackets',
    description: 'Structured outerwear staple with reinforced seams and matte metal hardware.',
    pricePerUnit: 7900,
    availableUnits: 76,
    minUnits: 1,
    color: '#4D6E90',
    leadTimeDays: 6,
    featured: true,
    fabric: 'Brushed rigid denim',
    badge: 'Premium',
    fit: 'Relaxed',
  },
  {
    id: 'PRD-004',
    sku: 'DG-SH-3204',
    slug: 'chambray-work-shirt',
    name: 'Chambray Work Shirt',
    category: 'Shirts',
    description: 'Lightweight chambray shirt designed for layering and clean shelf presentation.',
    pricePerUnit: 3900,
    availableUnits: 142,
    minUnits: 1,
    color: '#7695B1',
    leadTimeDays: 3,
    featured: false,
    fabric: 'Chambray cotton blend',
    badge: 'Fast mover',
    fit: 'Regular',
  },
  {
    id: 'PRD-005',
    sku: 'DG-CT-4102',
    slug: 'wide-leg-crop-denim',
    name: 'Wide Leg Crop Denim',
    category: 'Womenswear',
    description: 'Contemporary cropped cut with clean hem and a soft-touch stone wash.',
    pricePerUnit: 6100,
    availableUnits: 88,
    minUnits: 1,
    color: '#56708B',
    leadTimeDays: 5,
    featured: false,
    fabric: 'Soft-touch stone-wash denim',
    badge: 'Seasonal',
    fit: 'Wide crop',
  },
  {
    id: 'PRD-006',
    sku: 'DG-BG-5101',
    slug: 'indigo-tote-bag',
    name: 'Indigo Tote Bag',
    category: 'Accessories',
    description: 'Heavy canvas-denim blend tote suited for capsule collections and gifting.',
    pricePerUnit: 1800,
    availableUnits: 210,
    minUnits: 2,
    color: '#698AAF',
    leadTimeDays: 2,
    featured: true,
    fabric: 'Canvas denim blend',
    badge: 'Impulse add-on',
    fit: 'Accessory',
  },
];

const seedOrderItem = (productId, units) => {
  const product = initialProductCatalog.find((entry) => entry.id === productId);

  if (!product) {
    throw new Error(`Seed product not found: ${productId}`);
  }

  return {
    productId: product.id,
    sku: product.sku,
    name: product.name,
    category: product.category,
    units,
    unitPrice: product.pricePerUnit,
    lineTotal: product.pricePerUnit * units,
  };
};

const initialCustomerOrderLedger = [
  {
    id: 'ORD-001',
    customerId: 'CUS-001',
    customerName: 'Maya Fernando',
    company: 'Indigo Atelier',
    createdAt: '2026-03-28T10:12:00.000Z',
    status: 'Dispatched',
    paymentStatus: 'Paid',
    shippingMethod: 'Priority Dispatch',
    subtotal: 19700,
    shippingFee: 1800,
    taxAmount: 1576,
    totalAmount: 23076,
    totalUnits: 4,
    estimatedDelivery: '2026-04-03',
    notes: 'Display launch replenishment.',
    shippingAddress: createAddress({
      company: 'Indigo Atelier',
      recipient: 'Maya Fernando',
      line1: '18 Galle Road',
      line2: 'Level 4',
      city: 'Colombo',
      region: 'Western',
      postalCode: '00300',
      country: 'Sri Lanka',
      phone: '+94 77 456 3012',
    }),
    billingAddress: createAddress({
      company: 'Indigo Atelier',
      recipient: 'Accounts Team',
      line1: '18 Galle Road',
      line2: 'Level 3',
      city: 'Colombo',
      region: 'Western',
      postalCode: '00300',
      country: 'Sri Lanka',
      phone: '+94 11 456 8890',
    }),
    paymentSummary: {
      brand: 'Visa',
      last4: '4242',
      label: 'Visa ending in 4242',
    },
    items: [seedOrderItem('PRD-001', 2), seedOrderItem('PRD-006', 3)],
  },
  {
    id: 'ORD-002',
    customerId: 'CUS-002',
    customerName: 'Rehan Silva',
    company: 'Threadhouse Retail',
    createdAt: '2026-03-16T14:45:00.000Z',
    status: 'Delivered',
    paymentStatus: 'Paid',
    shippingMethod: 'Standard Freight',
    subtotal: 17400,
    shippingFee: 1200,
    taxAmount: 1392,
    totalAmount: 19992,
    totalUnits: 4,
    estimatedDelivery: '2026-03-23',
    notes: 'Weekend campaign restock.',
    shippingAddress: createAddress({
      company: 'Threadhouse Retail',
      recipient: 'Rehan Silva',
      line1: '42 Flower Road',
      line2: '',
      city: 'Colombo',
      region: 'Western',
      postalCode: '00500',
      country: 'Sri Lanka',
      phone: '+94 71 887 4401',
    }),
    billingAddress: createAddress({
      company: 'Threadhouse Retail',
      recipient: 'Finance Desk',
      line1: '42 Flower Road',
      line2: '',
      city: 'Colombo',
      region: 'Western',
      postalCode: '00500',
      country: 'Sri Lanka',
      phone: '+94 11 442 7711',
    }),
    paymentSummary: {
      brand: 'Visa',
      last4: '1108',
      label: 'Visa ending in 1108',
    },
    items: [seedOrderItem('PRD-002', 2), seedOrderItem('PRD-004', 2)],
  },
];

const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });

let purchaseLedger = initialPurchaseLedger.map((purchase) => ({ ...purchase }));
let productCatalog = initialProductCatalog.map((product) => ({ ...product }));
let customerAccounts = initialCustomerAccounts.map((customer) => ({
  ...customer,
  addresses: {
    shipping: createAddress(customer.addresses.shipping),
    billing: createAddress(customer.addresses.billing),
  },
  paymentMethods: customer.paymentMethods.map((paymentMethod) => ({ ...paymentMethod })),
}));
let customerOrderLedger = initialCustomerOrderLedger.map((order) => ({
  ...order,
  shippingAddress: createAddress(order.shippingAddress),
  billingAddress: createAddress(order.billingAddress),
  paymentSummary: { ...order.paymentSummary },
  items: order.items.map((item) => ({ ...item })),
}));

const customerSessions = new Map();

const normalize = (value = '') => String(value).trim().toLowerCase();
const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const formatCurrency = (value) => `Rs. ${Math.round(value).toLocaleString('en-US')}`;
const formatCompactCurrency = (value) => `Rs. ${Math.round(value / 1000)}K`;
const toMonthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
const formatMonthLabel = (monthKey) => monthFormatter.format(new Date(`${monthKey}-01T00:00:00`));
const compareCustomerOrders = (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
const cloneAddress = (address) => createAddress(address);
const clonePaymentMethod = (paymentMethod) => ({ ...paymentMethod });
const mapPaymentMethod = (paymentMethod) => ({
  ...paymentMethod,
  label: `${paymentMethod.brand} ending in ${paymentMethod.last4}`,
});

const parseDateInput = (value) => {
  if (!value || typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const parsed = new Date(`${trimmed}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const [, month, day, year] = slashMatch;
    const parsed = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const ensureDate = (value, fieldName) => {
  const parsed = parseDateInput(value);
  if (!parsed) {
    throw new HttpError(400, `${fieldName} must be a valid date.`);
  }

  return value.trim();
};

const ensurePositiveInteger = (value, fieldName) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new HttpError(400, `${fieldName} must be a positive whole number.`);
  }

  return parsed;
};

const ensurePositiveNumber = (value, fieldName) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new HttpError(400, `${fieldName} must be greater than zero.`);
  }

  return Math.round(parsed);
};

const ensureRequiredText = (value, fieldName) => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new HttpError(400, `${fieldName} is required.`);
  }

  return value.trim();
};

const ensureOptionalText = (value) => (typeof value === 'string' ? value.trim() : '');

const ensureEmail = (value, fieldName = 'Email') => {
  const email = ensureRequiredText(value, fieldName);
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isValid) {
    throw new HttpError(400, `${fieldName} must be a valid email address.`);
  }

  return email;
};

const ensureBoolean = (value, fieldName) => {
  if (typeof value !== 'boolean') {
    throw new HttpError(400, `${fieldName} must be true or false.`);
  }

  return value;
};

const ensureSupplier = (value) => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new HttpError(400, 'Supplier is required.');
  }

  const match = supplierCatalog.find((supplier) => supplier.name === value.trim());
  if (!match) {
    throw new HttpError(400, 'Supplier must match an existing supplier.');
  }

  return match.name;
};

const ensureStatus = (value) => {
  if (typeof value !== 'string' || !PURCHASE_STATUSES.includes(value)) {
    throw new HttpError(400, `Status must be one of: ${PURCHASE_STATUSES.join(', ')}.`);
  }

  return value;
};

const ensureShippingMethod = (value) => {
  if (typeof value !== 'string' || !CUSTOMER_SHIPPING_METHODS.includes(value)) {
    throw new HttpError(400, `Shipping method must be one of: ${CUSTOMER_SHIPPING_METHODS.join(', ')}.`);
  }

  return value;
};

const validatePurchaseInput = (payload, { partial = false } = {}) => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new HttpError(400, 'Purchase payload must be an object.');
  }

  const result = {};

  if (!partial || hasOwn(payload, 'supplier')) {
    result.supplier = ensureSupplier(payload.supplier);
  }

  if (!partial || hasOwn(payload, 'date')) {
    result.date = ensureDate(payload.date, 'Date');
  }

  if (!partial || hasOwn(payload, 'items')) {
    result.items = ensurePositiveInteger(payload.items, 'Items');
  }

  if (!partial || hasOwn(payload, 'totalValue')) {
    result.totalValue = ensurePositiveNumber(payload.totalValue, 'Total value');
  }

  if (!partial || hasOwn(payload, 'status')) {
    result.status = ensureStatus(payload.status);
  }

  if (partial && Object.keys(result).length === 0) {
    throw new HttpError(400, 'At least one purchase field must be provided.');
  }

  return result;
};

const validateAddress = (payload, fieldName) => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new HttpError(400, `${fieldName} must be an address object.`);
  }

  return {
    company: ensureRequiredText(payload.company, `${fieldName} company`),
    recipient: ensureRequiredText(payload.recipient, `${fieldName} recipient`),
    line1: ensureRequiredText(payload.line1, `${fieldName} line 1`),
    line2: ensureOptionalText(payload.line2),
    city: ensureRequiredText(payload.city, `${fieldName} city`),
    region: ensureRequiredText(payload.region, `${fieldName} region`),
    postalCode: ensureRequiredText(payload.postalCode, `${fieldName} postal code`),
    country: ensureRequiredText(payload.country, `${fieldName} country`),
    phone: ensureRequiredText(payload.phone, `${fieldName} phone`),
  };
};

const sanitizeCustomer = ({ password, ...customer }) => ({
  ...customer,
  addresses: {
    shipping: cloneAddress(customer.addresses.shipping),
    billing: cloneAddress(customer.addresses.billing),
  },
  paymentMethods: customer.paymentMethods.map((paymentMethod) => mapPaymentMethod(clonePaymentMethod(paymentMethod))),
});

const createCustomerSession = (customerId) => {
  const token = randomUUID();
  customerSessions.set(token, customerId);
  return token;
};

const getCustomerByEmail = (email) => customerAccounts.find((customer) => normalize(customer.email) === normalize(email));
const getCustomerById = (customerId) => customerAccounts.find((customer) => customer.id === customerId);

const requireCustomerFromToken = (token) => {
  if (typeof token !== 'string' || token.trim().length === 0) {
    throw new HttpError(401, 'Customer login required.');
  }

  const customerId = customerSessions.get(token.trim());
  if (!customerId) {
    throw new HttpError(401, 'Customer session is invalid or has expired.');
  }

  const customer = getCustomerById(customerId);
  if (!customer) {
    throw new HttpError(401, 'Customer session is invalid or has expired.');
  }

  return customer;
};

const getProductCategories = () => [...new Set(productCatalog.map((product) => product.category))];

const mapProductRecord = (product) => ({
  ...product,
  priceLabel: formatCurrency(product.pricePerUnit),
});

const createNextCustomerOrderId = () => {
  const nextNumber =
    customerOrderLedger.reduce((max, order) => {
      const parsed = Number(order.id.replace('ORD-', ''));
      return Number.isFinite(parsed) && parsed > max ? parsed : max;
    }, 0) + 1;

  return `ORD-${String(nextNumber).padStart(3, '0')}`;
};

const createNextOrderId = () => {
  const nextNumber =
    purchaseLedger.reduce((max, purchase) => {
      const parsed = Number(purchase.orderId.replace('PO-', ''));
      return Number.isFinite(parsed) && parsed > max ? parsed : max;
    }, 0) + 1;

  return `PO-${String(nextNumber).padStart(3, '0')}`;
};

const validateOrderItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new HttpError(400, 'Order must include at least one product.');
  }

  const combinedItems = items.reduce((accumulator, item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new HttpError(400, 'Each order item must be an object.');
    }

    const productId = typeof item.productId === 'string' ? item.productId.trim() : '';
    const units = Number(item.units);

    if (!productId) {
      throw new HttpError(400, 'Each order item must include a productId.');
    }

    if (!Number.isInteger(units) || units <= 0) {
      throw new HttpError(400, 'Each order item must include a positive whole number of units.');
    }

    accumulator[productId] = (accumulator[productId] ?? 0) + units;
    return accumulator;
  }, {});

  return Object.entries(combinedItems).map(([productId, units]) => {
    const product = productCatalog.find((entry) => entry.id === productId);

    if (!product) {
      throw new HttpError(400, `Unknown product: ${productId}.`);
    }

    if (units < product.minUnits) {
      throw new HttpError(400, `${product.name} must be purchased in at least ${product.minUnits} unit(s).`);
    }

    if (units > product.availableUnits) {
      throw new HttpError(400, `${product.name} only has ${product.availableUnits} units available.`);
    }

    return {
      productId: product.id,
      sku: product.sku,
      name: product.name,
      category: product.category,
      units,
      unitPrice: product.pricePerUnit,
      lineTotal: product.pricePerUnit * units,
      leadTimeDays: product.leadTimeDays,
    };
  });
};

const mapCustomerOrder = (order) => ({
  ...order,
  subtotalLabel: formatCurrency(order.subtotal),
  shippingFeeLabel: formatCurrency(order.shippingFee),
  taxAmountLabel: formatCurrency(order.taxAmount),
  totalAmountLabel: formatCurrency(order.totalAmount),
  items: order.items.map((item) => ({
    ...item,
    unitPriceLabel: formatCurrency(item.unitPrice),
    lineTotalLabel: formatCurrency(item.lineTotal),
  })),
});

const mapPurchaseRecord = ({ totalValue, ...purchase }) => ({
  ...purchase,
  totalValue,
  total: formatCurrency(totalValue),
});

const comparePurchaseDates = (left, right) => {
  const leftDate = parseDateInput(left.date)?.getTime() ?? 0;
  const rightDate = parseDateInput(right.date)?.getTime() ?? 0;
  return rightDate - leftDate;
};

const getLatestLedgerDate = () =>
  purchaseLedger.reduce((latest, purchase) => {
    const parsed = parseDateInput(purchase.date);
    if (!parsed) {
      return latest;
    }

    return parsed > latest ? parsed : latest;
  }, parseDateInput(purchaseLedger[0]?.date) ?? new Date('2026-04-01T00:00:00'));

const getLedgerTotalsBySupplier = (purchases = purchaseLedger) =>
  purchases.reduce((accumulator, purchase) => {
    accumulator[purchase.supplier] = (accumulator[purchase.supplier] ?? 0) + purchase.totalValue;
    return accumulator;
  }, {});

const buildMonthlyTrend = (purchases) => {
  const totalsByMonth = purchases.reduce((accumulator, purchase) => {
    const parsed = parseDateInput(purchase.date);
    if (!parsed) {
      return accumulator;
    }

    const monthKey = toMonthKey(parsed);
    accumulator[monthKey] = (accumulator[monthKey] ?? 0) + purchase.totalValue;
    return accumulator;
  }, {});

  return Object.entries(totalsByMonth)
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([monthKey, totalValue]) => ({
      month: formatMonthLabel(monthKey),
      value: Math.round(totalValue / 1000),
    }));
};

const buildSupplierDistribution = (purchases) => {
  const totalsBySupplier = getLedgerTotalsBySupplier(purchases);
  const totalValue = Object.values(totalsBySupplier).reduce((sum, value) => sum + value, 0);

  if (totalValue === 0) {
    return [{ name: 'No activity', value: 100, color: '#CBD5E1' }];
  }

  const entries = Object.entries(totalsBySupplier)
    .sort(([, leftValue], [, rightValue]) => rightValue - leftValue)
    .map(([supplier, value]) => ({ supplier, value }));

  let remainingPercent = 100;

  return entries.map(({ supplier, value }, index) => {
    const computedPercent = index === entries.length - 1 ? remainingPercent : Math.max(1, Math.round((value / totalValue) * 100));
    remainingPercent -= computedPercent;

    return {
      name: supplier,
      value: computedPercent,
      color: supplierColorMap[supplier] ?? '#64748B',
    };
  });
};

const isWithinRange = (rawDate, fromDate, toDate) => {
  const current = parseDateInput(rawDate);
  if (!current) {
    return false;
  }

  if (fromDate && current < fromDate) {
    return false;
  }

  if (toDate && current > toDate) {
    return false;
  }

  return true;
};

const getCustomerStats = (customerId) => {
  const orders = customerOrderLedger.filter((order) => order.customerId === customerId);
  const totalSpend = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalUnits = orders.reduce((sum, order) => sum + order.totalUnits, 0);

  return {
    ordersPlaced: orders.length,
    totalSpend,
    totalSpendLabel: formatCurrency(totalSpend),
    totalUnits,
  };
};

const calculateShippingFee = (shippingMethod) => {
  if (shippingMethod === 'Priority Dispatch') {
    return 1800;
  }

  if (shippingMethod === 'Store Pickup') {
    return 0;
  }

  return 1200;
};

const calculateEstimatedDelivery = (items, shippingMethod) => {
  const longestLeadTime = items.reduce((max, item) => Math.max(max, item.leadTimeDays ?? 0), 0);
  const shippingAdjustment = shippingMethod === 'Priority Dispatch' ? 1 : shippingMethod === 'Store Pickup' ? 0 : 2;
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + Math.max(2, longestLeadTime + shippingAdjustment));
  return estimatedDate.toISOString().slice(0, 10);
};

const resolvePaymentSummary = (customer, payload) => {
  if (typeof payload?.paymentMethodId === 'string' && payload.paymentMethodId.trim()) {
    const paymentMethod = customer.paymentMethods.find((entry) => entry.id === payload.paymentMethodId.trim());

    if (!paymentMethod) {
      throw new HttpError(400, 'Selected payment method was not found for this customer.');
    }

    return {
      brand: paymentMethod.brand,
      last4: paymentMethod.last4,
      label: `${paymentMethod.brand} ending in ${paymentMethod.last4}`,
    };
  }

  if (payload?.paymentCard && typeof payload.paymentCard === 'object' && !Array.isArray(payload.paymentCard)) {
    const holderName = ensureRequiredText(payload.paymentCard.holderName, 'Payment card holder name');
    const cardNumber = ensureRequiredText(payload.paymentCard.cardNumber, 'Payment card number').replace(/\s+/g, '');
    const expiryMonth = ensureRequiredText(payload.paymentCard.expiryMonth, 'Payment card expiry month');
    const expiryYear = ensureRequiredText(payload.paymentCard.expiryYear, 'Payment card expiry year');
    const brand = ensureOptionalText(payload.paymentCard.brand) || 'Visa';

    if (cardNumber.length < 4) {
      throw new HttpError(400, 'Payment card number must include at least four digits.');
    }

    if (!/^\d{1,2}$/.test(expiryMonth) || Number(expiryMonth) < 1 || Number(expiryMonth) > 12) {
      throw new HttpError(400, 'Payment card expiry month must be between 1 and 12.');
    }

    if (!/^\d{4}$/.test(expiryYear)) {
      throw new HttpError(400, 'Payment card expiry year must be a four-digit year.');
    }

    return {
      brand,
      last4: cardNumber.slice(-4),
      holderName,
      label: `${brand} ending in ${cardNumber.slice(-4)}`,
    };
  }

  throw new HttpError(400, 'Choose a saved payment method or provide a payment card.');
};

const normalizeCustomerPaymentMethods = (paymentMethods, defaultPaymentMethodId) => {
  if (!defaultPaymentMethodId) {
    return paymentMethods;
  }

  return paymentMethods.map((paymentMethod) => ({
    ...paymentMethod,
    isDefault: paymentMethod.id === defaultPaymentMethodId,
  }));
};

export const getStorefrontLanding = () => {
  const featuredProducts = productCatalog.filter((product) => product.featured).slice(0, 4).map(mapProductRecord);
  const totalUnits = productCatalog.reduce((sum, product) => sum + product.availableUnits, 0);

  return {
    hero: {
      eyebrow: 'Dermas Apparel Customer Portal',
      title: 'A cleaner way for customers to browse denim products and place repeatable unit-wise orders.',
      description:
        'Give buyers a polished self-service flow for discovery, checkout, order tracking, and profile management without leaving your denim ecosystem.',
      ctaLabel: 'Explore the catalog',
      secondaryCtaLabel: 'Customer login',
    },
    stats: [
      { label: 'Active products', value: String(productCatalog.length) },
      { label: 'Units ready to ship', value: String(totalUnits) },
      { label: 'Partner accounts', value: String(customerAccounts.length) },
    ],
    featuredProducts,
    highlights: [
      {
        title: 'Unit-wise purchasing',
        description: 'Customers can buy by exact unit counts, see minimums instantly, and keep their cart aligned with live demo stock.',
      },
      {
        title: 'Checkout and payment',
        description: 'Saved payment preferences and address data flow directly into checkout for a smoother reorder experience.',
      },
      {
        title: 'Order transparency',
        description: 'Every order includes item-level totals, payment summary, shipping details, and a clear status trail.',
      },
    ],
    testimonials: [
      {
        quote: 'The portal made repeat denim reorders much faster for our merchandising team.',
        author: 'Maya Fernando',
        company: 'Indigo Atelier',
      },
      {
        quote: 'We can now move from browse to checkout without back-and-forth emails.',
        author: 'Rehan Silva',
        company: 'Threadhouse Retail',
      },
    ],
  };
};

export const getPurchases = ({ query = '', status } = {}) => {
  const normalizedQuery = normalize(query);

  return [...purchaseLedger]
    .sort(comparePurchaseDates)
    .filter((purchase) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [purchase.orderId, purchase.supplier].some((value) => normalize(value).includes(normalizedQuery));

      const matchesStatus = !status || purchase.status === status;

      return matchesQuery && matchesStatus;
    })
    .map(mapPurchaseRecord);
};

export const getSuppliers = ({ query = '' } = {}) => {
  const normalizedQuery = normalize(query);
  const totalsBySupplier = getLedgerTotalsBySupplier();

  return supplierCatalog
    .filter((supplier) => {
      if (!normalizedQuery) {
        return true;
      }

      return [supplier.id, supplier.name, supplier.email].some((value) => normalize(value).includes(normalizedQuery));
    })
    .map((supplier) => ({
      ...supplier,
      totalPurchases: formatCurrency(totalsBySupplier[supplier.name] ?? 0),
    }));
};

export const getDashboard = () => {
  const latestLedgerDate = getLatestLedgerDate();
  const latestMonthKey = toMonthKey(latestLedgerDate);
  const previousDate = new Date(latestLedgerDate);
  previousDate.setMonth(previousDate.getMonth() - 1);
  const previousMonthKey = toMonthKey(previousDate);

  const currentMonthPurchases = purchaseLedger.filter((purchase) => toMonthKey(parseDateInput(purchase.date) ?? latestLedgerDate) === latestMonthKey);
  const previousMonthPurchases = purchaseLedger.filter((purchase) => toMonthKey(parseDateInput(purchase.date) ?? latestLedgerDate) === previousMonthKey);

  const currentMonthTotal = currentMonthPurchases.reduce((sum, purchase) => sum + purchase.totalValue, 0);
  const previousMonthTotal = previousMonthPurchases.reduce((sum, purchase) => sum + purchase.totalValue, 0);
  const totalOrders = purchaseLedger.length;
  const pendingOrders = purchaseLedger.filter((purchase) => purchase.status === 'Pending').length;
  const approvedOrders = purchaseLedger.filter((purchase) => purchase.status === 'Approved').length;
  const deliveredOrders = purchaseLedger.filter((purchase) => purchase.status === 'Delivered').length;

  const totalsBySupplier = getLedgerTotalsBySupplier();
  const topSupplierEntry = Object.entries(totalsBySupplier).sort(([, leftValue], [, rightValue]) => rightValue - leftValue)[0];
  const topSupplierName = topSupplierEntry?.[0] ?? supplierCatalog[0]?.name ?? 'No supplier';
  const topSupplierValue = topSupplierEntry?.[1] ?? 0;

  const purchaseDelta =
    previousMonthTotal === 0 ? null : Math.round(((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100);

  return {
    stats: [
      {
        label: 'Current Month Spend',
        value: formatCompactCurrency(currentMonthTotal),
        subtext: 'Latest purchase cycle',
        highlight: purchaseDelta === null ? 'New activity this month' : `${Math.abs(purchaseDelta)}% ${purchaseDelta >= 0 ? 'above' : 'below'} last month`,
        highlightTone: purchaseDelta === null ? 'info' : purchaseDelta >= 0 ? 'positive' : 'negative',
        iconKey: 'currency',
      },
      {
        label: 'Purchase Orders',
        value: String(totalOrders),
        subtext: 'Across all submissions',
        highlight: `${currentMonthPurchases.length} created this month`,
        highlightTone: 'positive',
        iconKey: 'orders',
      },
      {
        label: 'Pending Approval',
        value: String(pendingOrders),
        subtext: 'Awaiting supplier confirmation',
        highlight: `${approvedOrders} approved so far`,
        highlightTone: 'info',
        iconKey: 'pending',
      },
      {
        label: 'Active Suppliers',
        value: String(supplierCatalog.length),
        subtext: 'Available for sourcing',
        highlight: `${deliveredOrders} delivered orders`,
        highlightTone: 'positive',
        iconKey: 'suppliers',
      },
    ],
    monthlyTrend: buildMonthlyTrend(purchaseLedger),
    quickOverview: [
      {
        title: 'Delivered Orders',
        subtitle: `${deliveredOrders} completed successfully`,
        iconKey: 'truck',
        tone: 'success',
      },
      {
        title: 'Pending Approval',
        subtitle: `${pendingOrders} requests still in progress`,
        iconKey: 'clock',
        tone: 'warning',
      },
      {
        title: 'Top Supplier',
        subtitle: `${topSupplierName} - ${formatCompactCurrency(topSupplierValue)}`,
        iconKey: 'trend',
        tone: 'info',
      },
    ],
  };
};

export const getReports = ({ from, to, supplier } = {}) => {
  const fromDate = parseDateInput(from);
  const toDate = parseDateInput(to);

  const dateFilteredPurchases = purchaseLedger.filter((purchase) => isWithinRange(purchase.date, fromDate, toDate));
  const supplierFilteredPurchases = supplier ? dateFilteredPurchases.filter((purchase) => purchase.supplier === supplier) : dateFilteredPurchases;

  const fullDistribution = buildSupplierDistribution(dateFilteredPurchases);

  const supplierDistribution = supplier
    ? (() => {
        const selectedEntry = fullDistribution.find((item) => item.name === supplier);
        const selectedValue = selectedEntry?.value ?? 0;
        return selectedEntry
          ? [
              selectedEntry,
              {
                name: 'Other suppliers',
                value: Math.max(0, 100 - selectedValue),
                color: '#CBD5E1',
              },
            ]
          : [{ name: 'No activity', value: 100, color: '#CBD5E1' }];
      })()
    : fullDistribution;

  return {
    monthlyTrend: buildMonthlyTrend(supplierFilteredPurchases),
    supplierDistribution,
    supplierOptions: supplierCatalog.map((item) => item.name),
  };
};

export const createPurchase = (payload) => {
  const nextPurchase = {
    orderId: createNextOrderId(),
    ...validatePurchaseInput(payload),
  };

  purchaseLedger = [...purchaseLedger, nextPurchase];

  return mapPurchaseRecord(nextPurchase);
};

export const updatePurchase = (orderId, payload) => {
  const targetIndex = purchaseLedger.findIndex((purchase) => purchase.orderId === orderId);

  if (targetIndex === -1) {
    throw new HttpError(404, 'Purchase order not found.');
  }

  const updatedPurchase = {
    ...purchaseLedger[targetIndex],
    ...validatePurchaseInput(payload, { partial: true }),
  };

  purchaseLedger = purchaseLedger.map((purchase, index) => (index === targetIndex ? updatedPurchase : purchase));

  return mapPurchaseRecord(updatedPurchase);
};

export const deletePurchase = (orderId) => {
  const exists = purchaseLedger.some((purchase) => purchase.orderId === orderId);

  if (!exists) {
    throw new HttpError(404, 'Purchase order not found.');
  }

  purchaseLedger = purchaseLedger.filter((purchase) => purchase.orderId !== orderId);
};

export const loginCustomer = (payload) => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new HttpError(400, 'Login payload must be an object.');
  }

  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const password = typeof payload.password === 'string' ? payload.password : '';

  if (!email || !password) {
    throw new HttpError(400, 'Email and password are required.');
  }

  const customer = getCustomerByEmail(email);

  if (!customer || customer.password !== password) {
    throw new HttpError(401, 'Invalid customer email or password.');
  }

  const token = createCustomerSession(customer.id);

  return {
    token,
    customer: {
      ...sanitizeCustomer(customer),
      stats: getCustomerStats(customer.id),
    },
  };
};

export const getCustomerProfile = (token) => {
  const customer = requireCustomerFromToken(token);
  const profile = sanitizeCustomer(customer);

  return {
    ...profile,
    stats: getCustomerStats(customer.id),
  };
};

export const updateCustomerProfile = ({ token, payload } = {}) => {
  const customer = requireCustomerFromToken(token);

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new HttpError(400, 'Profile payload must be an object.');
  }

  const duplicateEmail = hasOwn(payload, 'email')
    ? customerAccounts.find((entry) => entry.id !== customer.id && normalize(entry.email) === normalize(payload.email))
    : null;

  if (duplicateEmail) {
    throw new HttpError(400, 'Email address is already in use by another customer.');
  }

  const nextCustomer = {
    ...customer,
    name: hasOwn(payload, 'name') ? ensureRequiredText(payload.name, 'Name') : customer.name,
    email: hasOwn(payload, 'email') ? ensureEmail(payload.email, 'Email') : customer.email,
    company: hasOwn(payload, 'company') ? ensureRequiredText(payload.company, 'Company') : customer.company,
    tier: hasOwn(payload, 'tier') ? ensureRequiredText(payload.tier, 'Tier') : customer.tier,
    role: hasOwn(payload, 'role') ? ensureRequiredText(payload.role, 'Role') : customer.role,
    phone: hasOwn(payload, 'phone') ? ensureRequiredText(payload.phone, 'Phone') : customer.phone,
    preferredShippingMethod: hasOwn(payload, 'preferredShippingMethod')
      ? ensureShippingMethod(payload.preferredShippingMethod)
      : customer.preferredShippingMethod,
    marketingOptIn: hasOwn(payload, 'marketingOptIn')
      ? ensureBoolean(payload.marketingOptIn, 'Marketing opt-in')
      : customer.marketingOptIn,
    addresses: {
      shipping:
        payload.addresses && hasOwn(payload.addresses, 'shipping')
          ? validateAddress(payload.addresses.shipping, 'Shipping address')
          : cloneAddress(customer.addresses.shipping),
      billing:
        payload.addresses && hasOwn(payload.addresses, 'billing')
          ? validateAddress(payload.addresses.billing, 'Billing address')
          : cloneAddress(customer.addresses.billing),
    },
    paymentMethods: normalizeCustomerPaymentMethods(
      customer.paymentMethods.map((paymentMethod) => clonePaymentMethod(paymentMethod)),
      hasOwn(payload, 'defaultPaymentMethodId') ? ensureRequiredText(payload.defaultPaymentMethodId, 'Default payment method') : null,
    ),
  };

  if (hasOwn(payload, 'defaultPaymentMethodId')) {
    const exists = nextCustomer.paymentMethods.some((paymentMethod) => paymentMethod.id === payload.defaultPaymentMethodId);
    if (!exists) {
      throw new HttpError(400, 'Default payment method must match one of the saved customer payment methods.');
    }
  }

  customerAccounts = customerAccounts.map((entry) => (entry.id === customer.id ? nextCustomer : entry));

  return {
    customer: {
      ...sanitizeCustomer(nextCustomer),
      stats: getCustomerStats(nextCustomer.id),
    },
  };
};

export const getProducts = ({ token, query = '', category, featured } = {}) => {
  requireCustomerFromToken(token);
  const normalizedQuery = normalize(query);
  const normalizedCategory = typeof category === 'string' ? category.trim() : '';
  const featuredOnly = String(featured ?? '') === 'true';

  return {
    categories: getProductCategories(),
    products: productCatalog
      .filter((product) => {
        const matchesCategory = !normalizedCategory || product.category === normalizedCategory;
        const matchesFeatured = !featuredOnly || product.featured;
        const matchesQuery =
          normalizedQuery.length === 0 ||
          [product.name, product.sku, product.category, product.description, product.fabric, product.fit].some((value) =>
            normalize(value).includes(normalizedQuery),
          );

        return matchesCategory && matchesFeatured && matchesQuery;
      })
      .map(mapProductRecord),
  };
};

export const getCustomerOrders = ({ token } = {}) => {
  const customer = requireCustomerFromToken(token);

  return customerOrderLedger
    .filter((order) => order.customerId === customer.id)
    .sort(compareCustomerOrders)
    .map(mapCustomerOrder);
};

export const getCustomerOrder = ({ token, orderId } = {}) => {
  const customer = requireCustomerFromToken(token);
  const order = customerOrderLedger.find((entry) => entry.customerId === customer.id && entry.id === orderId);

  if (!order) {
    throw new HttpError(404, 'Customer order not found.');
  }

  return mapCustomerOrder(order);
};

export const createCustomerOrder = ({ token, payload } = {}) => {
  const customer = requireCustomerFromToken(token);

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new HttpError(400, 'Order payload must be an object.');
  }

  const items = validateOrderItems(payload.items);
  const shippingMethod = hasOwn(payload, 'shippingMethod')
    ? ensureShippingMethod(payload.shippingMethod)
    : customer.preferredShippingMethod;
  const shippingAddress = hasOwn(payload, 'shippingAddress')
    ? validateAddress(payload.shippingAddress, 'Shipping address')
    : cloneAddress(customer.addresses.shipping);
  const billingAddress = hasOwn(payload, 'billingAddress')
    ? validateAddress(payload.billingAddress, 'Billing address')
    : cloneAddress(customer.addresses.billing);
  const notes = ensureOptionalText(payload.notes);
  const paymentSummary = resolvePaymentSummary(customer, payload);
  const totalUnits = items.reduce((sum, item) => sum + item.units, 0);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shippingFee = calculateShippingFee(shippingMethod);
  const taxAmount = Math.round(subtotal * 0.08);
  const totalAmount = subtotal + shippingFee + taxAmount;
  const estimatedDelivery = calculateEstimatedDelivery(items, shippingMethod);

  const nextOrder = {
    id: createNextCustomerOrderId(),
    customerId: customer.id,
    customerName: customer.name,
    company: customer.company,
    createdAt: new Date().toISOString(),
    status: 'Processing',
    paymentStatus: 'Paid',
    shippingMethod,
    subtotal,
    shippingFee,
    taxAmount,
    totalAmount,
    totalUnits,
    estimatedDelivery,
    notes,
    shippingAddress,
    billingAddress,
    paymentSummary,
    items: items.map(({ leadTimeDays, ...item }) => item),
  };

  productCatalog = productCatalog.map((product) => {
    const orderedItem = items.find((item) => item.productId === product.id);
    if (!orderedItem) {
      return product;
    }

    return {
      ...product,
      availableUnits: product.availableUnits - orderedItem.units,
    };
  });

  customerOrderLedger = [nextOrder, ...customerOrderLedger];

  return mapCustomerOrder(nextOrder);
};
