import { ReportData } from '../types/report';

export const reportData: ReportData = {
  monthlyTrend: [
    { month: 'Sep', value: 1800 },
    { month: 'Oct', value: 2200 },
    { month: 'Nov', value: 1950 },
    { month: 'Dec', value: 2800 },
    { month: 'Jan', value: 2400 },
    { month: 'Feb', value: 2100 },
    { month: 'Mar', value: 1600 },
  ],
  supplierDistribution: [
    { name: 'Denim Direct', value: 32, color: '#F4A207' },
    { name: 'Fabric World Ltd', value: 24, color: '#3B82F6' },
    { name: 'Thread Masters', value: 18, color: '#22C55E' },
    { name: 'Indigo Mills', value: 12, color: '#0F172A' },
    { name: 'Button & Zip Co', value: 8, color: '#EF4444' },
    { name: 'Packaging Plus', value: 6, color: '#A855F7' },
  ],
  supplierOptions: ['Fabric World Ltd', 'Thread Masters', 'Button & Zip Co', 'Denim Direct', 'Packaging Plus', 'Indigo Mills'],
};
