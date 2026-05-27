import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllProducts } from "../../services/api";
import ProductCard from "../../components/ui/ProductCard";
import "./Home.css";

const categories = [
  { name: "Whey Protein", slug: "whey-protein", icon: "🥛" },
  { name: "Mass Gainer", slug: "mass-gainer", icon: "💪" },
  { name: "Pre-Workout", slug: "pre-workout", icon: "⚡" },
  { name: "Creatine", slug: "creatine", icon: "🔬" },
  { name: "Vitamins", slug: "vitamins", icon: "💊" },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllProducts()
      .then((res) => setFeatured(res.data.slice(0, 4)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-left">
          <span className="hero-tag">NEW ARRIVALS 2025</span>
          <h1 className="hero-title">
            FUEL YOUR<br />
            <span>GAINS</span>
          </h1>
          <p className="hero-sub">
            Premium proteins &amp; supplements. Scientifically formulated
            for athletes who refuse to compromise.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => navigate("/products")}>
              Shop Now
            </button>
            <button className="btn-outline" onClick={() => navigate("/products?deals=true")}>
              View Deals
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-num">500+</div>
              <div className="stat-lbl">Products</div>
            </div>
            <div className="stat">
              <div className="stat-num">50K+</div>
              <div className="stat-lbl">Customers</div>
            </div>
            <div className="stat">
              <div className="stat-num">4.8★</div>
              <div className="stat-lbl">Avg Rating</div>
            </div>
          </div>
        </div>
        <div className="hero-card">
          <div className="hero-card-label">🔥 BESTSELLER</div>
          <div className="hero-card-title">ON Gold Standard Whey</div>
          <div className="hero-card-price-row">
            <span className="hero-card-price">₹3,499</span>
            <span className="hero-card-og">₹4,200</span>
          </div>
          <div className="hero-card-img">
            <img
              src="https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400"
              alt="Whey Protein"
            />
          </div>
          <Link to="/products/1" className="hero-card-btn">
            View Product →
          </Link>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <div className="trust-bar">
        {[
          { icon: "🚚", title: "Free Delivery", sub: "Orders above ₹999" },
          { icon: "✅", title: "100% Authentic", sub: "Genuine products only" },
          { icon: "🔄", title: "Easy Returns", sub: "7-day return policy" },
          { icon: "🔒", title: "Secure Payment", sub: "Razorpay protected" },
        ].map((t) => (
          <div className="trust-item" key={t.title}>
            <span className="trust-icon">{t.icon}</span>
            <div>
              <strong>{t.title}</strong>
              <span>{t.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Categories ── */}
      <section className="section white-bg">
        <div className="section-header">
          <h2 className="section-title">SHOP BY CATEGORY</h2>
        </div>
        <div className="cat-grid">
          {categories.map((cat) => (
            <Link
              to={`/products?category=${cat.slug}`}
              className="cat-card"
              key={cat.slug}
            >
              <div className="cat-icon">{cat.icon}</div>
              <div className="cat-name">{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">FEATURED PRODUCTS</h2>
          <Link to="/products" className="see-all">View All →</Link>
        </div>
        {loading ? (
          <div className="loading-row">
            {[1,2,3,4].map((n) => (
              <div className="skeleton-card" key={n} />
            ))}
          </div>
        ) : (
          <div className="prod-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Home;