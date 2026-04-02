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
import { STOCK_INCOME_STATUSES } from '../../constants/status';
import { StockIncome } from '../../features/purchases/types/purchase';
import { useApiResource } from '../../hooks/useApiResource';
import { withQuery } from '../../lib/api';

const columns: Column<StockIncome>[] = [
  { key: 'incomeId', header: 'Income ID', render: (row) => row.incomeId },
  { key: 'supplier', header: 'Supplier', render: (row) => row.supplier },
  { key: 'receivedDate', header: 'Received Date', render: (row) => row.receivedDate },
  { key: 'materialLots', header: 'Material Lots', render: (row) => row.materialLots },
  { key: 'stockValueLabel', header: 'Stock Value', render: (row) => row.stockValueLabel },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  { key: 'actions', header: 'Actions', align: 'right', render: () => <ActionIconGroup actions={['view', 'edit', 'delete']} /> },
];

export const PurchasesPage = () => {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All Status');
  const deferredQuery = useDeferredValue(query);

  const requestPath = withQuery('/stock-incomes', {
    query: deferredQuery,
    status: status === 'All Status' ? undefined : status,
  });

  const { data, loading, error } = useApiResource<StockIncome[]>(requestPath);
  const stockIncomes = data ?? [];

  return (
    <div>
      <PageHeader
        eyebrow="Stock Intake Management"
        title="Stock Incomes"
        subtitle="Track incoming stock for denim garment production"
        action={<PrimaryButton><Plus size={22} /> New Stock Income</PrimaryButton>}
      />
      <Card className="mb-6 p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_200px]">
          <SearchField value={query} onChange={setQuery} placeholder="Search by income ID or supplier..." />
          <SelectField
            value={status}
            onChange={setStatus}
            options={[{ label: 'All Status', value: 'All Status' }, ...STOCK_INCOME_STATUSES.map((s) => ({ label: s, value: s }))]}
          />
        </div>
        <div className="mt-3 text-sm text-slate-500">
          {loading ? 'Refreshing stock incomes from the demo API...' : `${stockIncomes.length} stock income entries found.`}
        </div>
      </Card>

      {error && !data ? (
        <Card className="p-6 text-base text-red-600">Could not load stock incomes. {error}</Card>
      ) : (
        <DataTable columns={columns} rows={stockIncomes} emptyMessage="No stock incomes match your current filters." />
      )}
    </div>
  );
};
