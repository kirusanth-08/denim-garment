type DateFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
};

export const DateField = ({ label, value, onChange, min, max }: DateFieldProps) => (
  <label className="block">
    <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
    <input
      type="date"
      value={value}
      min={min}
      max={max}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-2xl border border-mist bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-accent"
    />
  </label>
);

