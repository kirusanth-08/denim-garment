import { BadgeDollarSign, Mail, PhoneCall } from 'lucide-react';
import { useDeferredValue, useMemo, useState } from 'react';
import { usePortalDataContext } from '../../app/context/PortalDataContext';
import { SearchField } from '../../components/forms/SearchField';
import { Card } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { Supplier } from '../../features/suppliers/types/supplier';
import { useApiResource } from '../../hooks/useApiResource';
import { withQuery } from '../../lib/api';

export const SuppliersPage = () => {
  const { version } = usePortalDataContext();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const requestPath = withQuery('/suppliers', { query: deferredQuery });
  const { data, loading, error } = useApiResource<Supplier[]>(requestPath, [version]);

  const suppliers = data ?? [];
  const supplierCards = useMemo(() => suppliers, [suppliers]);

  return (
    <div>
      <PageHeader
        eyebrow="Supplier network"
        title="Browse your active sourcing partners"
        subtitle="Review contact information, availability context, and current purchase totals across the supplier directory."
      />

      <Card className="mb-6 p-5">
        <SearchField value={query} onChange={setQuery} placeholder="Search suppliers by name, ID, or email..." />
        <div className="mt-3 text-sm text-slate-500">
          {loading ? 'Refreshing supplier directory from the demo API...' : `${suppliers.length} suppliers available.`}
        </div>
      </Card>

      {error && !data ? (
        <Card className="p-6 text-base text-red-600">Could not load suppliers. {error}</Card>
      ) : supplierCards.length === 0 ? (
        <Card className="p-6 text-base text-slate-500">No suppliers matched your current search.</Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {supplierCards.map((supplier) => (
            <Card key={supplier.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">{supplier.id}</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{supplier.name}</h2>
                </div>
                <span className="rounded-full bg-[#FBF4EA] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  Active
                </span>
              </div>

              <div className="mt-6 space-y-4 text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-slate-400" />
                  <span>{supplier.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneCall size={16} className="text-slate-400" />
                  <span>{supplier.contact}</span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-mist bg-[#FAF6EF] px-4 py-3">
                  <BadgeDollarSign size={16} className="text-accent" />
                  <div>
                    <p className="font-medium text-slate-950">Purchase Volume</p>
                    <p>{supplier.totalPurchases}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

