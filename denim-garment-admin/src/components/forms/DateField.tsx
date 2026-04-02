type Props = { label: string; value: string; onChange: (value: string) => void };

export const DateField = ({ label, value, onChange }: Props) => (
  <label className="block">
    <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none"
    />
  </label>
);
