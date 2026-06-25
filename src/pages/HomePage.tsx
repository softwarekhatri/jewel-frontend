import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productsAPI } from "../services/api";
import { Product } from "../types";
import ProductCard from "../components/ProductCard";
import "./HomePage.css";

const HomePage = () => {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsAPI
      .getFeaturedProducts()
      .then((r) => setFeatured(r.data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="homepage">
      {/* ── Hero ── */}
      <section className="hero">
        <div
          className="hero__bg"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=80)",
          }}
        />
        <div className="hero__overlay" />
        <div className="hero__content">
          {/* <span className="hero__eyebrow">New Collection — 2024</span> */}
          <h1 className="hero__title">
            Fine Jewellery,
            <br />
            <em>Crafted Forever</em>
          </h1>
          <p className="hero__sub">
            Handcrafted gold, sterling silver & fashion jewellery — heirloom
            artistry for the modern woman.
          </p>
          <div className="hero__btns">
            <Link to="/products" className="btn btn-white">
              Explore Collections
            </Link>
            <Link to="/products?category=gold" className="btn btn-ghost">
              Gold Jewellery
            </Link>
          </div>
        </div>
        <div className="hero__scroll-cue">
          <div className="hero__scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── Promise Strip ── */}
      <div className="promise-strip">
        <div className="container">
          <div className="promise-strip__inner">
            {[
              { icon: "◈", text: "Certified Authentic" },
              { icon: "◈", text: "Free Shipping ₹999+" },
              { icon: "◈", text: "7-Day Returns" },
              { icon: "◈", text: "COD Available" },
            ].map((p) => (
              <div key={p.text} className="promise-item">
                <span className="promise-item__icon">{p.icon}</span>
                <span className="promise-item__text">{p.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Collections ── */}
      <section className="collections">
        <div className="container">
          <div className="section-head">
            <span className="sec-sub">Curated For You</span>
            <h2 className="sec-head">Shop by Collection</h2>
          </div>
          <div className="collections__grid">
            {[
              {
                cat: "gold",
                title: "Gold",
                subtitle: "Pure 22K & 18K",
                img: "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=800&q=80",
              },
              {
                cat: "silver",
                title: "Silver",
                subtitle: "925 Sterling",
                img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
              },
              {
                cat: "artificial",
                title: "Fashion",
                subtitle: "Contemporary",
                img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
              },
            ].map((c) => (
              <Link
                key={c.cat}
                to={`/products?category=${c.cat}`}
                className="col-card"
              >
                <div className="col-card__img-wrap">
                  <img
                    src={c.img}
                    alt={c.title}
                    className="col-card__img"
                    loading="lazy"
                  />
                  <div className="col-card__overlay" />
                </div>
                <div className="col-card__label">
                  <span className="col-card__sub">{c.subtitle}</span>
                  <span className="col-card__title">{c.title}</span>
                  <span className="col-card__cta">Shop Now →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="featured" id="featured">
        <div className="container">
          <div className="section-head section-head--row">
            <div>
              <span className="sec-sub">Editors' Picks</span>
              <h2 className="sec-head">Featured Pieces</h2>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm">
              View All
            </Link>
          </div>
          {loading ? (
            <div className="featured-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton skeleton-img" />
                  <div
                    style={{
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <div
                      className="skeleton"
                      style={{ height: 14, marginBottom: 4 }}
                    />
                    <div
                      className="skeleton"
                      style={{ height: 12, width: "60%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="featured-grid">
              {featured.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Brand Promise ── */}
      <section className="brand-promise">
        <div className="container">
          <div className="brand-promise__grid">
            {[
              {
                title: "Certified Quality",
                desc: "BIS hallmarked gold & certified 925 silver — authenticity guaranteed on every piece.",
              },
              {
                title: "Free Shipping",
                desc: "Complimentary shipping on all orders above ₹999, delivered with care.",
              },
              {
                title: "Easy Returns",
                desc: "7-day hassle-free returns. Your satisfaction is our commitment.",
              },
              {
                title: "Expert Guidance",
                desc: "Our jewellery specialists are here to help you find the perfect piece.",
              },
            ].map((p) => (
              <div key={p.title} className="brand-promise__item">
                <div className="brand-promise__ornament">◈</div>
                <h4 className="brand-promise__title">{p.title}</h4>
                <p className="brand-promise__desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Editorial Band ── */}
      <section className="editorial-band">
        <div className="editorial-band__inner">
          <span className="sec-sub" style={{ color: "rgba(255,255,255,0.5)" }}>
            The JewelRocX Ethos
          </span>
          <blockquote className="editorial-band__quote">
            "We believe jewellery is not merely an accessory —<br />
            it is the expression of a life beautifully lived."
          </blockquote>
          <Link to="/products" className="btn btn-ghost">
            Discover Our Story
          </Link>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="testimonials">
        <div className="container">
          <div className="section-head">
            <span className="sec-sub">Voices of Our Patrons</span>
            <h2 className="sec-head">Loved by Thousands</h2>
          </div>
          <div className="testi-grid">
            {[
              {
                name: "Priya Sharma",
                loc: "Mumbai",
                review:
                  "The Kundan necklace set was breathtaking — impeccable craftsmanship and beautifully packaged. Received so many compliments at the wedding.",
                rating: 5,
              },
              {
                name: "Anita Verma",
                loc: "Delhi",
                review:
                  "Amazing quality. The silver anklets are sturdy, exquisitely finished and look exactly like the pictures. Super fast delivery. Will order again.",
                rating: 5,
              },
              {
                name: "Kavitha Nair",
                loc: "Bengaluru",
                review:
                  "I have been shopping from JewelRocX for two years. Their gold jewellery is always genuine, beautifully crafted and customer service is outstanding.",
                rating: 5,
              },
            ].map((t) => (
              <div key={t.name} className="testi-card">
                <div className="testi-card__stars">{"★".repeat(t.rating)}</div>
                <p className="testi-card__review">"{t.review}"</p>
                <div className="testi-card__author">
                  <div className="testi-card__avatar">{t.name[0]}</div>
                  <div>
                    <div className="testi-card__name">{t.name}</div>
                    <div className="testi-card__loc">{t.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instagram Gallery ── */}
      <section className="gallery">
        <div className="container">
          <div className="section-head">
            <span className="sec-sub">The Look Book</span>
            <h2 className="sec-head">Wear Your Story</h2>
          </div>
          <div className="gallery__grid">
            {[
              "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
              "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&q=80",
              "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80",
              "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80",
              "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=400&q=80",
              "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=400&q=80",
            ].map((img, i) => (
              <div key={i} className="gallery__item">
                <img src={img} alt={`Look ${i + 1}`} loading="lazy" />
                <div className="gallery__item-overlay">
                  <span>◈</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter__inner">
            <span className="sec-sub" style={{ color: "var(--gold)" }}>
              Stay Connected
            </span>
            <h2 className="newsletter__heading">
              <em>Exclusive Access,</em> First Always
            </h2>
            <p className="newsletter__sub">
              Subscribe for early access to new arrivals, private sales, and
              jewellery editorials.
            </p>
            <form
              className="newsletter__form"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email address"
                className="newsletter__input"
              />
              <button type="submit" className="btn btn-gold">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
