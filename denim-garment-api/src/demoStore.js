export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

export const PURCHASE_STATUSES = ['Delivered', 'Approved', 'Pending'];

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

const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short' });

let purchaseLedger = initialPurchaseLedger.map((purchase) => ({ ...purchase }));

const normalize = (value = '') => String(value).trim().toLowerCase();

const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

const formatCurrency = (value) => `Rs. ${Math.round(value).toLocaleString('en-US')}`;

const formatCompactCurrency = (value) => `Rs. ${Math.round(value / 1000)}K`;

const toMonthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const formatMonthLabel = (monthKey) => monthFormatter.format(new Date(`${monthKey}-01T00:00:00`));

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

  return null;
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

const createNextOrderId = () => {
  const nextNumber =
    purchaseLedger.reduce((max, purchase) => {
      const parsed = Number(purchase.orderId.replace('PO-', ''));
      return Number.isFinite(parsed) && parsed > max ? parsed : max;
    }, 0) + 1;

  return `PO-${String(nextNumber).padStart(3, '0')}`;
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
  const supplierFilteredPurchases = supplier
    ? dateFilteredPurchases.filter((purchase) => purchase.supplier === supplier)
    : dateFilteredPurchases;

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
