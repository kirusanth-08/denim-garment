import { Search } from 'lucide-react';

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
};

export const SearchField = ({ value, onChange, placeholder, className }: SearchFieldProps) => (
  <label className={`flex w-full items-center gap-3 rounded-full border border-mist bg-white px-4 py-3 text-slate-500 ${className ?? ''}`}>
    <Search size={18} />
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full bg-transparent text-base text-slate-700 outline-none placeholder:text-slate-400"
    />
  </label>
);

