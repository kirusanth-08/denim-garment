import { Eye, Pencil, Trash2 } from 'lucide-react';

type ActionIconGroupProps = { actions: Array<'view' | 'edit' | 'delete'> };

const actionIcon = {
  view: <Eye size={22} className="text-slate-500" />,
  edit: <Pencil size={22} className="text-slate-500" />,
  delete: <Trash2 size={22} className="text-red-500" />,
};

export const ActionIconGroup = ({ actions }: ActionIconGroupProps) => (
  <div className="flex items-center justify-end gap-6">
    {actions.map((action) => (
      <button key={action} className="transition hover:opacity-80" aria-label={action}>
        {actionIcon[action]}
      </button>
    ))}
  </div>
);
