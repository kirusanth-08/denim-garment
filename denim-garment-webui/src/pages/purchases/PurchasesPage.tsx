import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useDeferredValue, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePortalDataContext } from '../../app/context/PortalDataContext';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import { SearchField } from '../../components/forms/SearchField';
import { SelectField } from '../../components/forms/SelectField';
import { DataTable, Column } from '../../components/tables/DataTable';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { PURCHASE_STATUSES } from '../../constants/status';
import { DeletePurchaseDialog } from '../../features/purchases/components/DeletePurchaseDialog';
import { PurchaseFormDialog } from '../../features/purchases/components/PurchaseFormDialog';
import { Purchase, PurchaseInput } from '../../features/purchases/types/purchase';
import { Supplier } from '../../features/suppliers/types/supplier';
import { useApiResource } from '../../hooks/useApiResource';
import { apiRequest, withQuery } from '../../lib/api';

const getErrorMessage = (reason: unknown) => (reason instanceof Error ? reason.message : 'Something went wrong.');

export const PurchasesPage = () => {
  const { version, bumpVersion } = usePortalDataContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All Status');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [purchaseToDelete, setPurchaseToDelete] = useState<Purchase | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const deferredQuery = useDeferredValue(query);
  const shouldOpenCreate = searchParams.get('new') === '1';

  const purchasesPath = withQuery('/purchases', {
    query: deferredQuery,
    status: status === 'All Status' ? undefined : status,
  });

  const { data, loading, error, reload } = useApiResource<Purchase[]>(purchasesPath, [version]);
  const { data: suppliersData } = useApiResource<Supplier[]>('/suppliers', [version]);

  const purchases = data ?? [];
  const supplierNames = suppliersData?.map((supplier) => supplier.name) ?? [];

  useEffect(() => {
    if (shouldOpenCreate) {
      setEditingPurchase(null);
      setFormError(null);
      setIsFormOpen(true);
    }
  }, [shouldOpenCreate]);

  const updateSearchParams = (updater: (current: URLSearchParams) => void) => {
    const next = new URLSearchParams(searchParams);
    updater(next);
    setSearchParams(next, { replace: true });
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingPurchase(null);
    setFormError(null);

    if (searchParams.get('new') === '1') {
      updateSearchParams((current) => current.delete('new'));
    }
  };

  const openCreate = () => {
    setEditingPurchase(null);
    setFormError(null);
    setIsFormOpen(true);
  };

  const openEdit = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    setFormError(null);
    setIsFormOpen(true);
  };

  const submitPurchase = async (payload: PurchaseInput) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      if (editingPurchase) {
        await apiRequest<Purchase>(`/purchases/${editingPurchase.orderId}`, {
          method: 'PATCH',
          body: payload,
        });
      } else {
        await apiRequest<Purchase>('/purchases', {
          method: 'POST',
          body: payload,
        });
      }

      closeForm();
      reload();
      bumpVersion();
    } catch (reason) {
      setFormError(getErrorMessage(reason));
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!purchaseToDelete) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await apiRequest<void>(`/purchases/${purchaseToDelete.orderId}`, {
        method: 'DELETE',
      });

      setPurchaseToDelete(null);
      reload();
      bumpVersion();
    } catch (reason) {
      setDeleteError(getErrorMessage(reason));
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: Column<Purchase>[] = [
    { key: 'orderId', header: 'Order ID', render: (row) => row.orderId },
    { key: 'supplier', header: 'Supplier', render: (row) => row.supplier },
    { key: 'date', header: 'Date', render: (row) => row.date },
    { key: 'items', header: 'Items', render: (row) => row.items },
    { key: 'total', header: 'Total', render: (row) => row.total },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>
            <Pencil size={15} />
            Edit
          </Button>
          <Button variant="ghost" size="sm" className="border-red-100 text-red-600 hover:bg-red-50" onClick={() => setPurchaseToDelete(row)}>
            <Trash2 size={15} />
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Purchase requests"
        title="Manage your denim purchase requests"
        subtitle="Search live orders, update request details, and send new purchase instructions directly from the customer portal."
        action={
          <Button onClick={openCreate}>
            <Plus size={18} />
            New Request
          </Button>
        }
      />

      <Card className="mb-6 p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <SearchField value={query} onChange={setQuery} placeholder="Search by order ID or supplier..." />
          <SelectField
            value={status}
            onChange={setStatus}
            options={[{ label: 'All Status', value: 'All Status' }, ...PURCHASE_STATUSES.map((item) => ({ label: item, value: item }))]}
          />
        </div>
        <div className="mt-3 text-sm text-slate-500">
          {loading ? 'Refreshing purchase requests from the demo API...' : `${purchases.length} purchase requests in view.`}
        </div>
      </Card>

      {error && !data ? (
        <Card className="p-6 text-base text-red-600">Could not load purchase requests. {error}</Card>
      ) : (
        <DataTable
          columns={columns}
          rows={purchases}
          getRowKey={(row) => row.orderId}
          emptyMessage="No purchase requests match your current filters."
        />
      )}

      <PurchaseFormDialog
        open={isFormOpen}
        mode={editingPurchase ? 'edit' : 'create'}
        purchase={editingPurchase}
        suppliers={supplierNames}
        submitting={isSubmitting}
        error={formError}
        onClose={closeForm}
        onSubmit={submitPurchase}
      />

      <DeletePurchaseDialog
        open={Boolean(purchaseToDelete)}
        purchase={purchaseToDelete}
        deleting={isDeleting}
        error={deleteError}
        onClose={() => {
          setPurchaseToDelete(null);
          setDeleteError(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
};
