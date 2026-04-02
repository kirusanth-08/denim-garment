import { Search } from 'lucide-react';

type Props = { value: string; onChange: (value: string) => void; placeholder: string; className?: string };

export const SearchField = ({ value, onChange, placeholder, className }: Props) => (
  <label className={`flex w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-500 ${className ?? ''}`}>
    <Search size={16} />
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
    />
  </label>
);
