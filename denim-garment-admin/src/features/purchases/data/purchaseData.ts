import { StockIncome } from '../types/purchase';

export const purchaseData: StockIncome[] = [
  {
    incomeId: 'SI-001',
    supplier: 'Fabric World Ltd',
    receivedDate: '2026-03-01',
    materialLots: 2,
    stockValue: 331000,
    stockValueLabel: 'Rs. 331,000',
    status: 'Received',
  },
  {
    incomeId: 'SI-002',
    supplier: 'Thread Masters',
    receivedDate: '2026-03-03',
    materialLots: 1,
    stockValue: 45000,
    stockValueLabel: 'Rs. 45,000',
    status: 'Quality Checked',
  },
  {
    incomeId: 'SI-003',
    supplier: 'Denim Direct',
    receivedDate: '2026-03-05',
    materialLots: 1,
    stockValue: 360000,
    stockValueLabel: 'Rs. 360,000',
    status: 'Pending Inspection',
  },
  {
    incomeId: 'SI-004',
    supplier: 'Button & Zip Co',
    receivedDate: '2026-03-06',
    materialLots: 2,
    stockValue: 130000,
    stockValueLabel: 'Rs. 130,000',
    status: 'Quality Checked',
  },
  {
    incomeId: 'SI-005',
    supplier: 'Packaging Plus',
    receivedDate: '2026-03-07',
    materialLots: 1,
    stockValue: 50000,
    stockValueLabel: 'Rs. 50,000',
    status: 'Pending Inspection',
  },
];
