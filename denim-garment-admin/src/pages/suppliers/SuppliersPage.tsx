import { Plus } from 'lucide-react';
import { useDeferredValue, useState } from 'react';
import { SearchField } from '../../components/forms/SearchField';
import { ActionIconGroup } from '../../components/tables/ActionIconGroup';
import { Column, DataTable } from '../../components/tables/DataTable';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { Supplier } from '../../features/suppliers/types/supplier';
import { useApiResource } from '../../hooks/useApiResource';
import { withQuery } from '../../lib/api';

const columns: Column<Supplier>[] = [
  { key: 'id', header: 'ID', render: (row) => row.id },
  { key: 'name', header: 'Name', render: (row) => row.name },
  { key: 'contact', header: 'Contact', render: (row) => row.contact },
  { key: 'email', header: 'Email', render: (row) => <span className="text-slate-500">{row.email}</span> },
  { key: 'totalStockIncome', header: 'Total Stock Income', render: (row) => row.totalStockIncome },
  { key: 'actions', header: 'Actions', align: 'right', render: () => <ActionIconGroup actions={['edit', 'delete']} /> },
];

export const SuppliersPage = () => {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const requestPath = withQuery('/suppliers', { query: deferredQuery });
  const { data, loading, error } = useApiResource<Supplier[]>(requestPath);
  const suppliers = data ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Supplier Management"
        title="Suppliers"
        subtitle="Manage supplier relationships and stock intake value"
        action={<PrimaryButton><Plus size={22} /> Add Supplier</PrimaryButton>}
      />

      <Card className="mb-6 p-4">
        <SearchField value={query} onChange={setQuery} placeholder="Search suppliers..." />
        <div className="mt-3 text-sm text-slate-500">
          {loading ? 'Refreshing suppliers and intake totals from the demo API...' : `${suppliers.length} suppliers available.`}
        </div>
      </Card>

      {error && !data ? (
        <Card className="p-6 text-base text-red-600">Could not load suppliers. {error}</Card>
      ) : (
        <DataTable columns={columns} rows={suppliers} emptyMessage="No suppliers match your current search." />
      )}
    </div>
  );
};
