import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import './ProductDetailPage.css';

const TABS = ['Description','Details','Care'];

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainImg, setMainImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('Description');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setMainImg(0); setQty(1);
    productsAPI.getProduct(id)
      .then(res => {
        const p = res.data.product || res.data;
        setProduct(p);
        return productsAPI.getProducts({ category: p.category, limit: 4 });
      })
      .then(res => {
        setRelated((res.data.products || []).filter((r: Product) => r._id !== id).slice(0, 4));
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page"><LoadingSpinner /></div>;
  if (!product) return (
    <div className="page">
      <div className="empty-state">
        <div className="empty-state-icon">✦</div>
        <h3>Product Not Found</h3>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    </div>
  );

  const imgs = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80'];
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    if (product.stock === 0) { toast.error('Out of stock'); return; }
    addItem(product, qty);
    toast.success(`${product.name} added to cart!`, {
      icon: '✦',
      style: { background: '#1A1A1A', color: '#fff', borderLeft: '3px solid #C9A96E' }
    });
  };

  return (
    <div className="page product-detail">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <Link to="/products">Products</Link>
          <span className="breadcrumb-sep">›</span>
          <Link to={`/products?category=${product.category}`}>
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Link>
          <span className="breadcrumb-sep">›</span>
          <span>{product.name}</span>
        </div>

        <div className="product-detail__layout">
          {/* Gallery */}
          <div className="product-detail__gallery">
            <div className="gallery-main">
              <img
                src={imgs[mainImg]}
                alt={product.name}
                className="gallery-main__img"
                onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80'; }}
              />
              {discount > 0 && <span className="gallery-main__badge">-{discount}%</span>}
            </div>
            {imgs.length > 1 && (
              <div className="gallery-thumbs">
                {imgs.map((img, i) => (
                  <button
                    key={i}
                    className={`gallery-thumb ${i === mainImg ? 'active' : ''}`}
                    onClick={() => setMainImg(i)}
                  >
                    <img src={img} alt={`View ${i+1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail__info">
            <div className={`badge badge-${product.category} product-detail__badge`}>
              {product.category}
            </div>
            <h1 className="product-detail__name">{product.name}</h1>

            <div className="product-detail__rating">
              <div className="stars">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={s <= Math.round(product.ratings || 0) ? 'star star--filled' : 'star'}>★</span>
                ))}
              </div>
              <span className="product-detail__reviews">
                {product.ratings?.toFixed(1)} ({product.numReviews} reviews)
              </span>
            </div>

            <div className="product-detail__price-row">
              <span className="price product-detail__price">₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="price-original">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                  <span className="price-discount">{discount}% off</span>
                </>
              )}
            </div>

            <div className={`product-detail__stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? (
                <>
                  <span className="stock-dot stock-dot--in" />
                  {product.stock <= 5 ? `Only ${product.stock} left!` : 'In Stock'}
                </>
              ) : (
                <>
                  <span className="stock-dot stock-dot--out" />
                  Out of Stock
                </>
              )}
            </div>

            <p className="product-detail__desc">{product.description}</p>

            {product.stock > 0 && (
              <div className="product-detail__actions">
                <div className="qty-control">
                  <button
                    className="qty-btn"
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                  >−</button>
                  <span className="qty-value">{qty}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    disabled={qty >= product.stock}
                  >+</button>
                </div>
                <button
                  className="btn btn-primary product-detail__add-cart"
                  onClick={handleAddToCart}
                >
                  Add to Cart &nbsp;·&nbsp; ₹{(product.price * qty).toLocaleString('en-IN')}
                </button>
              </div>
            )}

            {/* Meta */}
            <div className="product-detail__meta">
              {product.subcategory && (
                <div className="meta-row">
                  <span className="meta-label">Type</span>
                  <span className="meta-value">{product.subcategory.charAt(0).toUpperCase() + product.subcategory.slice(1)}</span>
                </div>
              )}
              {product.material && (
                <div className="meta-row">
                  <span className="meta-label">Material</span>
                  <span className="meta-value">{product.material}</span>
                </div>
              )}
              {product.weight && (
                <div className="meta-row">
                  <span className="meta-label">Weight</span>
                  <span className="meta-value">{product.weight}</span>
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="product-detail__trust">
              <div className="trust-badge">✦ Certified Authentic</div>
              <div className="trust-badge">↩ 7-Day Returns</div>
              <div className="trust-badge">✈ Free Shipping ₹999+</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="product-detail__tabs">
          <div className="tabs-header">
            {TABS.map(t => (
              <button
                key={t}
                className={`tab-btn ${tab === t ? 'active' : ''}`}
                onClick={() => setTab(t)}
              >{t}</button>
            ))}
          </div>
          <div className="tab-content">
            {tab === 'Description' && (
              <p className="tab-text">{product.description || 'No description available for this product.'}</p>
            )}
            {tab === 'Details' && (
              <div className="tab-details">
                {product.material && <div className="detail-row"><span>Material</span><span>{product.material}</span></div>}
                {product.weight && <div className="detail-row"><span>Weight</span><span>{product.weight}</span></div>}
                {product.subcategory && <div className="detail-row"><span>Jewellery Type</span><span>{product.subcategory.charAt(0).toUpperCase() + product.subcategory.slice(1)}</span></div>}
                {product.category && <div className="detail-row"><span>Category</span><span>{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span></div>}
                {product.occasion?.length > 0 && <div className="detail-row"><span>Occasion</span><span>{product.occasion.join(', ')}</span></div>}
              </div>
            )}
            {tab === 'Care' && (
              <div className="tab-text">
                <p>Keep away from water, perfumes, and chemicals. Store in a cool, dry place. Clean with a soft, dry cloth.</p>
                <ul className="care-tips">
                  <li>Avoid contact with water, chemicals, and cosmetics</li>
                  <li>Store separately in a jewellery box or pouch</li>
                  <li>Clean gently with a soft, lint-free cloth</li>
                  <li>Remove before exercising, swimming, or sleeping</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="product-detail__related">
            <div className="section-title">
              <h2>You May Also Like</h2>
              <div className="gold-divider" />
            </div>
            <div className="related-grid">
              {related.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
