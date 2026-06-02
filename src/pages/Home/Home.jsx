import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllProducts } from "../../services/api";
import ProductCard from "../../components/ui/ProductCard";
import styles from "./Home.module.css";

const categories = [
  { name: "Whey Protein", slug: "whey-protein", icon: "🥛" },
  { name: "Mass Gainer", slug: "mass-gainer", icon: "💪" },
  { name: "Pre-Workout", slug: "pre-workout", icon: "⚡" },
  { name: "Creatine", slug: "creatine", icon: "🔬" },
  { name: "Vitamins", slug: "vitamins", icon: "💊" },
    { name: "Accessories", slug: "Accessories", icon: "🧃" },
];

const TrustItems = [
  { icon: "🚚", title: "Free Delivery", sub: "Orders above ₹999" },
  { icon: "✅", title: "100% Authentic", sub: "Genuine products only" },
  { icon: "🔄", title: "Easy Returns", sub: "7-day return policy" },
  { icon: "🔒", title: "Secure Payment", sub: "Razorpay protected" },
];

function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllProducts()
      .then((res) => setFeatured(res.data.slice(0, 4)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.home}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <span className={styles.heroTag}>NEW ARRIVALS 2025</span>

          <h1 className={styles.heroTitle}>
            FUEL YOUR
            <br />
            <span>GAINS</span>
          </h1>

          <p className={styles.heroSub}>
            Premium proteins & supplements. Scientifically formulated for
            athletes who refuse to compromise.
          </p>

          <div className={styles.heroBtns}>
            <button
              className={styles.btnPrimary}
              onClick={() => navigate("/products")}
            >
              Shop Now
            </button>

            <button
              className={styles.btnOutline}
              onClick={() => navigate("/products?deals=true")}
            >
              View Deals
            </button>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <div className={styles.statNum}>500+</div>
              <div className={styles.statLbl}>Products</div>
            </div>

            <div className={styles.stat}>
              <div className={styles.statNum}>50K+</div>
              <div className={styles.statLbl}>Customers</div>
            </div>

            <div className={styles.stat}>
              <div className={styles.statNum}>4.8★</div>
              <div className={styles.statLbl}>Avg Rating</div>
            </div>
          </div>
        </div>

        <div className={styles.heroCard}>
          <div className={styles.heroCardLabel}>🔥 BESTSELLER</div>

          <div className={styles.heroCardTitle}>ON Gold Standard Whey</div>

          <div className={styles.heroCardPriceRow}>
            <span className={styles.heroCardPrice}>₹3,499</span>
            <span className={styles.heroCardOg}>₹4,200</span>
          </div>

          <div className={styles.heroCardImg}>
            <img src="" alt="Whey Protein" />
          </div>

          <Link to="/products/1" className={styles.heroCardBtn}>
            View Product →
          </Link>
        </div>
      </section>

      {/* Trust Bar */}
      <div className={styles.trustBar}>
        {TrustItems.map((item) => (
          <div key={item.title} className={styles.trustItem}>
            <span className={styles.trustIcon}>{item.icon}</span>

            <div>
              <strong>{item.title}</strong>
              <span>{item.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <section className={`${styles.section} ${styles.whiteBg}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>SHOP BY CATEGORY</h2>
        </div>

        <div className={styles.catGrid}>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              className={styles.catCard}
            >
              <div className={styles.catIcon}>{cat.icon}</div>

              <div className={styles.catName}>{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>FEATURED PRODUCTS</h2>

          <Link to="/products" className={styles.seeAll}>
            View All →
          </Link>
        </div>

        {loading ? (
          <div className={styles.loadingRow}>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className={styles.skeletonCard} />
            ))}
          </div>
        ) : (
          <div className={styles.prodGrid}>
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
