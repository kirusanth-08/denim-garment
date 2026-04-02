import { Plus } from 'lucide-react';
import { FormEvent, useDeferredValue, useState } from 'react';
import { useAdminAuth } from '../../app/context/AdminAuthContext';
import { SearchField } from '../../components/forms/SearchField';
import { ActionIconGroup, type TableAction } from '../../components/tables/ActionIconGroup';
import { Column, DataTable } from '../../components/tables/DataTable';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { PageHeader } from '../../components/ui/PageHeader';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { Supplier } from '../../features/suppliers/types/supplier';
import { useApiResource } from '../../hooks/useApiResource';
import { apiRequest, withQuery } from '../../lib/api';
import { cn } from '../../lib/cn';

type FeedbackState = {
  tone: 'success' | 'error';
  message: string;
};

type SupplierFormValues = {
  name: string;
  contact: string;
  email: string;
};

const SUPPLIER_NAME_MIN_LENGTH = 2;
const SUPPLIER_NAME_MAX_LENGTH = 80;
const SUPPLIER_CONTACT_MIN_LENGTH = 7;
const SUPPLIER_CONTACT_MAX_LENGTH = 30;
const SUPPLIER_EMAIL_MAX_LENGTH = 254;
const SUPPLIER_EMAIL_LOCAL_MAX_LENGTH = 64;

const SUPPLIER_NAME_PATTERN = /^[A-Za-z0-9&'().,/\- ]+$/;
const SUPPLIER_CONTACT_PATTERN = /^\+?[0-9()\- ]+$/;
const SUPPLIER_EMAIL_PATTERN = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/;

const normalizeSupplierName = (value: string) => value.trim().replace(/\s+/g, ' ');
const normalizeSupplierContact = (value: string) => value.trim().replace(/\s+/g, ' ');
const normalizeSupplierEmail = (value: string) => value.trim().toLowerCase();
const canonicalizeSupplierName = (value: string) => normalizeSupplierName(value).toLowerCase();
const canonicalizeSupplierEmail = (value: string) => normalizeSupplierEmail(value);

const buildSupplierFormValues = (supplier?: Supplier): SupplierFormValues => ({
  name: supplier?.name ?? '',
  contact: supplier?.contact ?? '',
  email: supplier?.email ?? '',
});

const validateSupplierForm = (
  values: SupplierFormValues,
  suppliers: Supplier[],
  editingSupplier: Supplier | null,
): SupplierFormValues | string => {
  const name = normalizeSupplierName(values.name);
  const contact = normalizeSupplierContact(values.contact);
  const email = normalizeSupplierEmail(values.email);

  if (!name) {
    return 'Supplier name is required.';
  }

  if (name.length < SUPPLIER_NAME_MIN_LENGTH || name.length > SUPPLIER_NAME_MAX_LENGTH) {
    return `Supplier name must be between ${SUPPLIER_NAME_MIN_LENGTH} and ${SUPPLIER_NAME_MAX_LENGTH} characters.`;
  }

  if (!SUPPLIER_NAME_PATTERN.test(name)) {
    return 'Supplier name contains unsupported characters.';
  }

  if (!contact) {
    return 'Supplier contact is required.';
  }

  if (contact.length < SUPPLIER_CONTACT_MIN_LENGTH || contact.length > SUPPLIER_CONTACT_MAX_LENGTH) {
    return `Supplier contact must be between ${SUPPLIER_CONTACT_MIN_LENGTH} and ${SUPPLIER_CONTACT_MAX_LENGTH} characters.`;
  }

  if (!SUPPLIER_CONTACT_PATTERN.test(contact)) {
    return 'Supplier contact must contain only digits, spaces, parentheses, hyphens, and an optional leading +.';
  }

  const digitCount = contact.replace(/\D/g, '').length;
  if (digitCount < 7 || digitCount > 15) {
    return 'Supplier contact must include 7 to 15 digits.';
  }

  if (!email) {
    return 'Supplier email is required.';
  }

  if (email.length > SUPPLIER_EMAIL_MAX_LENGTH) {
    return `Supplier email must be no more than ${SUPPLIER_EMAIL_MAX_LENGTH} characters.`;
  }

  const localPart = email.split('@')[0] ?? '';
  if (localPart.length > SUPPLIER_EMAIL_LOCAL_MAX_LENGTH) {
    return `Supplier email local part must be no more than ${SUPPLIER_EMAIL_LOCAL_MAX_LENGTH} characters.`;
  }

  if (!SUPPLIER_EMAIL_PATTERN.test(email)) {
    return 'Supplier email must be a valid address.';
  }

  const domainPart = email.split('@')[1] ?? '';
  const hasInvalidDomainLabel = domainPart
    .split('.')
    .some((label) => label.length === 0 || label.startsWith('-') || label.endsWith('-'));

  if (hasInvalidDomainLabel) {
    return 'Supplier email must contain a valid domain.';
  }

  const duplicateName = suppliers.find(
    (supplier) =>
      supplier.id !== editingSupplier?.id &&
      canonicalizeSupplierName(supplier.name) === canonicalizeSupplierName(name),
  );

  if (duplicateName) {
    return 'Supplier name is already in use.';
  }

  const duplicateEmail = suppliers.find(
    (supplier) =>
      supplier.id !== editingSupplier?.id &&
      canonicalizeSupplierEmail(supplier.email) === canonicalizeSupplierEmail(email),
  );

  if (duplicateEmail) {
    return 'Supplier email is already in use.';
  }

  return { name, contact, email };
};

export const SuppliersPage = () => {
  const { admin } = useAdminAuth();
  const [query, setQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [mutating, setMutating] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<SupplierFormValues>(() => buildSupplierFormValues());
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null);
  const deferredQuery = useDeferredValue(query);
  const canDelete = admin?.role === 'admin';

  const requestPath = withQuery('/suppliers', { query: deferredQuery, refresh: String(refreshKey) });
  const { data, loading, error } = useApiResource<Supplier[]>(requestPath);
  const suppliers = data ?? [];

  const refresh = () => setRefreshKey((currentValue) => currentValue + 1);

  const handleOpenCreateModal = () => {
    setFeedback(null);
    setEditingSupplier(null);
    setFormError(null);
    setFormValues(buildSupplierFormValues());
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (supplier: Supplier) => {
    setFeedback(null);
    setEditingSupplier(supplier);
    setFormError(null);
    setFormValues(buildSupplierFormValues(supplier));
    setIsFormOpen(true);
  };

  const handleCloseFormModal = () => {
    if (mutating) {
      return;
    }

    setIsFormOpen(false);
    setFormError(null);
    setEditingSupplier(null);
  };

  const handleCloseDeleteModal = () => {
    if (mutating) {
      return;
    }

    setDeletingSupplier(null);
  };

  const updateFormField = <K extends keyof SupplierFormValues>(key: K, value: SupplierFormValues[K]) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [key]: value,
    }));
  };

  const handleSubmitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    const activeSupplier = editingSupplier;
    const payload = validateSupplierForm(formValues, suppliers, activeSupplier);
    if (typeof payload === 'string') {
      setFormError(payload);
      return;
    }

    setMutating(true);
    setFormError(null);

    try {
      if (activeSupplier) {
        await apiRequest<Supplier>(`/suppliers/${activeSupplier.id}`, {
          method: 'PATCH',
          body: payload,
        });

        setFeedback({
          tone: 'success',
          message: `${payload.name} updated successfully.`,
        });
      } else {
        await apiRequest<Supplier>('/suppliers', {
          method: 'POST',
          body: payload,
        });

        setFeedback({
          tone: 'success',
          message: `${payload.name} added to suppliers.`,
        });
      }

      setIsFormOpen(false);
      setEditingSupplier(null);
      refresh();
    } catch (reason: unknown) {
      setFormError(reason instanceof Error ? reason.message : 'Failed to save supplier changes.');
    } finally {
      setMutating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingSupplier) {
      return;
    }

    if (!canDelete) {
      setFeedback({
        tone: 'error',
        message: 'Only admin users can delete suppliers.',
      });
      setDeletingSupplier(null);
      return;
    }

    setMutating(true);
    setFeedback(null);

    const supplierToDelete = deletingSupplier;

    try {
      await apiRequest<void>(`/suppliers/${supplierToDelete.id}`, {
        method: 'DELETE',
      });

      setFeedback({
        tone: 'success',
        message: `${supplierToDelete.name} was soft-deleted and removed from active supplier lists.`,
      });

      setDeletingSupplier(null);
      refresh();
    } catch (reason: unknown) {
      setFeedback({
        tone: 'error',
        message: reason instanceof Error ? reason.message : 'Failed to delete supplier.',
      });
    } finally {
      setMutating(false);
    }
  };

  const handleRowAction = (row: Supplier, action: TableAction) => {
    if (action === 'edit') {
      handleOpenEditModal(row);
      return;
    }

    if (!canDelete) {
      setFeedback({
        tone: 'error',
        message: 'Only admin users can delete suppliers.',
      });
      return;
    }

    setFeedback(null);
    setDeletingSupplier(row);
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
          <PrimaryButton type="button" onClick={handleOpenCreateModal} disabled={mutating}>
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
        <Card className="p-6 text-base text-red-600">Could not load suppliers. {error}</Card>
      ) : (
        <DataTable columns={columns} rows={suppliers} emptyMessage="No suppliers match your current search." />
      )}

      <Modal
        open={isFormOpen}
        onClose={handleCloseFormModal}
        title={editingSupplier ? `Edit ${editingSupplier.id}` : 'Add Supplier'}
        description="Maintain supplier records used by stock-income operations."
        widthClassName="max-w-xl"
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
            <PrimaryButton type="submit" form="supplier-form" disabled={mutating}>
              {mutating ? 'Saving...' : editingSupplier ? 'Save Changes' : 'Add Supplier'}
            </PrimaryButton>
          </div>
        }
      >
        <form id="supplier-form" onSubmit={handleSubmitForm} className="grid gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Supplier Name</label>
            <input
              type="text"
              value={formValues.name}
              onChange={(event) => updateFormField('name', event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none"
              disabled={mutating}
              maxLength={SUPPLIER_NAME_MAX_LENGTH}
              autoComplete="organization"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Contact</label>
            <input
              type="text"
              value={formValues.contact}
              onChange={(event) => updateFormField('contact', event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none"
              disabled={mutating}
              maxLength={SUPPLIER_CONTACT_MAX_LENGTH}
              inputMode="tel"
              autoComplete="tel"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Email</label>
            <input
              type="email"
              value={formValues.email}
              onChange={(event) => updateFormField('email', event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none"
              disabled={mutating}
              maxLength={SUPPLIER_EMAIL_MAX_LENGTH}
              autoComplete="email"
              required
            />
          </div>
          {formError ? <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-sm text-red-700">{formError}</div> : null}
        </form>
      </Modal>

      <Modal
        open={Boolean(deletingSupplier)}
        onClose={handleCloseDeleteModal}
        title="Delete Supplier"
        description="This performs a soft delete. The supplier is removed from active lists but preserved for stock income history references."
        widthClassName="max-w-xl"
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
              {mutating ? 'Deleting...' : 'Delete Supplier'}
            </button>
          </div>
        }
      >
        <p className="text-sm text-slate-600">
          {deletingSupplier
            ? `Please confirm soft deletion of ${deletingSupplier.name}. Historical stock income records will still reference this supplier.`
            : 'Select a supplier to delete.'}
        </p>
      </Modal>
    </div>
  );
};
