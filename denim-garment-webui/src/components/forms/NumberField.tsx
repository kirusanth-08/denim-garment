type NumberFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: number;
  step?: number;
};

export const NumberField = ({ label, value, onChange, placeholder, min, step = 1 }: NumberFieldProps) => (
  <label className="block">
    <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
    <input
      type="number"
      value={value}
      min={min}
      step={step}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-mist bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-accent"
    />
  </label>
);

