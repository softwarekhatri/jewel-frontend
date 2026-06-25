import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

interface AddressForm {
  name: string; phone: string; address: string;
  city: string; state: string; pincode: string;
}
interface Errors { [k: string]: string; }

const STEPS = ['Shipping', 'Review', 'Payment'];
const INDIAN_STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh'];

const validate = (form: AddressForm): Errors => {
  const errs: Errors = {};
  if (!form.name.trim()) errs.name = 'Full name is required';
  if (!/^\d{10}$/.test(form.phone)) errs.phone = 'Enter a valid 10-digit phone number';
  if (!form.address.trim()) errs.address = 'Address is required';
  if (!form.city.trim()) errs.city = 'City is required';
  if (!form.state) errs.state = 'State is required';
  if (!/^\d{6}$/.test(form.pincode)) errs.pincode = 'Enter a valid 6-digit pincode';
  return errs;
};

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState<AddressForm>({ name:'', phone:'', address:'', city:'', state:'', pincode:'' });
  const [errors, setErrors] = useState<Errors>({});

  const shippingCost = totalPrice >= 999 ? 0 : 99;
  const finalTotal = totalPrice + shippingCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep(1);
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const res = await ordersAPI.createOrder({
        items: items.map(i => ({ productId: i.product._id, quantity: i.quantity })),
        shippingAddress: { name: form.name, phone: form.phone, address: form.address, city: form.city, state: form.state, pincode: form.pincode },
      });
      const orderId = res.data.order?._id || res.data._id;
      clearCart();
      navigate(`/order-confirmation/${orderId}`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to place order. Please try again.';
      toast.error(msg);
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="page checkout-page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <Link to="/products" className="btn btn-primary">Shop Now</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page checkout-page">
      <div className="container">
        <h1 className="checkout-page__title">Checkout</h1>

        {/* Progress */}
        <div className="checkout-steps">
          {STEPS.map((s, i) => (
            <div key={s} className={`checkout-step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="checkout-step__num">{i < step ? '✓' : i + 1}</div>
              <span className="checkout-step__label">{s}</span>
              {i < STEPS.length - 1 && <div className="checkout-step__line" />}
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-main">
            {/* Step 1: Shipping */}
            {step === 0 && (
              <div className="checkout-card slide-up">
                <h2 className="checkout-card__title">Shipping Address</h2>
                <form onSubmit={handleStep1} className="address-form">
                  <div className="address-form__row">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input name="name" value={form.name} onChange={handleChange}
                        className={`form-input ${errors.name ? 'error' : ''}`} placeholder="Priya Sharma" />
                      {errors.name && <span className="form-error">{errors.name}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input name="phone" value={form.phone} onChange={handleChange}
                        className={`form-input ${errors.phone ? 'error' : ''}`} placeholder="9876543210" maxLength={10} />
                      {errors.phone && <span className="form-error">{errors.phone}</span>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Address *</label>
                    <input name="address" value={form.address} onChange={handleChange}
                      className={`form-input ${errors.address ? 'error' : ''}`}
                      placeholder="House No., Street, Colony" />
                    {errors.address && <span className="form-error">{errors.address}</span>}
                  </div>
                  <div className="address-form__row">
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <input name="city" value={form.city} onChange={handleChange}
                        className={`form-input ${errors.city ? 'error' : ''}`} placeholder="Mumbai" />
                      {errors.city && <span className="form-error">{errors.city}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Pincode *</label>
                      <input name="pincode" value={form.pincode} onChange={handleChange}
                        className={`form-input ${errors.pincode ? 'error' : ''}`} placeholder="400001" maxLength={6} />
                      {errors.pincode && <span className="form-error">{errors.pincode}</span>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <select name="state" value={form.state} onChange={handleChange}
                      className={`form-input-boxed ${errors.state ? 'error' : ''}`}>
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.state && <span className="form-error">{errors.state}</span>}
                  </div>
                  <button type="submit" className="btn btn-primary checkout-next">
                    Continue to Review →
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Review */}
            {step === 1 && (
              <div className="checkout-card slide-up">
                <h2 className="checkout-card__title">Order Review</h2>
                <div className="review-address">
                  <h4>Delivering to:</h4>
                  <p>{form.name} &nbsp;|&nbsp; {form.phone}</p>
                  <p>{form.address}, {form.city}, {form.state} - {form.pincode}</p>
                  <button className="review-edit-btn" onClick={() => setStep(0)}>Edit Address</button>
                </div>
                <div className="review-items">
                  {items.map(({ product, quantity }) => (
                    <div key={product._id} className="review-item">
                      <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&q=80'}
                        alt={product.name}
                        onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&q=80'; }}
                      />
                      <div className="review-item__info">
                        <div className="review-item__name">{product.name}</div>
                        <div className="review-item__meta">Qty: {quantity} × ₹{product.price.toLocaleString('en-IN')}</div>
                      </div>
                      <div className="review-item__total">₹{(product.price * quantity).toLocaleString('en-IN')}</div>
                    </div>
                  ))}
                </div>
                <div className="checkout-nav">
                  <button className="btn btn-secondary" onClick={() => setStep(0)}>← Back</button>
                  <button className="btn btn-primary" onClick={() => setStep(2)}>Continue to Payment →</button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 2 && (
              <div className="checkout-card slide-up">
                <h2 className="checkout-card__title">Payment Method</h2>
                <div className="payment-option active">
                  <div className="payment-option__radio" />
                  <div className="payment-option__content">
                    <div className="payment-option__title">
                      <span className="payment-lock">🔒</span> Cash on Delivery (COD)
                    </div>
                    <p className="payment-option__desc">
                      Pay with cash when your order is delivered to your doorstep. No advance payment required.
                    </p>
                  </div>
                </div>
                <div className="checkout-nav">
                  <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
                  <button
                    className="btn btn-primary"
                    onClick={handlePlaceOrder}
                    disabled={placing}
                  >
                    {placing ? 'Placing Order...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="checkout-summary">
            <h3 className="checkout-summary__title">Order Summary</h3>
            <div className="checkout-summary__items">
              {items.map(({ product, quantity }) => (
                <div key={product._id} className="checkout-summary__item">
                  <span className="checkout-summary__item-name">{product.name} <em>×{quantity}</em></span>
                  <span>₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="checkout-summary__divider" />
            <div className="checkout-summary__row">
              <span>Subtotal</span><span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="checkout-summary__row">
              <span>Shipping</span>
              <span className={shippingCost === 0 ? 'summary-free' : ''}>
                {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
              </span>
            </div>
            <div className="checkout-summary__total">
              <span>Total</span><span>₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
