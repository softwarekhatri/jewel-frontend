import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { Order } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import './OrderConfirmationPage.css';

const OrderConfirmationPage = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    ordersAPI.getOrder(id)
      .then(res => setOrder(res.data.order || res.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page"><LoadingSpinner /></div>;

  return (
    <div className="page order-confirm-page">
      <div className="container">
        <div className="order-confirm">
          {/* Checkmark */}
          <div className="order-confirm__check">
            <div className="order-confirm__check-circle">
              <svg viewBox="0 0 52 52" className="checkmark-svg">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                <path className="checkmark-path" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
          </div>

          <h1 className="order-confirm__title">Order Placed Successfully!</h1>
          <p className="order-confirm__subtitle">
            Thank you for your purchase. We'll send you an email confirmation shortly.
          </p>

          {order ? (
            <>
              <div className="order-confirm__id">
                Order ID: <strong>#{order._id.slice(-8).toUpperCase()}</strong>
              </div>

              <div className="order-confirm__card">
                <h3 className="order-confirm__section-title">Items Ordered</h3>
                <div className="order-confirm__items">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-confirm__item">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&q=80'}
                        alt={item.name}
                        onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&q=80'; }}
                      />
                      <div className="order-confirm__item-info">
                        <div className="order-confirm__item-name">{item.name}</div>
                        <div className="order-confirm__item-meta">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</div>
                      </div>
                      <div className="order-confirm__item-total">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                    </div>
                  ))}
                </div>

                <div className="order-confirm__summary">
                  <div className="order-confirm__summary-row">
                    <span>Total Amount</span>
                    <span className="order-confirm__total">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="order-confirm__summary-row">
                    <span>Payment</span>
                    <span>Cash on Delivery</span>
                  </div>
                </div>

                <div className="order-confirm__shipping">
                  <h3 className="order-confirm__section-title">Delivering To</h3>
                  <p>{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                  <p>{order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                </div>

                <div className="order-confirm__delivery-note">
                  ✦ Estimated delivery: 3–7 business days
                </div>
              </div>
            </>
          ) : (
            <div className="order-confirm__card">
              <p style={{ textAlign: 'center', color: 'var(--mid-gray)' }}>
                Your order has been placed successfully!
              </p>
            </div>
          )}

          <div className="order-confirm__actions">
            <Link to="/orders" className="btn btn-primary">View My Orders</Link>
            <Link to="/products" className="btn btn-secondary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
