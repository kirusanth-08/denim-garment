import { FormEvent, useEffect, useState } from 'react';
import { CreditCard, MapPin, PackageCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/context/AuthContext';
import { useCart } from '../../app/context/CartContext';
import { useStorefrontData } from '../../app/context/StorefrontDataContext';
import { SelectField } from '../../components/forms/SelectField';
import { TextField } from '../../components/forms/TextField';
import { Card } from '../../components/ui/Card';
import { CUSTOMER_SHIPPING_METHOD_OPTIONS, PAYMENT_BRAND_OPTIONS } from '../../constants/customer';
import { Address, Customer } from '../../features/auth/types/customer';
import { CustomerOrder } from '../../features/orders/types/order';
import { ProductsResponse } from '../../features/products/types/product';
import { useApiResource } from '../../hooks/useApiResource';
import { apiRequest } from '../../lib/api';
import { formatCurrency } from '../../lib/format';

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

const calculateShippingFee = (shippingMethod: string) => {
  if (shippingMethod === 'Priority Dispatch') {
    return 1800;
  }

  if (shippingMethod === 'Store Pickup') {
    return 0;
  }

  return 1200;
};

const getDefaultPaymentMethodId = (customer: Customer) => customer.paymentMethods.find((paymentMethod) => paymentMethod.isDefault)?.id ?? customer.paymentMethods[0]?.id ?? '';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { customer, refreshCustomer } = useAuth();
  const { items, totalAmount, clearCart, syncProducts } = useCart();
  const { refreshKey, refreshStorefrontData } = useStorefrontData();
  const [shippingMethod, setShippingMethod] = useState(customer?.preferredShippingMethod ?? CUSTOMER_SHIPPING_METHOD_OPTIONS[0].value);
  const [shippingAddress, setShippingAddress] = useState<Address>(customer?.addresses.shipping ?? EMPTY_ADDRESS);
  const [billingAddress, setBillingAddress] = useState<Address>(customer?.addresses.billing ?? EMPTY_ADDRESS);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [paymentMode, setPaymentMode] = useState<'saved' | 'manual'>('saved');
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(customer ? getDefaultPaymentMethodId(customer) : '');
  const [cardBrand, setCardBrand] = useState<string>(PAYMENT_BRAND_OPTIONS[0].value);
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: catalogData } = useApiResource<ProductsResponse>('/products', [refreshKey]);

  useEffect(() => {
    if (catalogData?.products) {
      syncProducts(catalogData.products);
    }
  }, [catalogData]);

  useEffect(() => {
    if (!customer) {
      return;
    }

    setShippingMethod(customer.preferredShippingMethod);
    setShippingAddress(customer.addresses.shipping);
    setBillingAddress(customer.addresses.billing);
    setSelectedPaymentMethodId(getDefaultPaymentMethodId(customer));
    setPaymentMode(customer.paymentMethods.length > 0 ? 'saved' : 'manual');
  }, [customer]);

  const shippingFee = calculateShippingFee(shippingMethod);
  const taxAmount = Math.round(totalAmount * 0.08);
  const grandTotal = totalAmount + shippingFee + taxAmount;

  const handleAddressChange = (section: 'shipping' | 'billing', field: keyof Address, value: string) => {
    if (section === 'shipping') {
      setShippingAddress((current) => ({ ...current, [field]: value }));
      return;
    }

    setBillingAddress((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (items.length === 0) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await apiRequest<CustomerOrder>('/customer/orders', {
        method: 'POST',
        body: {
          items: items.map((item) => ({
            productId: item.productId,
            units: item.units,
          })),
          shippingMethod,
          shippingAddress,
          billingAddress: billingSameAsShipping ? shippingAddress : billingAddress,
          notes,
          ...(paymentMode === 'saved'
            ? {
                paymentMethodId: selectedPaymentMethodId,
              }
            : {
                paymentCard: {
                  brand: cardBrand,
                  holderName: cardHolderName,
                  cardNumber,
                  expiryMonth,
                  expiryYear,
                },
              }),
        },
      });

      clearCart();
      refreshStorefrontData();
      await refreshCustomer();
      navigate(`/orders/${response.id}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Your order could not be submitted.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!customer) {
    return null;
  }

  if (items.length === 0) {
    return (
      <Card className="p-10 text-center">
        <div className="mx-auto flex max-w-lg flex-col items-center">
          <PackageCheck size={28} className="text-accent" />
          <h1 className="mt-5 text-3xl font-semibold text-slate-950">Your cart is empty</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Add products from the catalog before moving to payment and order confirmation.</p>
          <Link to="/products" className="mt-6 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95">
            Return to products
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="grid gap-6 bg-[linear-gradient(135deg,#FFF8ED_0%,#FFF5E2_46%,#EDF7F3_100%)] p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Payment Page</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Review delivery, payment, and line items before you place the order.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Checkout uses your saved customer profile, but you can still adjust shipping, billing, notes, and payment method before confirming.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[28px] bg-white/85 p-5 shadow-lg shadow-slate-900/5">
              <p className="text-sm text-slate-500">Items in cart</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{items.length}</p>
            </div>
            <div className="rounded-[28px] bg-white/85 p-5 shadow-lg shadow-slate-900/5">
              <p className="text-sm text-slate-500">Units selected</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{items.reduce((sum, item) => sum + item.units, 0)}</p>
            </div>
            <div className="rounded-[28px] bg-forest p-5 text-white shadow-lg shadow-forest/15 sm:col-span-3 lg:col-span-1">
              <p className="text-sm text-white/70">Estimated total</p>
              <p className="mt-2 text-3xl font-semibold">{formatCurrency(grandTotal)}</p>
            </div>
          </div>
        </div>
      </Card>

      <form className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]" onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-accent" />
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Shipping details</h2>
                <p className="text-sm text-slate-500">These details will appear on the customer order.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <TextField label="Company" value={shippingAddress.company} onChange={(value) => handleAddressChange('shipping', 'company', value)} />
              <TextField label="Recipient" value={shippingAddress.recipient} onChange={(value) => handleAddressChange('shipping', 'recipient', value)} />
              <TextField label="Line 1" value={shippingAddress.line1} onChange={(value) => handleAddressChange('shipping', 'line1', value)} />
              <TextField label="Line 2" value={shippingAddress.line2} onChange={(value) => handleAddressChange('shipping', 'line2', value)} />
              <TextField label="City" value={shippingAddress.city} onChange={(value) => handleAddressChange('shipping', 'city', value)} />
              <TextField label="Region" value={shippingAddress.region} onChange={(value) => handleAddressChange('shipping', 'region', value)} />
              <TextField label="Postal code" value={shippingAddress.postalCode} onChange={(value) => handleAddressChange('shipping', 'postalCode', value)} />
              <TextField label="Country" value={shippingAddress.country} onChange={(value) => handleAddressChange('shipping', 'country', value)} />
              <TextField label="Phone" value={shippingAddress.phone} onChange={(value) => handleAddressChange('shipping', 'phone', value)} />
              <SelectField label="Shipping method" value={shippingMethod} onChange={setShippingMethod} options={[...CUSTOMER_SHIPPING_METHOD_OPTIONS]} />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <CreditCard size={18} className="text-accent" />
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Billing and payment</h2>
                <p className="text-sm text-slate-500">Use a saved payment method or enter a one-time demo card.</p>
              </div>
            </div>

            <label className="mt-6 inline-flex items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={billingSameAsShipping}
                onChange={(event) => setBillingSameAsShipping(event.target.checked)}
                className="h-4 w-4 rounded border-mist text-accent focus:ring-accent"
              />
              Billing address is the same as shipping
            </label>

            {!billingSameAsShipping ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <TextField label="Billing company" value={billingAddress.company} onChange={(value) => handleAddressChange('billing', 'company', value)} />
                <TextField label="Billing recipient" value={billingAddress.recipient} onChange={(value) => handleAddressChange('billing', 'recipient', value)} />
                <TextField label="Line 1" value={billingAddress.line1} onChange={(value) => handleAddressChange('billing', 'line1', value)} />
                <TextField label="Line 2" value={billingAddress.line2} onChange={(value) => handleAddressChange('billing', 'line2', value)} />
                <TextField label="City" value={billingAddress.city} onChange={(value) => handleAddressChange('billing', 'city', value)} />
                <TextField label="Region" value={billingAddress.region} onChange={(value) => handleAddressChange('billing', 'region', value)} />
                <TextField label="Postal code" value={billingAddress.postalCode} onChange={(value) => handleAddressChange('billing', 'postalCode', value)} />
                <TextField label="Country" value={billingAddress.country} onChange={(value) => handleAddressChange('billing', 'country', value)} />
                <TextField label="Phone" value={billingAddress.phone} onChange={(value) => handleAddressChange('billing', 'phone', value)} />
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setPaymentMode('saved')}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${paymentMode === 'saved' ? 'bg-forest text-white' : 'border border-mist bg-white text-slate-700'}`}
              >
                Saved payment
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode('manual')}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${paymentMode === 'manual' ? 'bg-forest text-white' : 'border border-mist bg-white text-slate-700'}`}
              >
                One-time card
              </button>
            </div>

            {paymentMode === 'saved' ? (
              <div className="mt-6 grid gap-3">
                {customer.paymentMethods.map((paymentMethod) => (
                  <label key={paymentMethod.id} className="flex cursor-pointer items-start gap-3 rounded-[24px] border border-mist bg-[#fffdfa] px-4 py-4">
                    <input
                      type="radio"
                      name="savedPaymentMethod"
                      checked={selectedPaymentMethodId === paymentMethod.id}
                      onChange={() => setSelectedPaymentMethodId(paymentMethod.id)}
                      className="mt-1 h-4 w-4 border-mist text-accent focus:ring-accent"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{paymentMethod.label}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {paymentMethod.holderName} • expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <SelectField label="Card brand" value={cardBrand} onChange={setCardBrand} options={[...PAYMENT_BRAND_OPTIONS]} />
                <TextField label="Card holder" value={cardHolderName} onChange={setCardHolderName} placeholder="Name on card" />
                <TextField label="Card number" value={cardNumber} onChange={setCardNumber} placeholder="4242 4242 4242 4242" />
                <TextField label="Expiry month" value={expiryMonth} onChange={setExpiryMonth} placeholder="08" />
                <TextField label="Expiry year" value={expiryYear} onChange={setExpiryYear} placeholder="2028" />
              </div>
            )}

            <label className="mt-6 block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Order notes</span>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={4}
                placeholder="Optional notes for receiving, display launch timing, or billing context"
                className="w-full rounded-[24px] border border-mist bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-accent"
              />
            </label>

            {error ? <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-950">Order summary</h2>
            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="rounded-[24px] bg-[#fffdfa] px-4 py-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{item.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.sku} • {item.units} units
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-950">{formatCurrency(item.pricePerUnit * item.units)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 rounded-[24px] bg-[#f8f4ec] p-5">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Shipping</span>
                <span>{formatCurrency(shippingFee)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Tax</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/70 pt-3 text-base font-semibold text-slate-950">
                <span>Total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Placing order...' : 'Pay and place order'}
              </button>
              <Link to="/products" className="inline-flex items-center justify-center rounded-full border border-mist bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#fffdfa]">
                Back to catalog
              </Link>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-950">Using saved customer data</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Your checkout is prefilled from the customer profile. If company contacts, billing details, or preferred shipping settings need a permanent update, edit them from the profile page before your next order.
            </p>
            <Link to="/profile" className="mt-5 inline-flex rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-forest/90">
              Update profile
            </Link>
          </Card>
        </div>
      </form>
    </div>
  );
};
