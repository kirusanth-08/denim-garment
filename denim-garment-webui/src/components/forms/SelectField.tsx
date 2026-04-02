type Option = { label: string; value: string };

type SelectFieldProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
};

export const SelectField = ({ label, value, onChange, options, className }: SelectFieldProps) => (
  <label className="block">
    {label ? <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span> : null}
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`w-full rounded-2xl border border-mist bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-accent ${className ?? ''}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

