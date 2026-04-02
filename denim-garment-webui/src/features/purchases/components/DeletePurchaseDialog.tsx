import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Purchase } from '../types/purchase';

type DeletePurchaseDialogProps = {
  open: boolean;
  purchase: Purchase | null;
  deleting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export const DeletePurchaseDialog = ({ open, purchase, deleting, error, onClose, onConfirm }: DeletePurchaseDialogProps) => (
  <Modal
    open={open}
    onClose={deleting ? () => undefined : onClose}
    title="Delete Purchase Request"
    description="This removes the purchase from the demo ledger and immediately updates dashboard and reporting figures."
    footer={
      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="ghost" onClick={onClose} disabled={deleting}>
          Keep Request
        </Button>
        <Button variant="danger" onClick={() => void onConfirm()} disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete Request'}
        </Button>
      </div>
    }
  >
    <div className="space-y-4">
      <p className="text-base text-slate-700">
        {purchase ? (
          <>
            Remove <span className="font-semibold text-slate-950">{purchase.orderId}</span> for{' '}
            <span className="font-semibold text-slate-950">{purchase.supplier}</span>?
          </>
        ) : (
          'Remove this purchase request?'
        )}
      </p>

      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
    </div>
  </Modal>
);

