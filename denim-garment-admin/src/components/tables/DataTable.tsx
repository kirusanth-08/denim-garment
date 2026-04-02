import { ReactNode } from 'react';
import { Card } from '../ui/Card';

export type Column<T> = { key: string; header: string; align?: 'left' | 'right'; render: (row: T) => ReactNode };

type DataTableProps<T> = { columns: Column<T>[]; rows: T[]; emptyMessage?: string };

export const DataTable = <T,>({ columns, rows, emptyMessage = 'No records found.' }: DataTableProps<T>) => (
  <Card className="overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.18em] text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={`px-4 py-3 font-medium ${column.align === 'right' ? 'text-right' : 'text-left'}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr className="border-t border-slate-200">
              <td colSpan={columns.length} className="px-4 py-6 text-center text-sm text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={index} className="border-t border-slate-200 text-sm text-slate-800">
                {columns.map((column) => (
                  <td key={column.key} className={`px-4 py-3 ${column.align === 'right' ? 'text-right' : 'text-left'}`}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </Card>
);
