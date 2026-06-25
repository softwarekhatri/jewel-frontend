import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setAccountOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); setAccountOpen(false); };

  const navClass = [
    'navbar',
    (scrolled || !isHome || menuOpen) ? 'navbar--solid' : 'navbar--transparent',
  ].join(' ');

  return (
    <>
      <nav className={navClass}>
        <div className="navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-mark">J◈R</span>
            <span className="navbar__logo-name">JEWELROCX</span>
          </Link>

          {/* Desktop links */}
          <ul className="navbar__links">
            <li>
              <Link to="/" className="navbar__link">Home</Link>
            </li>
            <li
              className="navbar__dropdown"
              onMouseEnter={() => setCollectionsOpen(true)}
              onMouseLeave={() => setCollectionsOpen(false)}
            >
              <span className="navbar__link navbar__link--drop">
                Collections
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </span>
              <div className={`navbar__dropdown-menu ${collectionsOpen ? 'open' : ''}`}>
                <Link to="/products?category=gold" className="navbar__dropdown-item">
                  <span className="navbar__dropdown-swatch navbar__dropdown-swatch--gold" />
                  <div>
                    <div className="navbar__dropdown-item-title">Gold Jewellery</div>
                    <div className="navbar__dropdown-item-sub">22K & 18K certified pieces</div>
                  </div>
                </Link>
                <Link to="/products?category=silver" className="navbar__dropdown-item">
                  <span className="navbar__dropdown-swatch navbar__dropdown-swatch--silver" />
                  <div>
                    <div className="navbar__dropdown-item-title">Silver Jewellery</div>
                    <div className="navbar__dropdown-item-sub">925 sterling collection</div>
                  </div>
                </Link>
                <Link to="/products?category=artificial" className="navbar__dropdown-item">
                  <span className="navbar__dropdown-swatch navbar__dropdown-swatch--fashion" />
                  <div>
                    <div className="navbar__dropdown-item-title">Fashion Jewellery</div>
                    <div className="navbar__dropdown-item-sub">Contemporary & trend-forward</div>
                  </div>
                </Link>
                <div className="navbar__dropdown-divider" />
                <Link to="/products" className="navbar__dropdown-all">
                  View All Collections →
                </Link>
              </div>
            </li>
            <li>
              <Link to="/products" className="navbar__link">Shop All</Link>
            </li>
          </ul>

          {/* Right actions */}
          <div className="navbar__actions">
            {/* Search */}
            <button className="navbar__icon-btn" aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>

            {/* Cart */}
            <Link to="/cart" className="navbar__icon-btn navbar__cart-btn" aria-label="Cart">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {totalItems > 0 && <span className="navbar__badge">{totalItems}</span>}
            </Link>

            {/* Account */}
            <div className="navbar__account">
              <button
                className="navbar__icon-btn"
                onClick={() => setAccountOpen(p => !p)}
                aria-label="Account"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </button>
              {accountOpen && (
                <div className="navbar__account-dropdown">
                  {isAuthenticated ? (
                    <>
                      <div className="navbar__account-greeting">Hello, {user?.name?.split(' ')[0]}</div>
                      <div className="navbar__account-divider" />
                      <Link to="/orders" className="navbar__account-link" onClick={() => setAccountOpen(false)}>
                        My Orders
                      </Link>
                      <button className="navbar__account-link navbar__account-link--logout" onClick={handleLogout}>
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="navbar__account-link" onClick={() => setAccountOpen(false)}>
                        Sign In
                      </Link>
                      <Link to="/signup" className="navbar__account-link" onClick={() => setAccountOpen(false)}>
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Hamburger */}
            <button
              className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(p => !p)}
              aria-label="Menu"
            >
              <span className="ham-line" />
              <span className="ham-line" />
              <span className="ham-line" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <div className={`mobile-nav ${menuOpen ? 'mobile-nav--open' : ''}`}>
        <div className="mobile-nav__inner">
          <div className="mobile-nav__logo">
            <span className="navbar__logo-mark">J◈R</span>
            <span className="navbar__logo-name">JEWELROCX</span>
          </div>
          <nav className="mobile-nav__links">
            <Link to="/" className="mobile-nav__link">Home</Link>
            <Link to="/products" className="mobile-nav__link">Shop All</Link>
            <div className="mobile-nav__sub-label">Collections</div>
            <Link to="/products?category=gold" className="mobile-nav__link mobile-nav__link--sub">Gold Jewellery</Link>
            <Link to="/products?category=silver" className="mobile-nav__link mobile-nav__link--sub">Silver Jewellery</Link>
            <Link to="/products?category=artificial" className="mobile-nav__link mobile-nav__link--sub">Fashion Jewellery</Link>
            <div className="mobile-nav__divider" />
            {isAuthenticated ? (
              <>
                <Link to="/orders" className="mobile-nav__link">My Orders</Link>
                <button onClick={handleLogout} className="mobile-nav__link mobile-nav__link--logout">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-nav__link">Sign In</Link>
                <Link to="/signup" className="mobile-nav__link">Create Account</Link>
              </>
            )}
          </nav>
        </div>
      </div>
      {menuOpen && <div className="mobile-nav__overlay" onClick={() => setMenuOpen(false)} />}
    </>
  );
};

export default Navbar;
