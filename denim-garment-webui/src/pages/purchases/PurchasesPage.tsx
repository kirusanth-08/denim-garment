import { Plus } from 'lucide-react';
import { useDeferredValue, useState } from 'react';
import { SearchField } from '../../components/forms/SearchField';
import { SelectField } from '../../components/forms/SelectField';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import { ActionIconGroup } from '../../components/tables/ActionIconGroup';
import { Column, DataTable } from '../../components/tables/DataTable';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { PURCHASE_STATUSES } from '../../constants/status';
import { Purchase } from '../../features/purchases/types/purchase';
import { useApiResource } from '../../hooks/useApiResource';
import { withQuery } from '../../lib/api';

const columns: Column<Purchase>[] = [
  { key: 'orderId', header: 'Order ID', render: (row) => row.orderId },
  { key: 'supplier', header: 'Supplier', render: (row) => row.supplier },
  { key: 'date', header: 'Date', render: (row) => row.date },
  { key: 'items', header: 'Items', render: (row) => row.items },
  { key: 'total', header: 'Total', render: (row) => row.total },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  { key: 'actions', header: 'Actions', align: 'right', render: () => <ActionIconGroup actions={['view', 'edit', 'delete']} /> },
];

export const PurchasesPage = () => {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All Status');
  const deferredQuery = useDeferredValue(query);

  const requestPath = withQuery('/purchases', {
    query: deferredQuery,
    status: status === 'All Status' ? undefined : status,
  });

  const { data, loading, error } = useApiResource<Purchase[]>(requestPath);
  const purchases = data ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Purchase Management"
        title="Purchases"
        subtitle="Manage purchase orders"
        action={<PrimaryButton><Plus size={22} /> New Purchase</PrimaryButton>}
      />
      <Card className="mb-6 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_200px]">
          <SearchField value={query} onChange={setQuery} placeholder="Search by ID or supplier..." />
          <SelectField
            value={status}
            onChange={setStatus}
            options={[{ label: 'All Status', value: 'All Status' }, ...PURCHASE_STATUSES.map((s) => ({ label: s, value: s }))]}
          />
        </div>
        <div className="mt-3 text-sm text-slate-500">
          {loading ? 'Refreshing purchases from the demo API...' : `${purchases.length} purchase orders found.`}
        </div>
      </Card>

      {error && !data ? (
        <Card className="p-6 text-base text-red-600">Could not load purchases. {error}</Card>
      ) : (
        <DataTable columns={columns} rows={purchases} emptyMessage="No purchase orders match your current filters." />
      )}
    </div>
  );
};
