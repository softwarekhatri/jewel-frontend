import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { Order } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import './OrdersPage.css';

const STATUS_BADGE: Record<string, string> = {
  pending: 'badge-status-pending',
  confirmed: 'badge-status-confirmed',
  processing: 'badge-status-processing',
  shipped: 'badge-status-shipped',
  delivered: 'badge-status-delivered',
  cancelled: 'badge-status-cancelled',
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    ordersAPI.getUserOrders()
      .then(res => setOrders(res.data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setCancellingId(orderId);
    try {
      await ordersAPI.cancelOrder(orderId);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o));
      toast.success('Order cancelled successfully');
    } catch {
      toast.error('Could not cancel the order. Please contact support.');
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  if (loading) return <div className="page"><LoadingSpinner /></div>;

  return (
    <div className="page orders-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <span>My Orders</span>
        </div>
        <h1 className="orders-page__title">My Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✦</div>
            <h3>No Orders Yet</h3>
            <p>You haven't placed any orders. Start exploring our collections.</p>
            <Link to="/products" className="btn btn-primary">Shop Now</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div
                  className="order-card__header"
                  onClick={() => setExpandedId(p => p === order._id ? null : order._id)}
                >
                  <div className="order-card__meta">
                    <div className="order-card__id">Order #{order._id.slice(-8).toUpperCase()}</div>
                    <div className="order-card__date">{formatDate(order.createdAt)}</div>
                  </div>
                  <div className="order-card__summary">
                    <span className="order-card__items-count">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </span>
                    <span className="order-card__total">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                    <span className={`badge ${STATUS_BADGE[order.status] || ''}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="order-card__chevron">{expandedId === order._id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {expandedId === order._id && (
                  <div className="order-card__body fade-in">
                    <div className="order-items">
                      {order.items.map((item, i) => (
                        <div key={i} className="order-item">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&q=80'}
                            alt={item.name}
                            onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&q=80'; }}
                          />
                          <div className="order-item__info">
                            <div className="order-item__name">{item.name}</div>
                            <div className="order-item__meta">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</div>
                          </div>
                          <div className="order-item__total">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                        </div>
                      ))}
                    </div>

                    <div className="order-card__details">
                      <div className="order-detail-group">
                        <h4>Shipping Address</h4>
                        <p>{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                        <p>{order.shippingAddress.phone}</p>
                      </div>
                      <div className="order-detail-group">
                        <h4>Payment</h4>
                        <p>Method: Cash on Delivery</p>
                        <p>Total: ₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    {order.status === 'pending' && (
                      <div className="order-card__actions">
                        <button
                          className="btn order-cancel-btn"
                          onClick={() => handleCancel(order._id)}
                          disabled={cancellingId === order._id}
                        >
                          {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
