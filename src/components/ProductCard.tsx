import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './ProductCard.css';

interface Props { product: Product; }

const Stars = ({ rating }: { rating: number }) => (
  <div className="stars">
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ color: i <= Math.round(rating) ? 'var(--gold)' : 'var(--light)' }}>★</span>
    ))}
  </div>
);

const fmt = (p: number) => `₹${p.toLocaleString('en-IN')}`;
const disc = (orig: number, price: number) => Math.round((1 - price / orig) * 100);

const catLabel: Record<string, string> = {
  gold: 'Gold',
  silver: 'Silver',
  artificial: 'Fashion',
};

const ProductCard = ({ product }: Props) => {
  const { addItem } = useCart();
  const [wished, setWished] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addItem(product);
    toast.success(`Added to bag`, {
      style: { background: 'var(--ink)', color: 'var(--white)', fontFamily: 'var(--font-body)' },
    });
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-card__img-wrap">
        <img
          src={product.images[0]}
          alt={product.name}
          className="product-card__img"
          loading="lazy"
        />

        {product.stock === 0 && (
          <div className="product-card__sold-out">Sold Out</div>
        )}

        {product.originalPrice && product.originalPrice > product.price && (
          <div className="product-card__discount">−{disc(product.originalPrice, product.price)}%</div>
        )}

        <button
          className={`product-card__wish ${wished ? 'wished' : ''}`}
          onClick={e => { e.preventDefault(); setWished(p => !p); }}
          aria-label="Wishlist"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={wished ? 'var(--gold)' : 'none'} stroke={wished ? 'var(--gold)' : 'currentColor'} strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>

        {/* Add to bag — slides up on hover */}
        <div className="product-card__add-bar">
          <button
            className="product-card__add-btn"
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Sold Out' : 'Add to Bag'}
          </button>
        </div>
      </div>

      <div className="product-card__info">
        <span className="product-card__cat">
          {catLabel[product.category] || product.category}
        </span>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__rating">
          <Stars rating={product.ratings} />
          <span className="product-card__reviews">({product.numReviews})</span>
        </div>
        <div className="product-card__price-row">
          <span className="price">{fmt(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="price-original">{fmt(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
