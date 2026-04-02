import { FormEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../app/context/AdminAuthContext';
import { Card } from '../../components/ui/Card';
import { PrimaryButton } from '../../components/ui/PrimaryButton';

export const LoginPage = () => {
  const { isAuthenticated, isLoading, login } = useAdminAuth();
  const [email, setEmail] = useState('admin@dermas.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login({ email, password });
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'Unable to sign in with those credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-surface px-4 py-10 sm:px-6 lg:px-8">
      <Card className="w-full max-w-xl p-8 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Denim Garment Management</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Admin Sign In</h1>
        <p className="mt-3 text-base text-slate-600">
          Access stock income management, supplier tracking, and analytics from one control panel.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-slate-400"
              autoComplete="email"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-slate-400"
              autoComplete="current-password"
              required
            />
          </label>

          {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          <PrimaryButton type="submit" disabled={submitting || isLoading} className="w-full justify-center">
            {submitting ? 'Signing in...' : 'Sign In To Admin Portal'}
          </PrimaryButton>
        </form>

        <p className="mt-4 text-sm text-slate-500">Demo admin: admin@dermas.com / admin123</p>
        <p className="text-sm text-slate-500">Demo inventory manager: inventory@dermas.com / stock123</p>
      </Card>
    </div>
  );
};
