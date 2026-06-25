import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './CartPage.css';

const FREE_SHIPPING_THRESHOLD = 999;

const CartPage = () => {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  const shippingCost = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 99;
  const finalTotal = totalPrice + shippingCost;

  const handleRemove = (productId: string, name: string) => {
    removeItem(productId);
    toast(`${name} removed from cart`, {
      style: { background: '#1A1A1A', color: '#fff' }
    });
  };

  if (items.length === 0) {
    return (
      <div className="page cart-page">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <span>Shopping Cart</span>
          </div>
          <div className="empty-state cart-empty">
            <div className="cart-empty__icon">
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added anything yet. Discover our stunning jewellery collections.</p>
            <Link to="/products" className="btn btn-primary">Explore Collections</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page cart-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <span>Shopping Cart</span>
        </div>
        <h1 className="cart-page__title">Shopping Cart <span>({totalItems} items)</span></h1>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map(({ product, quantity }) => (
              <div key={product._id} className="cart-item">
                <Link to={`/products/${product._id}`} className="cart-item__img-link">
                  <img
                    src={product.images?.[0] || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&q=80'}
                    alt={product.name}
                    className="cart-item__img"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&q=80'; }}
                  />
                </Link>
                <div className="cart-item__info">
                  <div className={`badge badge-${product.category} cart-item__cat`}>{product.category}</div>
                  <Link to={`/products/${product._id}`} className="cart-item__name">
                    {product.name}
                  </Link>
                  {product.material && (
                    <p className="cart-item__meta">{product.material}</p>
                  )}
                  <div className="cart-item__price-mobile">
                    ₹{(product.price * quantity).toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="cart-item__controls">
                  <div className="qty-control">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(product._id, quantity - 1)}
                    >−</button>
                    <span className="qty-value">{quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(product._id, Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >+</button>
                  </div>
                </div>
                <div className="cart-item__price">
                  <div className="cart-item__unit-price">₹{product.price.toLocaleString('en-IN')} × {quantity}</div>
                  <div className="cart-item__total">₹{(product.price * quantity).toLocaleString('en-IN')}</div>
                </div>
                <button
                  className="cart-item__remove"
                  onClick={() => handleRemove(product._id, product.name)}
                  aria-label="Remove item"
                >✕</button>
              </div>
            ))}

            <div className="cart-items__footer">
              <Link to="/products" className="cart-continue">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h3 className="cart-summary__title">Order Summary</h3>
            <div className="cart-summary__rows">
              <div className="summary-row">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? 'summary-free' : ''}>
                  {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                </span>
              </div>
              {shippingCost > 0 && (
                <p className="cart-summary__shipping-note">
                  Add ₹{(FREE_SHIPPING_THRESHOLD - totalPrice).toLocaleString('en-IN')} more for free shipping
                </p>
              )}
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
            <Link to="/checkout" className="btn btn-primary cart-summary__checkout">
              Proceed to Checkout
            </Link>
            <div className="cart-summary__trust">
              <span>🔒 Secure Checkout</span>
              <span>✦ 7-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
