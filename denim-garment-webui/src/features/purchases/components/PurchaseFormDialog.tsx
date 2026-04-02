import { FormEvent, useEffect, useMemo, useState } from 'react';
import { DateField } from '../../../components/forms/DateField';
import { NumberField } from '../../../components/forms/NumberField';
import { SelectField } from '../../../components/forms/SelectField';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { PURCHASE_STATUSES, PurchaseStatus } from '../../../constants/status';
import { Purchase, PurchaseInput } from '../types/purchase';

type DraftState = {
  supplier: string;
  date: string;
  items: string;
  totalValue: string;
  status: PurchaseStatus;
};

type PurchaseFormDialogProps = {
  open: boolean;
  mode: 'create' | 'edit';
  purchase: Purchase | null;
  suppliers: string[];
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (payload: PurchaseInput) => Promise<void>;
};

const createDraftState = (purchase: Purchase | null, suppliers: string[]): DraftState => ({
  supplier: purchase?.supplier ?? suppliers[0] ?? '',
  date: purchase?.date ?? new Date().toISOString().slice(0, 10),
  items: purchase ? String(purchase.items) : '1',
  totalValue: purchase ? String(purchase.totalValue) : '50000',
  status: purchase?.status ?? 'Pending',
});

export const PurchaseFormDialog = ({
  open,
  mode,
  purchase,
  suppliers,
  submitting,
  error,
  onClose,
  onSubmit,
}: PurchaseFormDialogProps) => {
  const [draft, setDraft] = useState<DraftState>(() => createDraftState(purchase, suppliers));
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setDraft(createDraftState(purchase, suppliers));
    setLocalError(null);
  }, [open, purchase, suppliers]);

  const supplierOptions = useMemo(
    () => suppliers.map((supplier) => ({ label: supplier, value: supplier })),
    [suppliers],
  );

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!draft.supplier) {
      setLocalError('Choose a supplier before submitting this purchase.');
      return;
    }

    const items = Number(draft.items);
    const totalValue = Number(draft.totalValue);

    if (!Number.isInteger(items) || items <= 0) {
      setLocalError('Items must be a positive whole number.');
      return;
    }

    if (!Number.isFinite(totalValue) || totalValue <= 0) {
      setLocalError('Total value must be greater than zero.');
      return;
    }

    setLocalError(null);

    await onSubmit({
      supplier: draft.supplier,
      date: draft.date,
      items,
      totalValue,
      status: draft.status,
    });
  };

  return (
    <Modal
      open={open}
      onClose={submitting ? () => undefined : onClose}
      title={mode === 'create' ? 'Create Purchase Request' : `Edit ${purchase?.orderId ?? 'Purchase Request'}`}
      description="Use the same request form for new orders and updates. Changes are written directly to the demo API."
      variant="drawer"
      footer={
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" form="purchase-form" disabled={submitting || suppliers.length === 0}>
            {submitting ? 'Saving...' : mode === 'create' ? 'Create Request' : 'Save Changes'}
          </Button>
        </div>
      }
    >
      <form id="purchase-form" className="space-y-5" onSubmit={submitForm}>
        <SelectField
          label="Supplier"
          value={draft.supplier}
          onChange={(value) => setDraft((current) => ({ ...current, supplier: value }))}
          options={supplierOptions.length > 0 ? supplierOptions : [{ label: 'No suppliers available', value: '' }]}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <DateField label="Date" value={draft.date} onChange={(value) => setDraft((current) => ({ ...current, date: value }))} />
          <SelectField
            label="Status"
            value={draft.status}
            onChange={(value) => setDraft((current) => ({ ...current, status: value as PurchaseStatus }))}
            options={PURCHASE_STATUSES.map((status) => ({ label: status, value: status }))}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            label="Items"
            value={draft.items}
            min={1}
            onChange={(value) => setDraft((current) => ({ ...current, items: value }))}
          />
          <NumberField
            label="Total Value (Rs.)"
            value={draft.totalValue}
            min={1}
            step={1000}
            onChange={(value) => setDraft((current) => ({ ...current, totalValue: value }))}
          />
        </div>

        {suppliers.length === 0 ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Suppliers must be available before a purchase request can be submitted.
          </div>
        ) : null}

        {localError || error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{localError ?? error}</div>
        ) : null}
      </form>
    </Modal>
  );
};
