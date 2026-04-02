import { FormEvent, useEffect, useState } from 'react';
import { CheckCircle2, CreditCard, UserRound } from 'lucide-react';
import { useAuth } from '../../app/context/AuthContext';
import { SelectField } from '../../components/forms/SelectField';
import { TextField } from '../../components/forms/TextField';
import { Card } from '../../components/ui/Card';
import { CUSTOMER_SHIPPING_METHOD_OPTIONS } from '../../constants/customer';
import { Address, Customer, CustomerProfileUpdatePayload } from '../../features/auth/types/customer';

const EMPTY_ADDRESS: Address = {
  company: '',
  recipient: '',
  line1: '',
  line2: '',
  city: '',
  region: '',
  postalCode: '',
  country: 'Sri Lanka',
  phone: '',
};

type ProfileFormState = CustomerProfileUpdatePayload;

const createProfileState = (customer: Customer): ProfileFormState => ({
  name: customer.name,
  email: customer.email,
  company: customer.company,
  tier: customer.tier,
  role: customer.role,
  phone: customer.phone,
  preferredShippingMethod: customer.preferredShippingMethod,
  marketingOptIn: customer.marketingOptIn,
  defaultPaymentMethodId: customer.paymentMethods.find((paymentMethod) => paymentMethod.isDefault)?.id ?? customer.paymentMethods[0]?.id ?? '',
  addresses: {
    shipping: customer.addresses.shipping,
    billing: customer.addresses.billing,
  },
});

export const ProfilePage = () => {
  const { customer, updateProfile } = useAuth();
  const [form, setForm] = useState<ProfileFormState | null>(customer ? createProfileState(customer) : null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (customer) {
      setForm(createProfileState(customer));
    }
  }, [customer]);

  if (!customer || !form) {
    return null;
  }

  const handleAddressChange = (section: 'shipping' | 'billing', field: keyof Address, value: string) => {
    setForm((current) =>
      current
        ? {
            ...current,
            addresses: {
              ...current.addresses,
              [section]: {
                ...current.addresses[section],
                [field]: value,
              },
            },
          }
        : current,
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccess('');
    setError('');

    try {
      await updateProfile(form);
      setSuccess('Profile updated successfully.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Profile update failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="grid gap-6 bg-[linear-gradient(135deg,#EFF7F3_0%,#FFF8ED_58%,#FFF4E2_100%)] p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Profile</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Keep customer, billing, and shipping details ready for the next order.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              This page acts like the account center for the customer buying flow. Changes here feed directly into future checkout sessions.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[28px] bg-white/85 p-5 shadow-lg shadow-slate-900/5">
              <p className="text-sm text-slate-500">Orders placed</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{customer.stats?.ordersPlaced ?? 0}</p>
            </div>
            <div className="rounded-[28px] bg-white/85 p-5 shadow-lg shadow-slate-900/5">
              <p className="text-sm text-slate-500">Units purchased</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{customer.stats?.totalUnits ?? 0}</p>
            </div>
            <div className="rounded-[28px] bg-forest p-5 text-white shadow-lg shadow-forest/15 sm:col-span-3 lg:col-span-1">
              <p className="text-sm text-white/70">Total spend</p>
              <p className="mt-2 text-3xl font-semibold">{customer.stats?.totalSpendLabel ?? 'Rs. 0'}</p>
            </div>
          </div>
        </div>
      </Card>

      <form className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]" onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <UserRound size={18} className="text-accent" />
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Account details</h2>
                <p className="text-sm text-slate-500">Update the primary customer and company information used across the portal.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <TextField label="Name" value={form.name} onChange={(value) => setForm((current) => (current ? { ...current, name: value } : current))} />
              <TextField label="Email" type="email" value={form.email} onChange={(value) => setForm((current) => (current ? { ...current, email: value } : current))} />
              <TextField label="Company" value={form.company} onChange={(value) => setForm((current) => (current ? { ...current, company: value } : current))} />
              <TextField label="Phone" value={form.phone} onChange={(value) => setForm((current) => (current ? { ...current, phone: value } : current))} />
              <TextField label="Role" value={form.role} onChange={(value) => setForm((current) => (current ? { ...current, role: value } : current))} />
              <TextField label="Tier" value={form.tier} onChange={(value) => setForm((current) => (current ? { ...current, tier: value } : current))} />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-950">Shipping and billing defaults</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Preferred shipping"
                value={form.preferredShippingMethod}
                onChange={(value) => setForm((current) => (current ? { ...current, preferredShippingMethod: value } : current))}
                options={[...CUSTOMER_SHIPPING_METHOD_OPTIONS]}
              />
              <SelectField
                label="Default payment"
                value={form.defaultPaymentMethodId}
                onChange={(value) => setForm((current) => (current ? { ...current, defaultPaymentMethodId: value } : current))}
                options={customer.paymentMethods.map((paymentMethod) => ({
                  label: paymentMethod.label,
                  value: paymentMethod.id,
                }))}
              />
            </div>

            <label className="mt-6 inline-flex items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.marketingOptIn}
                onChange={(event) => setForm((current) => (current ? { ...current, marketingOptIn: event.target.checked } : current))}
                className="h-4 w-4 rounded border-mist text-accent focus:ring-accent"
              />
              Send product launch and replenishment updates to this customer account
            </label>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <div className="space-y-4 rounded-[24px] bg-[#fffdfa] p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-950">Shipping address</h3>
                <TextField label="Company" value={form.addresses.shipping.company} onChange={(value) => handleAddressChange('shipping', 'company', value)} />
                <TextField label="Recipient" value={form.addresses.shipping.recipient} onChange={(value) => handleAddressChange('shipping', 'recipient', value)} />
                <TextField label="Line 1" value={form.addresses.shipping.line1} onChange={(value) => handleAddressChange('shipping', 'line1', value)} />
                <TextField label="Line 2" value={form.addresses.shipping.line2} onChange={(value) => handleAddressChange('shipping', 'line2', value)} />
                <TextField label="City" value={form.addresses.shipping.city} onChange={(value) => handleAddressChange('shipping', 'city', value)} />
                <TextField label="Region" value={form.addresses.shipping.region} onChange={(value) => handleAddressChange('shipping', 'region', value)} />
                <TextField label="Postal code" value={form.addresses.shipping.postalCode} onChange={(value) => handleAddressChange('shipping', 'postalCode', value)} />
                <TextField label="Country" value={form.addresses.shipping.country} onChange={(value) => handleAddressChange('shipping', 'country', value)} />
                <TextField label="Phone" value={form.addresses.shipping.phone} onChange={(value) => handleAddressChange('shipping', 'phone', value)} />
              </div>

              <div className="space-y-4 rounded-[24px] bg-[#fffdfa] p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-950">Billing address</h3>
                <TextField label="Company" value={form.addresses.billing.company} onChange={(value) => handleAddressChange('billing', 'company', value)} />
                <TextField label="Recipient" value={form.addresses.billing.recipient} onChange={(value) => handleAddressChange('billing', 'recipient', value)} />
                <TextField label="Line 1" value={form.addresses.billing.line1} onChange={(value) => handleAddressChange('billing', 'line1', value)} />
                <TextField label="Line 2" value={form.addresses.billing.line2} onChange={(value) => handleAddressChange('billing', 'line2', value)} />
                <TextField label="City" value={form.addresses.billing.city} onChange={(value) => handleAddressChange('billing', 'city', value)} />
                <TextField label="Region" value={form.addresses.billing.region} onChange={(value) => handleAddressChange('billing', 'region', value)} />
                <TextField label="Postal code" value={form.addresses.billing.postalCode} onChange={(value) => handleAddressChange('billing', 'postalCode', value)} />
                <TextField label="Country" value={form.addresses.billing.country} onChange={(value) => handleAddressChange('billing', 'country', value)} />
                <TextField label="Phone" value={form.addresses.billing.phone} onChange={(value) => handleAddressChange('billing', 'phone', value)} />
              </div>
            </div>

            {success ? (
              <p className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <CheckCircle2 size={16} />
                {success}
              </p>
            ) : null}

            {error ? <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Saving profile...' : 'Save profile changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setForm(createProfileState(customer));
                  setSuccess('');
                  setError('');
                }}
                className="inline-flex items-center justify-center rounded-full border border-mist bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#fffdfa]"
              >
                Reset fields
              </button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <CreditCard size={18} className="text-accent" />
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Saved payment methods</h2>
                <p className="text-sm text-slate-500">These cards can be used directly from the payment page.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {customer.paymentMethods.map((paymentMethod) => (
                <div key={paymentMethod.id} className="rounded-[24px] border border-mist bg-[#fffdfa] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{paymentMethod.label}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {paymentMethod.holderName} • expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
                      </p>
                    </div>
                    {paymentMethod.isDefault ? <span className="rounded-full bg-forest px-3 py-1 text-xs font-semibold text-white">Default</span> : null}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-950">Account snapshot</h2>
            <div className="mt-6 space-y-4 rounded-[24px] bg-[#f8f4ec] p-5">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Member since</p>
                <p className="mt-2 text-base font-semibold text-slate-950">{customer.memberSince}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Preferred currency</p>
                <p className="mt-2 text-base font-semibold text-slate-950">{customer.preferredCurrency}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Current company</p>
                <p className="mt-2 text-base font-semibold text-slate-950">{customer.company}</p>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
};
