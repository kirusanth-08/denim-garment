import { Plus } from 'lucide-react';
import { FormEvent, useDeferredValue, useState } from 'react';
import { useAdminAuth } from '../../app/context/AdminAuthContext';
import { SearchField } from '../../components/forms/SearchField';
import { SelectField } from '../../components/forms/SelectField';
import { StatusBadge } from '../../components/feedback/StatusBadge';
import { ActionIconGroup, type TableAction } from '../../components/tables/ActionIconGroup';
import { Column, DataTable } from '../../components/tables/DataTable';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { PageHeader } from '../../components/ui/PageHeader';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { STOCK_INCOME_STATUSES, type StockIncomeStatus } from '../../constants/status';
import { StockIncome } from '../../features/purchases/types/purchase';
import { Supplier } from '../../features/suppliers/types/supplier';
import { useApiResource } from '../../hooks/useApiResource';
import { apiRequest, withQuery } from '../../lib/api';
import { cn } from '../../lib/cn';

type FeedbackState = {
  tone: 'success' | 'error';
  message: string;
};

type StockIncomeFormValues = {
  supplier: string;
  receivedDate: string;
  materialLots: string;
  stockValue: string;
  status: StockIncomeStatus;
};

type StockIncomeMutationPayload = {
  supplier: string;
  receivedDate: string;
  materialLots: number;
  stockValue: number;
  status: StockIncomeStatus;
};

const STOCK_INCOME_MIN_MATERIAL_LOTS = 1;
const STOCK_INCOME_MIN_VALUE = 1000;

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getTodayDate = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const parseDateInput = (value: string) => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  const parsed = new Date(Number(year), Number(month) - 1, Number(day));

  if (
    parsed.getFullYear() !== Number(year) ||
    parsed.getMonth() !== Number(month) - 1 ||
    parsed.getDate() !== Number(day)
  ) {
    return null;
  }

  return parsed;
};

const TODAY_DATE_INPUT_VALUE = toDateInputValue(getTodayDate());

const buildStockIncomeFormValues = (income?: StockIncome, defaultSupplier = ''): StockIncomeFormValues => ({
  supplier: income?.supplier ?? defaultSupplier,
  receivedDate: income?.receivedDate ?? TODAY_DATE_INPUT_VALUE,
  materialLots: income ? String(income.materialLots) : '1',
  stockValue: income ? String(income.stockValue) : '1000',
  status: income?.status ?? STOCK_INCOME_STATUSES[0],
});

const validateStockIncomeForm = (
  values: StockIncomeFormValues,
  supplierNames: readonly string[],
): StockIncomeMutationPayload | string => {
  const supplier = values.supplier.trim();
  const receivedDate = values.receivedDate.trim();
  const parsedReceivedDate = parseDateInput(receivedDate);
  const materialLots = Number(values.materialLots);
  const stockValue = Number(values.stockValue);

  if (supplierNames.length === 0) {
    return 'Add at least one supplier before creating a stock income entry.';
  }

  if (!supplier || !supplierNames.includes(supplier)) {
    return 'Please select a valid supplier.';
  }

  if (!receivedDate || !parsedReceivedDate) {
    return 'Received date must be a valid calendar date.';
  }

  if (parsedReceivedDate.getTime() > getTodayDate().getTime()) {
    return 'Received date cannot be in the future.';
  }

  if (!Number.isInteger(materialLots) || materialLots < STOCK_INCOME_MIN_MATERIAL_LOTS) {
    return `Material lots must be a whole number of at least ${STOCK_INCOME_MIN_MATERIAL_LOTS}.`;
  }

  if (!Number.isFinite(stockValue) || stockValue < STOCK_INCOME_MIN_VALUE) {
    return `Stock value must be at least LKR ${STOCK_INCOME_MIN_VALUE.toLocaleString('en-US')}.`;
  }

  if (!STOCK_INCOME_STATUSES.includes(values.status)) {
    return `Status must be one of: ${STOCK_INCOME_STATUSES.join(', ')}`;
  }

  return {
    supplier,
    receivedDate,
    materialLots,
    stockValue,
    status: values.status,
  };
};

export const PurchasesPage = () => {
  const { admin } = useAdminAuth();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All Status');
  const [refreshKey, setRefreshKey] = useState(0);
  const [mutating, setMutating] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<StockIncomeFormValues>(() => buildStockIncomeFormValues());
  const [editingIncome, setEditingIncome] = useState<StockIncome | null>(null);
  const [viewingIncome, setViewingIncome] = useState<StockIncome | null>(null);
  const [deletingIncome, setDeletingIncome] = useState<StockIncome | null>(null);
  const deferredQuery = useDeferredValue(query);
  const canDelete = admin?.role === 'admin';

  const requestPath = withQuery('/stock-incomes', {
    query: deferredQuery,
    status: status === 'All Status' ? undefined : status,
    refresh: String(refreshKey),
  });

  const supplierRequestPath = withQuery('/suppliers', {
    refresh: String(refreshKey),
  });

  const { data, loading, error } = useApiResource<StockIncome[]>(requestPath);
  const { data: supplierData, error: supplierError } = useApiResource<Supplier[]>(supplierRequestPath);
  const stockIncomes = data ?? [];
  const suppliers = supplierData ?? [];
  const supplierNames = suppliers.map((supplier) => supplier.name);

  const refresh = () => setRefreshKey((currentValue) => currentValue + 1);

  const handleOpenCreateModal = () => {
    setFeedback(null);
    setEditingIncome(null);
    setFormError(null);
    setFormValues(buildStockIncomeFormValues(undefined, suppliers[0]?.name ?? ''));
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (income: StockIncome) => {
    setFeedback(null);
    setEditingIncome(income);
    setFormError(null);
    setFormValues(buildStockIncomeFormValues(income));
    setIsFormOpen(true);
  };

  const handleCloseFormModal = () => {
    if (mutating) {
      return;
    }

    setIsFormOpen(false);
    setFormError(null);
    setEditingIncome(null);
  };

  const handleCloseDeleteModal = () => {
    if (mutating) {
      return;
    }

    setDeletingIncome(null);
  };

  const updateFormField = <K extends keyof StockIncomeFormValues>(key: K, value: StockIncomeFormValues[K]) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));
  };

  const handleSubmitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    const payload = validateStockIncomeForm(formValues, supplierNames);
    if (typeof payload === 'string') {
      setFormError(payload);
      return;
    }

    setMutating(true);
    setFormError(null);

    const activeIncome = editingIncome;

    try {
      if (activeIncome) {
        await apiRequest<StockIncome>(`/stock-incomes/${activeIncome.incomeId}`, {
          method: 'PATCH',
          body: payload,
        });

        setFeedback({
          tone: 'success',
          message: `Stock income ${activeIncome.incomeId} updated successfully.`,
        });
      } else {
        await apiRequest<StockIncome>('/stock-incomes', {
          method: 'POST',
          body: payload,
        });

        setFeedback({
          tone: 'success',
          message: 'Stock income entry created successfully.',
        });
      }

      setIsFormOpen(false);
      setEditingIncome(null);
      refresh();
    } catch (reason: unknown) {
      setFormError(reason instanceof Error ? reason.message : 'Failed to save stock income changes.');
    } finally {
      setMutating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingIncome) {
      return;
    }

    if (!canDelete) {
      setFeedback({
        tone: 'error',
        message: 'Only admin users can delete stock income entries.',
      });
      setDeletingIncome(null);
      return;
    }

    setMutating(true);
    setFeedback(null);

    const incomeToDelete = deletingIncome;

    try {
      await apiRequest<void>(`/stock-incomes/${incomeToDelete.incomeId}`, {
        method: 'DELETE',
      });

      setFeedback({
        tone: 'success',
        message: `Stock income ${incomeToDelete.incomeId} was deleted.`,
      });

      setDeletingIncome(null);
      refresh();
    } catch (reason: unknown) {
      setFeedback({
        tone: 'error',
        message: reason instanceof Error ? reason.message : 'Failed to delete stock income.',
      });
    } finally {
      setMutating(false);
    }
  };

  const handleRowAction = (row: StockIncome, action: TableAction) => {
    if (action === 'view') {
      setViewingIncome(row);
      return;
    }

    if (action === 'edit') {
      handleOpenEditModal(row);
      return;
    }

    if (!canDelete) {
      setFeedback({
        tone: 'error',
        message: 'Only admin users can delete stock income entries.',
      });
      return;
    }

    setFeedback(null);
    setDeletingIncome(row);
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
          <PrimaryButton type="button" onClick={handleOpenCreateModal} disabled={mutating}>
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
        {supplierError ? <div className="mt-1.5 text-xs text-red-600">Supplier list could not be refreshed. {supplierError}</div> : null}
        {mutating ? <div className="mt-1.5 text-xs text-slate-500">Applying changes...</div> : null}
        {feedback ? (
          <div
            className={cn(
              'mt-3 rounded-xl border px-3.5 py-2 text-sm',
              feedback.tone === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-red-200 bg-red-50 text-red-700',
            )}
          >
            {feedback.message}
          </div>
        ) : null}
      </Card>

      {error && !data ? (
        <Card className="p-6 text-base text-red-600">Could not load stock incomes. {error}</Card>
      ) : (
        <DataTable columns={columns} rows={stockIncomes} emptyMessage="No stock incomes match your current filters." />
      )}

      <Modal
        open={isFormOpen}
        onClose={handleCloseFormModal}
        title={editingIncome ? `Edit ${editingIncome.incomeId}` : 'Create Stock Income'}
        description="Record supplier stock arrivals with validated intake values."
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleCloseFormModal}
              disabled={mutating}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <PrimaryButton type="submit" form="stock-income-form" disabled={mutating}>
              {mutating ? 'Saving...' : editingIncome ? 'Save Changes' : 'Create Entry'}
            </PrimaryButton>
          </div>
        }
      >
        <form id="stock-income-form" onSubmit={handleSubmitForm} className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Supplier</label>
            <select
              value={formValues.supplier}
              onChange={(event) => updateFormField('supplier', event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none"
              disabled={mutating || supplierNames.length === 0}
            >
              {supplierNames.length === 0 ? <option value="">No suppliers available</option> : null}
              {supplierNames.map((supplierName) => (
                <option key={supplierName} value={supplierName}>
                  {supplierName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Received Date</label>
            <input
              type="date"
              value={formValues.receivedDate}
              onChange={(event) => updateFormField('receivedDate', event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none"
              disabled={mutating}
              max={TODAY_DATE_INPUT_VALUE}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Status</label>
            <select
              value={formValues.status}
              onChange={(event) => updateFormField('status', event.target.value as StockIncomeStatus)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none"
              disabled={mutating}
            >
              {STOCK_INCOME_STATUSES.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Material Lots</label>
            <input
              type="number"
              min={STOCK_INCOME_MIN_MATERIAL_LOTS}
              step={1}
              value={formValues.materialLots}
              onChange={(event) => updateFormField('materialLots', event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none"
              disabled={mutating}
              required
            />
            <p className="mt-1 text-xs text-slate-500">Minimum {STOCK_INCOME_MIN_MATERIAL_LOTS} lot(s) per stock income entry.</p>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Stock Value (LKR)</label>
            <input
              type="number"
              min={STOCK_INCOME_MIN_VALUE}
              step={1}
              value={formValues.stockValue}
              onChange={(event) => updateFormField('stockValue', event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none"
              disabled={mutating}
              required
            />
            <p className="mt-1 text-xs text-slate-500">Minimum stock value is LKR {STOCK_INCOME_MIN_VALUE.toLocaleString('en-US')}.</p>
          </div>
          {formError ? <div className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-sm text-red-700">{formError}</div> : null}
        </form>
      </Modal>

      <Modal
        open={Boolean(viewingIncome)}
        onClose={() => setViewingIncome(null)}
        title={viewingIncome ? `Stock Income ${viewingIncome.incomeId}` : 'Stock Income Details'}
        description="Review the complete intake record without leaving the table view."
        footer={
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setViewingIncome(null)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Close
            </button>
          </div>
        }
      >
        {viewingIncome ? (
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
              <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Income ID</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{viewingIncome.incomeId}</dd>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
              <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Supplier</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{viewingIncome.supplier}</dd>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
              <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Received Date</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{viewingIncome.receivedDate}</dd>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
              <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Material Lots</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{viewingIncome.materialLots}</dd>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
              <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Stock Value</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{viewingIncome.stockValueLabel}</dd>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
              <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Status</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{viewingIncome.status}</dd>
            </div>
          </dl>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(deletingIncome)}
        onClose={handleCloseDeleteModal}
        title="Delete Stock Income"
        description="Deleting this stock income entry is permanent and cannot be undone."
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleCloseDeleteModal}
              disabled={mutating}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={mutating}
              className="rounded-xl border border-red-200 bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {mutating ? 'Deleting...' : 'Delete Entry'}
            </button>
          </div>
        }
      >
        <p className="text-sm text-slate-600">
          {deletingIncome
            ? `Please confirm deletion of ${deletingIncome.incomeId} from ${deletingIncome.supplier}.`
            : 'Select an entry to delete.'}
        </p>
      </Modal>
    </div>
  );
};
