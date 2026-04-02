import { Plus } from 'lucide-react';
import { useDeferredValue, useState } from 'react';
import { useAdminAuth } from '../../app/context/AdminAuthContext';
import { SearchField } from '../../components/forms/SearchField';
import { ActionIconGroup, type TableAction } from '../../components/tables/ActionIconGroup';
import { Column, DataTable } from '../../components/tables/DataTable';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { Supplier } from '../../features/suppliers/types/supplier';
import { useApiResource } from '../../hooks/useApiResource';
import { apiRequest, withQuery } from '../../lib/api';

export const SuppliersPage = () => {
  const { admin } = useAdminAuth();
  const [query, setQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [mutating, setMutating] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const canDelete = admin?.role === 'admin';

  const requestPath = withQuery('/suppliers', { query: deferredQuery, refresh: String(refreshKey) });
  const { data, loading, error } = useApiResource<Supplier[]>(requestPath);
  const suppliers = data ?? [];

  const refresh = () => setRefreshKey((currentValue) => currentValue + 1);

  const handleAddSupplier = async () => {
    const name = window.prompt('Supplier name', '');
    if (name === null) {
      return;
    }

    const contact = window.prompt('Supplier contact', '');
    if (contact === null) {
      return;
    }

    const email = window.prompt('Supplier email', '');
    if (email === null) {
      return;
    }

    setMutating(true);

    try {
      await apiRequest<Supplier>('/suppliers', {
        method: 'POST',
        body: {
          name,
          contact,
          email,
        },
      });

      refresh();
    } catch (reason: unknown) {
      window.alert(reason instanceof Error ? reason.message : 'Failed to add supplier.');
    } finally {
      setMutating(false);
    }
  };

  const handleRowAction = async (row: Supplier, action: TableAction) => {
    if (action === 'edit') {
      const name = window.prompt('Supplier name', row.name);
      if (name === null) {
        return;
      }

      const contact = window.prompt('Supplier contact', row.contact);
      if (contact === null) {
        return;
      }

      const email = window.prompt('Supplier email', row.email);
      if (email === null) {
        return;
      }

      setMutating(true);

      try {
        await apiRequest<Supplier>(`/suppliers/${row.id}`, {
          method: 'PATCH',
          body: {
            name,
            contact,
            email,
          },
        });

        refresh();
      } catch (reason: unknown) {
        window.alert(reason instanceof Error ? reason.message : 'Failed to update supplier.');
      } finally {
        setMutating(false);
      }

      return;
    }

    if (!canDelete) {
      window.alert('Only admin users can delete suppliers.');
      return;
    }

    const confirmed = window.confirm(`Delete supplier ${row.name}?`);
    if (!confirmed) {
      return;
    }

    setMutating(true);

    try {
      await apiRequest<void>(`/suppliers/${row.id}`, {
        method: 'DELETE',
      });

      refresh();
    } catch (reason: unknown) {
      window.alert(reason instanceof Error ? reason.message : 'Failed to delete supplier.');
    } finally {
      setMutating(false);
    }
  };

  const columns: Column<Supplier>[] = [
    { key: 'id', header: 'ID', render: (row) => row.id },
    { key: 'name', header: 'Name', render: (row) => row.name },
    { key: 'contact', header: 'Contact', render: (row) => row.contact },
    { key: 'email', header: 'Email', render: (row) => <span className="text-slate-500">{row.email}</span> },
    { key: 'totalStockIncome', header: 'Total Stock Income', render: (row) => row.totalStockIncome },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <ActionIconGroup
          actions={['edit', 'delete']}
          onAction={(action) => handleRowAction(row, action)}
          disabledActions={canDelete ? [] : ['delete']}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Supplier Management"
        title="Suppliers"
        subtitle="Manage supplier relationships and stock intake value"
        action={
          <PrimaryButton type="button" onClick={handleAddSupplier} disabled={mutating}>
            <Plus size={18} /> Add Supplier
          </PrimaryButton>
        }
      />

      <Card className="mb-6 p-4">
        <SearchField value={query} onChange={setQuery} placeholder="Search suppliers..." />
        <div className="mt-3 text-sm text-slate-500">
          {loading ? 'Refreshing suppliers and intake totals from the demo API...' : `${suppliers.length} suppliers available.`}
        </div>
        {mutating ? <div className="mt-1.5 text-xs text-slate-500">Applying changes...</div> : null}
      </Card>

      {error && !data ? (
        <Card className="p-6 text-base text-red-600">Could not load suppliers. {error}</Card>
      ) : (
        <DataTable columns={columns} rows={suppliers} emptyMessage="No suppliers match your current search." />
      )}
    </div>
  );
};
