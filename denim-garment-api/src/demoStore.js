const supplierCatalog = [
  { id: 'SUP-001', name: 'Fabric World Ltd', contact: '+94 77 456 9001', email: 'info@fabricworld.com', totalPurchaseValue: 850000 },
  { id: 'SUP-002', name: 'Thread Masters', contact: '+94 71 320 4402', email: 'sales@threadmasters.com', totalPurchaseValue: 620000 },
  { id: 'SUP-003', name: 'Button & Zip Co', contact: '+94 76 889 1770', email: 'orders@buttonzip.com', totalPurchaseValue: 340000 },
  { id: 'SUP-004', name: 'Denim Direct', contact: '+94 75 998 2014', email: 'bulk@denimdirect.com', totalPurchaseValue: 1200000 },
  { id: 'SUP-005', name: 'Packaging Plus', contact: '+94 78 612 5605', email: 'hello@packplus.com', totalPurchaseValue: 180000 },
  { id: 'SUP-006', name: 'Indigo Mills', contact: '+94 70 247 1188', email: 'support@indigomills.com', totalPurchaseValue: 410000 },
];

const purchaseLedger = [
  { orderId: 'PO-001', supplier: 'Fabric World Ltd', date: '2026-04-01', items: 2, totalValue: 331000, status: 'Delivered' },
  { orderId: 'PO-002', supplier: 'Thread Masters', date: '2026-04-03', items: 1, totalValue: 45000, status: 'Approved' },
  { orderId: 'PO-003', supplier: 'Denim Direct', date: '2026-04-05', items: 1, totalValue: 360000, status: 'Pending' },
  { orderId: 'PO-004', supplier: 'Button & Zip Co', date: '2026-04-06', items: 2, totalValue: 130000, status: 'Approved' },
  { orderId: 'PO-005', supplier: 'Packaging Plus', date: '2026-04-07', items: 1, totalValue: 50000, status: 'Pending' },
  { orderId: 'PO-006', supplier: 'Indigo Mills', date: '2026-04-09', items: 3, totalValue: 290000, status: 'Delivered' },
  { orderId: 'PO-007', supplier: 'Denim Direct', date: '2026-04-11', items: 2, totalValue: 205000, status: 'Pending' },
  { orderId: 'PO-008', supplier: 'Fabric World Ltd', date: '2026-04-14', items: 2, totalValue: 152000, status: 'Approved' },
];

const reportTrend = [
  { month: 'Sep', date: '2025-09-01', value: 1800 },
  { month: 'Oct', date: '2025-10-01', value: 2200 },
  { month: 'Nov', date: '2025-11-01', value: 1950 },
  { month: 'Dec', date: '2025-12-01', value: 2800 },
  { month: 'Jan', date: '2026-01-01', value: 2400 },
  { month: 'Feb', date: '2026-02-01', value: 2100 },
  { month: 'Mar', date: '2026-03-01', value: 1600 },
];

const supplierDistribution = [
  { name: 'Denim Direct', value: 32, color: '#F4A207' },
  { name: 'Fabric World Ltd', value: 24, color: '#3B82F6' },
  { name: 'Thread Masters', value: 18, color: '#22C55E' },
  { name: 'Indigo Mills', value: 12, color: '#0F172A' },
  { name: 'Button & Zip Co', value: 8, color: '#EF4444' },
  { name: 'Packaging Plus', value: 6, color: '#A855F7' },
];

const normalize = (value = '') => value.trim().toLowerCase();

const formatCurrency = (value) => `Rs. ${value.toLocaleString('en-US')}`;

const formatCompactCurrency = (value) => `Rs. ${Math.round(value / 1000)}K`;

const parseDateInput = (value) => {
  if (!value) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00`);
  }

  const slashMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const [, month, day, year] = slashMatch;
    return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`);
  }

  return null;
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

  return purchaseLedger
    .filter((purchase) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [purchase.orderId, purchase.supplier].some((value) => normalize(value).includes(normalizedQuery));

      const matchesStatus = !status || purchase.status === status;

      return matchesQuery && matchesStatus;
    })
    .map(({ totalValue, ...purchase }) => ({
      ...purchase,
      total: formatCurrency(totalValue),
    }));
};

export const getSuppliers = ({ query = '' } = {}) => {
  const normalizedQuery = normalize(query);

  return supplierCatalog
    .filter((supplier) => {
      if (!normalizedQuery) {
        return true;
      }

      return [supplier.id, supplier.name, supplier.email].some((value) => normalize(value).includes(normalizedQuery));
    })
    .map(({ totalPurchaseValue, ...supplier }) => ({
      ...supplier,
      totalPurchases: formatCurrency(totalPurchaseValue),
    }));
};

export const getDashboard = () => {
  const totalPurchaseValue = purchaseLedger.reduce((sum, purchase) => sum + purchase.totalValue, 0);
  const pendingOrders = purchaseLedger.filter((purchase) => purchase.status === 'Pending').length;
  const approvedOrders = purchaseLedger.filter((purchase) => purchase.status === 'Approved').length;
  const deliveredOrders = purchaseLedger.filter((purchase) => purchase.status === 'Delivered').length;
  const topSupplier = supplierCatalog.reduce((leader, supplier) =>
    supplier.totalPurchaseValue > leader.totalPurchaseValue ? supplier : leader,
  );

  return {
    stats: [
      {
        label: 'Total Purchases',
        value: formatCompactCurrency(totalPurchaseValue),
        subtext: 'This month',
        highlight: '12% below last month',
        highlightTone: 'negative',
        iconKey: 'currency',
      },
      {
        label: 'Total Orders',
        value: String(purchaseLedger.length),
        subtext: 'All time',
        highlight: '3 new this month',
        highlightTone: 'positive',
        iconKey: 'orders',
      },
      {
        label: 'Pending Orders',
        value: String(pendingOrders),
        subtext: 'Awaiting approval',
        highlight: `${approvedOrders} approved`,
        highlightTone: 'info',
        iconKey: 'pending',
      },
      {
        label: 'Suppliers',
        value: String(supplierCatalog.length),
        subtext: 'Active partners',
        highlight: '+2 new this quarter',
        highlightTone: 'positive',
        iconKey: 'suppliers',
      },
    ],
    monthlyTrend: reportTrend.map(({ month, value }) => ({ month, value })),
    quickOverview: [
      {
        title: 'Delivered Orders',
        subtitle: `${deliveredOrders} completed`,
        iconKey: 'truck',
        tone: 'success',
      },
      {
        title: 'Pending Approval',
        subtitle: `${pendingOrders} orders waiting`,
        iconKey: 'clock',
        tone: 'warning',
      },
      {
        title: 'Top Supplier',
        subtitle: `${topSupplier.name} - ${formatCompactCurrency(topSupplier.totalPurchaseValue)}`,
        iconKey: 'trend',
        tone: 'info',
      },
    ],
  };
};

export const getReports = ({ from, to, supplier } = {}) => {
  const fromDate = parseDateInput(from);
  const toDate = parseDateInput(to);

  const filteredTrend = reportTrend
    .filter((entry) => isWithinRange(entry.date, fromDate, toDate))
    .map(({ month, value }) => ({ month, value }));

  const selectedSupplier = supplierDistribution.find((item) => item.name === supplier);

  if (!selectedSupplier) {
    return {
      monthlyTrend: filteredTrend,
      supplierDistribution,
      supplierOptions: supplierCatalog.map((item) => item.name),
    };
  }

  return {
    monthlyTrend: filteredTrend.map((entry) => ({
      month: entry.month,
      value: Math.round((entry.value * selectedSupplier.value) / 100),
    })),
    supplierDistribution: [
      selectedSupplier,
      {
        name: 'Other suppliers',
        value: 100 - selectedSupplier.value,
        color: '#CBD5E1',
      },
    ],
    supplierOptions: supplierCatalog.map((item) => item.name),
  };
};
