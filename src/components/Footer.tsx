import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Thank you for subscribing!');
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="container">
          <div className="footer__grid">
            {/* Brand */}
            <div className="footer__brand">
              <div className="footer__logo">
                <span className="footer__logo-mark">J◈R</span>
                <span className="footer__logo-name">JEWELROCX</span>
              </div>
              <p className="footer__tagline">
                Crafting timeless elegance for those who appreciate the finest jewellery.
                Each piece tells a story of artistry and devotion.
              </p>
              <div className="footer__socials">
                <a href="#" aria-label="Instagram" className="footer__social-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href="#" aria-label="Facebook" className="footer__social-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                </a>
                <a href="#" aria-label="Pinterest" className="footer__social-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.03-2.83.19-.77 1.26-5.31 1.26-5.31s-.32-.64-.32-1.59c0-1.49.87-2.61 1.94-2.61.92 0 1.36.69 1.36 1.52 0 .92-.59 2.31-.89 3.59-.25 1.07.53 1.94 1.58 1.94 1.9 0 3.19-2.44 3.19-5.33 0-2.2-1.49-3.74-3.62-3.74-2.46 0-3.91 1.85-3.91 3.75 0 .74.28 1.54.64 1.97.07.08.08.15.06.24l-.24.97c-.04.15-.13.18-.3.11-1.12-.52-1.82-2.17-1.82-3.49 0-2.83 2.06-5.44 5.93-5.44 3.11 0 5.53 2.22 5.53 5.18 0 3.09-1.95 5.57-4.65 5.57-.91 0-1.76-.47-2.05-1.03l-.56 2.08c-.2.78-.75 1.75-1.12 2.34.85.26 1.74.4 2.67.4 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
                </a>
              </div>
            </div>

            {/* About */}
            <div className="footer__col">
              <h4 className="footer__col-title">About</h4>
              <ul className="footer__links">
                <li><Link to="/">Our Story</Link></li>
                <li><Link to="/">Craftsmanship</Link></li>
                <li><Link to="/">Sustainability</Link></li>
                <li><Link to="/">Press</Link></li>
              </ul>
            </div>

            {/* Collections */}
            <div className="footer__col">
              <h4 className="footer__col-title">Collections</h4>
              <ul className="footer__links">
                <li><Link to="/products?category=gold">Gold Jewellery</Link></li>
                <li><Link to="/products?category=silver">Silver Jewellery</Link></li>
                <li><Link to="/products?category=artificial">Fashion Jewellery</Link></li>
                <li><Link to="/products?subcategory=rings">Rings</Link></li>
                <li><Link to="/products?subcategory=necklace">Necklaces</Link></li>
                <li><Link to="/products?subcategory=earrings">Earrings</Link></li>
              </ul>
            </div>

            {/* Help */}
            <div className="footer__col">
              <h4 className="footer__col-title">Help</h4>
              <ul className="footer__links">
                <li><Link to="/orders">My Orders</Link></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Shipping Policy</a></li>
                <li><a href="#">Return Policy</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">FAQs</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="footer__newsletter">
              <h4 className="footer__col-title">Newsletter</h4>
              <p className="footer__newsletter-text">
                Subscribe for new arrivals, exclusive offers, and jewellery editorials.
              </p>
              <form onSubmit={handleNewsletter} className="footer__newsletter-form">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="footer__newsletter-input"
                />
                <button type="submit" className="footer__newsletter-btn">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <div className="footer__bottom-inner">
            <p className="footer__copy">
              &copy; {new Date().getFullYear()} JewelRocX. All rights reserved.
            </p>
            <p className="footer__payment">
              COD &nbsp;·&nbsp; UPI &nbsp;·&nbsp; Net Banking &nbsp;·&nbsp; Cards
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
