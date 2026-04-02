import { ArrowRight, CreditCard, PackageCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../app/context/AuthContext';
import { Card } from '../../components/ui/Card';
import { LandingResponse } from '../../features/storefront/types/landing';
import { useApiResource } from '../../hooks/useApiResource';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const { data, loading } = useApiResource<LandingResponse>('/storefront/landing');

  const primaryHref = isAuthenticated ? '/products' : '/login';
  const primaryLabel = isAuthenticated ? 'Open customer catalog' : data?.hero.ctaLabel ?? 'Explore the catalog';
  const secondaryHref = isAuthenticated ? '/orders' : '/login';
  const secondaryLabel = isAuthenticated ? 'View order history' : data?.hero.secondaryCtaLabel ?? 'Customer login';

  return (
    <div className="min-h-screen text-ink">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-7rem] top-[-5rem] h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="absolute right-[-8rem] top-24 h-80 w-80 rounded-full bg-forest/15 blur-3xl" />
        <div className="absolute bottom-[-7rem] left-1/3 h-72 w-72 rounded-full bg-accentSoft/30 blur-3xl" />
      </div>

      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-content-center rounded-2xl bg-forest text-lg font-bold text-white shadow-lg shadow-forest/20">DA</div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Dermas Apparel</p>
            <p className="text-xl font-semibold text-slate-950">Customer Commerce Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to={isAuthenticated ? '/products' : '/login'} className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white">
            {isAuthenticated ? 'Continue shopping' : 'Customer login'}
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-12 sm:px-6 lg:px-8">
        <Card className="overflow-hidden">
          <div className="grid gap-8 bg-[linear-gradient(135deg,#FFF8ED_0%,#FFF4E3_42%,#E9F4F1_100%)] p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-accent">{data?.hero.eyebrow ?? 'Dermas Apparel Customer Portal'}</p>
              <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
                {data?.hero.title ?? 'A cleaner way for customers to browse denim products and place repeatable unit-wise orders.'}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                {data?.hero.description ??
                  'Give buyers a polished self-service flow for discovery, checkout, order tracking, and profile management without leaving your denim ecosystem.'}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={primaryHref}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95"
                >
                  {primaryLabel}
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to={secondaryHref}
                  className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
                >
                  {secondaryLabel}
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              {(data?.stats ?? []).map((stat) => (
                <div key={stat.label} className="rounded-[28px] bg-white/90 p-5 shadow-lg shadow-slate-900/5">
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="mt-3 text-4xl font-semibold text-slate-950">{stat.value}</p>
                </div>
              ))}
              {loading && !data ? <div className="rounded-[28px] bg-white/90 p-5 text-sm text-slate-500 shadow-lg shadow-slate-900/5">Loading storefront details...</div> : null}
            </div>
          </div>
        </Card>

        <section id="featured" className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Why This Works</p>
            <h2 className="mt-4 text-3xl font-semibold text-slate-950">Everything a denim customer needs from discovery to payment.</h2>
            <div className="mt-6 grid gap-4">
              {[
                {
                  icon: Sparkles,
                  title: 'Landing and catalog experience',
                  description: 'A public entry point introduces the brand, while authenticated customers move straight into a structured buying workspace.',
                },
                {
                  icon: CreditCard,
                  title: 'Checkout and payment flow',
                  description: 'Saved payment preferences, shipping choices, and address details all come together on a dedicated payment page.',
                },
                {
                  icon: PackageCheck,
                  title: 'History and order tracking',
                  description: 'Each order is retained with itemized totals, delivery details, and a reusable record for future replenishment.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Profile management',
                  description: 'Customers can keep company, delivery, and billing details up to date without leaving the application.',
                },
              ].map(({ icon: Icon, title, description }) => (
                <div key={title} className="rounded-[24px] bg-[#f8f4ec] p-5">
                  <div className="inline-flex rounded-2xl bg-white p-3 text-accent shadow-sm">
                    <Icon size={18} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Featured Products</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {(data?.featuredProducts ?? []).map((product) => (
                <div key={product.id} className="rounded-[28px] border border-mist bg-[#fffdfa] p-5">
                  <div className="h-2 rounded-full" style={{ backgroundColor: product.color }} />
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{product.category}</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-950">{product.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#f8f4ec] px-3 py-1 text-xs font-semibold text-slate-700">{product.badge}</span>
                      <span className="rounded-full bg-[#eff5f3] px-3 py-1 text-xs font-semibold text-forest">{product.fit}</span>
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <p className="text-lg font-semibold text-slate-950">{product.priceLabel}</p>
                      <span className="text-sm text-slate-500">{product.availableUnits} units ready</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          {(data?.highlights ?? []).map((highlight) => (
            <Card key={highlight.title} className="p-6">
              <p className="text-sm font-semibold text-accent">{highlight.title}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{highlight.description}</p>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {(data?.testimonials ?? []).map((testimonial) => (
            <Card key={testimonial.author} className="p-6">
              <p className="text-base leading-7 text-slate-700">"{testimonial.quote}"</p>
              <div className="mt-6">
                <p className="text-sm font-semibold text-slate-950">{testimonial.author}</p>
                <p className="text-sm text-slate-500">{testimonial.company}</p>
              </div>
            </Card>
          ))}
        </section>

        <Card className="overflow-hidden">
          <div className="grid gap-6 bg-[linear-gradient(135deg,#214B4C_0%,#295556_60%,#B86A28_100%)] p-8 text-white lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Ready To Order</p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Move from landing page to paid order without breaking the customer flow.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                The catalog, checkout, order history, and profile pages are all connected now, so customers can browse, buy, review, and update their details in one place.
              </p>
            </div>
            <Link
              to={primaryHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-forest transition hover:bg-white/90"
            >
              {primaryLabel}
              <ArrowRight size={16} />
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
};
