import { Purchase } from '../types/purchase';

export const purchaseData: Purchase[] = [
  { orderId: 'PO-001', supplier: 'Fabric World Ltd', date: '2026-03-01', items: 2, total: 'Rs. 331,000', status: 'Delivered' },
  { orderId: 'PO-002', supplier: 'Thread Masters', date: '2026-03-03', items: 1, total: 'Rs. 45,000', status: 'Approved' },
  { orderId: 'PO-003', supplier: 'Denim Direct', date: '2026-03-05', items: 1, total: 'Rs. 360,000', status: 'Pending' },
  { orderId: 'PO-004', supplier: 'Button & Zip Co', date: '2026-03-06', items: 2, total: 'Rs. 130,000', status: 'Approved' },
  { orderId: 'PO-005', supplier: 'Packaging Plus', date: '2026-03-07', items: 1, total: 'Rs. 50,000', status: 'Pending' },
];
