import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { LockKeyhole, Shirt, Store } from 'lucide-react';
import { useAuth } from '../../app/context/AuthContext';
import { TextField } from '../../components/forms/TextField';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const DEMO_ACCOUNTS = [
  {
    name: 'Wholesale buyer',
    email: 'customer@dermas.com',
    password: 'denim123',
  },
  {
    name: 'Retail partner',
    email: 'buyer@dermas.com',
    password: 'demo123',
  },
] as const;

export const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState<string>(DEMO_ACCOUNTS[0].email);
  const [password, setPassword] = useState<string>(DEMO_ACCOUNTS[0].password);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/products" replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login({ email, password });
      navigate('/products', { replace: true });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden">
          <div className="h-full bg-[linear-gradient(135deg,#214B4C_0%,#2A5C5D_48%,#B86A28_100%)] p-8 text-white sm:p-12">
            <Link to="/" className="inline-flex rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10">
              Back to landing page
            </Link>
            <div className="max-w-xl">
              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.36em] text-white/70">Customer Access</p>
              <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">Buy denim products unit by unit from one customer portal.</h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/80 sm:text-lg">
                Browse ready-to-order products, build a unit-wise purchase cart, and keep every customer order in one clean view.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[28px] bg-white/10 p-5 backdrop-blur-sm">
                <Store size={22} />
                <h2 className="mt-4 text-lg font-semibold">Product catalog</h2>
                <p className="mt-2 text-sm text-white/75">Filter by category, inspect stock, and compare unit pricing.</p>
              </div>
              <div className="rounded-[28px] bg-white/10 p-5 backdrop-blur-sm">
                <Shirt size={22} />
                <h2 className="mt-4 text-lg font-semibold">Unit-wise buying</h2>
                <p className="mt-2 text-sm text-white/75">Set exact quantities and place customer orders without calling sales.</p>
              </div>
              <div className="rounded-[28px] bg-white/10 p-5 backdrop-blur-sm">
                <LockKeyhole size={22} />
                <h2 className="mt-4 text-lg font-semibold">Customer login</h2>
                <p className="mt-2 text-sm text-white/75">Every order is tied to the signed-in customer account for demo tracking.</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Sign In</p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-950">Customer portal login</h2>
          <p className="mt-3 text-base text-slate-600">Use one of the demo customer accounts below to access the storefront.</p>

          <div className="mt-6 grid gap-3">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => {
                  setEmail(account.email);
                  setPassword(account.password);
                  setError(null);
                }}
                className="rounded-[24px] border border-mist bg-[#f8f4ec] px-4 py-4 text-left transition hover:bg-white"
              >
                <p className="text-sm font-semibold text-slate-950">{account.name}</p>
                <p className="mt-1 text-sm text-slate-600">{account.email}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400">{account.password}</p>
              </button>
            ))}
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <TextField
              label="Customer email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="customer@dermas.com"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Enter password"
            />

            {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

            <Button type="submit" className="w-full justify-center" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Login as customer'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
