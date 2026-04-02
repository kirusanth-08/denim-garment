import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  variant?: 'dialog' | 'drawer';
};

export const Modal = ({ open, onClose, title, description, children, footer, variant = 'dialog' }: ModalProps) => {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-950/40 p-4 backdrop-blur-sm" onMouseDown={onClose} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
        className={cn(
          'relative flex w-full overflow-hidden rounded-[32px] border border-white/70 bg-card shadow-panel',
          variant === 'drawer'
            ? 'ml-auto max-w-2xl flex-col'
            : 'm-auto max-w-xl flex-col',
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-mist px-6 py-5 sm:px-8">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
            {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-mist bg-white/80 p-2 text-slate-500 transition hover:text-slate-900"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-6 sm:px-8">{children}</div>
        {footer ? <div className="border-t border-mist px-6 py-4 sm:px-8">{footer}</div> : null}
      </div>
    </div>
  );
};

