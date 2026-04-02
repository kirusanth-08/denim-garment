import { Plus } from 'lucide-react';
import { useDeferredValue, useState } from 'react';
import { useAdminAuth } from '../../app/context/AdminAuthContext';
import { SearchField } from '../../components/forms/SearchField';
import { SelectField } from '../../components/forms/SelectField';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import { ActionIconGroup, type TableAction } from '../../components/tables/ActionIconGroup';
import { Column, DataTable } from '../../components/tables/DataTable';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { STOCK_INCOME_STATUSES } from '../../constants/status';
import { StockIncome } from '../../features/purchases/types/purchase';
import { useApiResource } from '../../hooks/useApiResource';
import { apiRequest, withQuery } from '../../lib/api';

export const PurchasesPage = () => {
  const { admin } = useAdminAuth();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All Status');
  const [refreshKey, setRefreshKey] = useState(0);
  const [mutating, setMutating] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const canDelete = admin?.role === 'admin';

  const requestPath = withQuery('/stock-incomes', {
    query: deferredQuery,
    status: status === 'All Status' ? undefined : status,
    refresh: String(refreshKey),
  });

  const { data, loading, error } = useApiResource<StockIncome[]>(requestPath);
  const stockIncomes = data ?? [];

  const refresh = () => setRefreshKey((currentValue) => currentValue + 1);

  const handleCreateStockIncome = async () => {
    const supplier = window.prompt('Supplier name', stockIncomes[0]?.supplier ?? '');
    if (supplier === null) {
      return;
    }

    const receivedDate = window.prompt('Received date (YYYY-MM-DD)', new Date().toISOString().slice(0, 10));
    if (receivedDate === null) {
      return;
    }

    const materialLotsInput = window.prompt('Material lots', '1');
    if (materialLotsInput === null) {
      return;
    }

    const stockValueInput = window.prompt('Stock value', '1000');
    if (stockValueInput === null) {
      return;
    }

    const statusInput = window.prompt(
      `Status (${STOCK_INCOME_STATUSES.join(', ')})`,
      STOCK_INCOME_STATUSES[0],
    );
    if (statusInput === null) {
      return;
    }

    if (!STOCK_INCOME_STATUSES.includes(statusInput as (typeof STOCK_INCOME_STATUSES)[number])) {
      window.alert(`Status must be one of: ${STOCK_INCOME_STATUSES.join(', ')}`);
      return;
    }

    const materialLots = Number(materialLotsInput);
    const stockValue = Number(stockValueInput);

    if (!Number.isInteger(materialLots) || materialLots <= 0) {
      window.alert('Material lots must be a positive whole number.');
      return;
    }

    if (!Number.isFinite(stockValue) || stockValue <= 0) {
      window.alert('Stock value must be greater than zero.');
      return;
    }

    setMutating(true);

    try {
      await apiRequest<StockIncome>('/stock-incomes', {
        method: 'POST',
        body: {
          supplier,
          receivedDate,
          materialLots,
          stockValue,
          status: statusInput,
        },
      });

      refresh();
    } catch (reason: unknown) {
      window.alert(reason instanceof Error ? reason.message : 'Failed to create stock income.');
    } finally {
      setMutating(false);
    }
  };

  const handleRowAction = async (row: StockIncome, action: TableAction) => {
    if (action === 'view') {
      window.alert(
        `Income ID: ${row.incomeId}\nSupplier: ${row.supplier}\nReceived Date: ${row.receivedDate}\nMaterial Lots: ${row.materialLots}\nStock Value: ${row.stockValueLabel}\nStatus: ${row.status}`,
      );
      return;
    }

    if (action === 'edit') {
      const statusInput = window.prompt(
        `Update status (${STOCK_INCOME_STATUSES.join(', ')})`,
        row.status,
      );

      if (statusInput === null) {
        return;
      }

      if (!STOCK_INCOME_STATUSES.includes(statusInput as (typeof STOCK_INCOME_STATUSES)[number])) {
        window.alert(`Status must be one of: ${STOCK_INCOME_STATUSES.join(', ')}`);
        return;
      }

      setMutating(true);

      try {
        await apiRequest<StockIncome>(`/stock-incomes/${row.incomeId}`, {
          method: 'PATCH',
          body: {
            status: statusInput,
          },
        });

        refresh();
      } catch (reason: unknown) {
        window.alert(reason instanceof Error ? reason.message : 'Failed to update stock income.');
      } finally {
        setMutating(false);
      }

      return;
    }

    if (!canDelete) {
      window.alert('Only admin users can delete stock income entries.');
      return;
    }

    const confirmed = window.confirm(`Delete stock income ${row.incomeId}? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    setMutating(true);

    try {
      await apiRequest<void>(`/stock-incomes/${row.incomeId}`, {
        method: 'DELETE',
      });

      refresh();
    } catch (reason: unknown) {
      window.alert(reason instanceof Error ? reason.message : 'Failed to delete stock income.');
    } finally {
      setMutating(false);
    }
  };

  const columns: Column<StockIncome>[] = [
    { key: 'incomeId', header: 'Income ID', render: (row) => row.incomeId },
    { key: 'supplier', header: 'Supplier', render: (row) => row.supplier },
    { key: 'receivedDate', header: 'Received Date', render: (row) => row.receivedDate },
    { key: 'materialLots', header: 'Material Lots', render: (row) => row.materialLots },
    { key: 'stockValueLabel', header: 'Stock Value', render: (row) => row.stockValueLabel },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <ActionIconGroup
          actions={['view', 'edit', 'delete']}
          onAction={(action) => handleRowAction(row, action)}
          disabledActions={canDelete ? [] : ['delete']}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Stock Intake Management"
        title="Stock Incomes"
        subtitle="Track incoming stock for denim garment production"
        action={
          <PrimaryButton type="button" onClick={handleCreateStockIncome} disabled={mutating}>
            <Plus size={18} /> New Stock Income
          </PrimaryButton>
        }
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
        {mutating ? <div className="mt-1.5 text-xs text-slate-500">Applying changes...</div> : null}
      </Card>

      {error && !data ? (
        <Card className="p-6 text-base text-red-600">Could not load stock incomes. {error}</Card>
      ) : (
        <DataTable columns={columns} rows={stockIncomes} emptyMessage="No stock incomes match your current filters." />
      )}
    </div>
  );
};
