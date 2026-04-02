import { Eye, Pencil, Trash2 } from 'lucide-react';

export type TableAction = 'view' | 'edit' | 'delete';

type ActionIconGroupProps = {
  actions: TableAction[];
  onAction?: (action: TableAction) => void;
  disabledActions?: TableAction[];
};

const actionIcon = {
  view: <Eye size={22} className="text-slate-500" />,
  edit: <Pencil size={22} className="text-slate-500" />,
  delete: <Trash2 size={22} className="text-red-500" />,
};

export const ActionIconGroup = ({ actions, onAction, disabledActions = [] }: ActionIconGroupProps) => (
  <div className="flex items-center justify-end gap-6">
    {actions.map((action) => {
      const disabled = disabledActions.includes(action);

      return (
        <button
          key={action}
          type="button"
          onClick={() => onAction?.(action)}
          disabled={disabled}
          className="transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={action}
        >
          {actionIcon[action]}
        </button>
      );
    })}
  </div>
);
