// ============================================================
// CheckoutPage
// ============================================================
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiTruck, FiCreditCard } from 'react-icons/fi';
import './CheckoutPage.css';

const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

const INITIAL_FORM = {
  fullName: '', address: '', city: '', state: '',
  zipCode: '', country: 'India', phone: '',
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const [form,           setForm]           = useState(INITIAL_FORM);
  const [errors,         setErrors]         = useState({});
  const [paymentMethod,  setPaymentMethod]  = useState('COD');
  const [placing,        setPlacing]        = useState(false);
  const [step,           setStep]           = useState(1); // 1=shipping, 2=confirm

  const items     = cart?.items || [];
  const subtotal  = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping  = subtotal > 999 ? 0 : 99;
  const tax       = Math.round(subtotal * 0.18);
  const total     = subtotal + shipping + tax;

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())  e.fullName = 'Full name is required';
    if (!form.address.trim())   e.address  = 'Address is required';
    if (!form.city.trim())      e.city     = 'City is required';
    if (!form.state.trim())     e.state    = 'State is required';
    if (!form.zipCode.trim())   e.zipCode  = 'ZIP/PIN code is required';
    if (!form.phone.trim())     e.phone    = 'Phone number is required';
    if (!/^\d{6}$/.test(form.zipCode)) e.zipCode = 'Enter a valid 6-digit PIN code';
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit mobile number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }));
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (validate()) setStep(2);
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) { toast.error('Your cart is empty!'); return; }
    setPlacing(true);
    try {
      const res = await ordersAPI.create({ shippingAddress: form, paymentMethod });
      await clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${res.data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem', textAlign: 'center' }}>
        <div className="empty-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
        <h2>Your cart is empty</h2>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="page-header">
        <div className="container">
          <h1>Checkout</h1>
          <p>Complete your purchase securely</p>
        </div>
      </div>

      <div className="container checkout-layout">
        {/* ── Left: Steps ──────────────────────────────────── */}
        <div className="checkout-form-col">
          {/* Step Indicator */}
          <div className="step-indicator">
            <div className={`step-dot${step >= 1 ? ' done' : ''}`}>
              {step > 1 ? <FiCheckCircle /> : '1'}
            </div>
            <div className={`step-line${step > 1 ? ' done' : ''}`} />
            <div className={`step-dot${step >= 2 ? ' done' : ''}`}>2</div>
          </div>

          {/* Step 1 – Shipping */}
          {step === 1 && (
            <form onSubmit={handleContinue} className="checkout-form-card">
              <h3><FiTruck /> Shipping Details</h3>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input className="form-control" name="fullName" value={form.fullName} onChange={handleChange} placeholder="John Doe" />
                  {errors.fullName && <span className="form-error">{errors.fullName}</span>}
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input className="form-control" name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" maxLength={10} />
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Street Address *</label>
                <input className="form-control" name="address" value={form.address} onChange={handleChange} placeholder="123, MG Road, Apartment 4B" />
                {errors.address && <span className="form-error">{errors.address}</span>}
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label>City *</label>
                  <input className="form-control" name="city" value={form.city} onChange={handleChange} placeholder="Bangalore" />
                  {errors.city && <span className="form-error">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input className="form-control" name="state" value={form.state} onChange={handleChange} placeholder="Karnataka" />
                  {errors.state && <span className="form-error">{errors.state}</span>}
                </div>
                <div className="form-group">
                  <label>PIN Code *</label>
                  <input className="form-control" name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="560001" maxLength={6} />
                  {errors.zipCode && <span className="form-error">{errors.zipCode}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Country</label>
                <select className="form-control" name="country" value={form.country} onChange={handleChange}>
                  <option>India</option>
                  <option>USA</option>
                  <option>UK</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-full btn-lg">
                Continue to Payment →
              </button>
            </form>
          )}

          {/* Step 2 – Payment & Confirm */}
          {step === 2 && (
            <div className="checkout-form-card">
              <h3><FiCreditCard /> Payment Method</h3>

              <div className="payment-options">
                {[
                  { value: 'COD', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
                  { value: 'UPI', label: 'UPI Payment',       icon: '📱', desc: 'Google Pay, PhonePe, Paytm' },
                  { value: 'Card',label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
                ].map((opt) => (
                  <label key={opt.value} className={`payment-option${paymentMethod === opt.value ? ' selected' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={paymentMethod === opt.value}
                      onChange={() => setPaymentMethod(opt.value)}
                    />
                    <span className="pay-icon">{opt.icon}</span>
                    <div>
                      <strong>{opt.label}</strong>
                      <span>{opt.desc}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Shipping Summary */}
              <div className="ship-summary">
                <h4>Delivering to:</h4>
                <p>{form.fullName} · {form.phone}</p>
                <p>{form.address}, {form.city}, {form.state} – {form.zipCode}</p>
                <button className="edit-address" onClick={() => setStep(1)}>Edit Address</button>
              </div>

              <div className="action-row">
                <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handlePlaceOrder}
                  disabled={placing}
                >
                  {placing ? 'Placing Order...' : `Place Order · ${formatPrice(total)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Summary ────────────────────────────────── */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="checkout-items">
            {items.map((item) => (
              <div key={item._id} className="checkout-item">
                <div className="co-item-img-wrap">
                  <img src={item.product?.image} alt={item.product?.title} onError={(e) => { e.target.src = 'https://placehold.co/60x60?text=?'; }} />
                  <span className="co-qty-badge">{item.quantity}</span>
                </div>
                <span className="co-item-title">{item.product?.title}</span>
                <span className="co-item-price">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <hr className="divider" />
          <div className="co-summary-rows">
            <div className="co-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="co-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
            <div className="co-row"><span>GST (18%)</span><span>{formatPrice(tax)}</span></div>
          </div>
          <hr className="divider" />
          <div className="co-total-row"><span>Total</span><span>{formatPrice(total)}</span></div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
