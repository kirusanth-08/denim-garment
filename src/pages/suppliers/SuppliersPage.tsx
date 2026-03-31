import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SearchField } from '../../components/forms/SearchField';
import { ActionIconGroup } from '../../components/tables/ActionIconGroup';
import { Column, DataTable } from '../../components/tables/DataTable';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { supplierData } from '../../features/suppliers/data/supplierData';
import { Supplier } from '../../features/suppliers/types/supplier';

const columns: Column<Supplier>[] = [
  { key: 'id', header: 'ID', render: (row) => row.id },
  { key: 'name', header: 'Name', render: (row) => row.name },
  { key: 'contact', header: 'Contact', render: (row) => row.contact },
  { key: 'email', header: 'Email', render: (row) => <span className="text-slate-500">{row.email}</span> },
  { key: 'totalPurchases', header: 'Total Purchases', render: (row) => row.totalPurchases },
  { key: 'actions', header: 'Actions', align: 'right', render: () => <ActionIconGroup actions={['edit', 'delete']} /> },
];

export const SuppliersPage = () => {
  const [query, setQuery] = useState('');

  const filteredRows = useMemo(
    () => supplierData.filter((item) => [item.id, item.name, item.email].join(' ').toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <div>
      <PageHeader
        eyebrow="Supplier Management"
        title="Suppliers"
        subtitle="Manage your supplier network"
        action={<PrimaryButton><Plus size={22} /> Add Supplier</PrimaryButton>}
      />

      <Card className="mb-6 p-4">
        <SearchField value={query} onChange={setQuery} placeholder="Search suppliers..." />
      </Card>

      <DataTable columns={columns} rows={filteredRows} />
    </div>
  );
};
