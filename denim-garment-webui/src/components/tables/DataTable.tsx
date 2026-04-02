import { Key, ReactNode } from 'react';
import { Card } from '../ui/Card';

export type Column<T> = {
  key: string;
  header: string;
  align?: 'left' | 'right';
  render: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  emptyMessage?: string;
  getRowKey?: (row: T, index: number) => Key;
};

export const DataTable = <T,>({ columns, rows, emptyMessage = 'No records found.', getRowKey }: DataTableProps<T>) => (
  <Card className="overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-[#FAF6EF] text-left text-xs uppercase tracking-[0.18em] text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={`px-5 py-4 font-medium ${column.align === 'right' ? 'text-right' : 'text-left'}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr className="border-t border-mist">
              <td colSpan={columns.length} className="px-5 py-8 text-center text-sm text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={getRowKey ? getRowKey(row, index) : index} className="border-t border-mist text-base text-slate-800">
                {columns.map((column) => (
                  <td key={column.key} className={`px-5 py-4 ${column.align === 'right' ? 'text-right' : 'text-left'}`}>
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

