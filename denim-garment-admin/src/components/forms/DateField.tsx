type Props = { label: string; value: string; onChange: (value: string) => void };

export const DateField = ({ label, value, onChange }: Props) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-medium text-slate-700">{label}</span>
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none"
    />
  </label>
);
