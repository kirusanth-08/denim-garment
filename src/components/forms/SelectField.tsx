type Option = { label: string; value: string };
type Props = { value: string; onChange: (value: string) => void; options: Option[]; className?: string };

export const SelectField = ({ value, onChange, options, className }: Props) => (
  <select
    value={value}
    onChange={(event) => onChange(event.target.value)}
    className={`w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-3xl text-slate-900 outline-none ${className ?? ''}`}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);
