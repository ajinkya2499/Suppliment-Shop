import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiShoppingCart, FiHeart, FiZap, FiShare2,
  FiTruck, FiShield, FiRefreshCw, FiLock,
  FiChevronRight, FiMinus, FiPlus, FiStar,
} from "react-icons/fi";
import { getProductById, getRelatedProducts, getProductReviews } from "../services/api";
import { addToCart }       from "../redux/slices/cartSlice";
import { toggleWishlist }  from "../redux/slices/wishlistSlice";
import ProductCard          from "../components/ui/ProductCard";
import toast                from "react-hot-toast";
import "./ProductDetail.css";

const TABS = ["Description", "Nutrition Facts", "Reviews"];

const ProductDetail = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const dispatch     = useDispatch();

  /* ── data ── */
  const [product,  setProduct]  = useState(null);
  const [related,  setRelated]  = useState([]);
  const [reviews,  setReviews]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  /* ── ui state ── */
  const [activeImg,    setActiveImg]    = useState(0);
  const [selFlavour,   setSelFlavour]   = useState("");
  const [qty,          setQty]          = useState(1);
  const [activeTab,    setActiveTab]    = useState("Description");

  /* ── redux ── */
  const wishlistItems = useSelector((s) => s.wishlist.items);
  const isWishlisted  = wishlistItems.some((i) => i.id === Number(id));

  /* ── load ── */
  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);

    getProductById(id)
      .then((res) => {
        const p = res.data;
        setProduct(p);
        setSelFlavour(p.flavours?.[0] || "");
        return Promise.all([
          getRelatedProducts(p.category, id),
          getProductReviews(id),
        ]);
      })
      .then(([relRes, revRes]) => {
        setRelated(relRes.data);
        setReviews(revRes.data);
      })
      .catch(() => toast.error("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  /* ── actions ── */
  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity: qty }));
    toast.success(`Added ${qty} × ${product.title.slice(0, 22)}… to cart!`);
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ ...product, quantity: qty }));
    navigate("/cart");
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product));
    toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist ❤️");
  };

  /* ── helpers ── */
  const discount    = product
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const savings     = product ? product.originalPrice - product.price : 0;
  const avgRating   = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : product?.rating;

  const ratingBars = [5,4,3,2,1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const pct   = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
    return { star, pct };
  });

  /* ── thumbnail images (reuse same image for now) ── */
  const thumbs = product ? [product.image, product.image, product.image] : [];

  if (loading) return <div className="pd-loading"><div className="pd-spinner"/></div>;
  if (!product) return <div className="pd-loading"><p>Product not found.</p></div>;

  return (
    <div className="pd-page">

      {/* Breadcrumb */}
      <div className="pd-breadcrumb">
        <Link to="/">Home</Link>
        <FiChevronRight size={12}/>
        <Link to="/products">Products</Link>
        <FiChevronRight size={12}/>
        <span>{product.title}</span>
      </div>

      {/* ── Top: Image + Info ── */}
      <div className="pd-top">

        {/* Images */}
        <div className="pd-images">
          <div className="main-img-wrap">
            <img src={thumbs[activeImg]} alt={product.title} className="main-img"/>
            {discount > 0 && (
              <span className="img-discount-badge">{discount}% OFF</span>
            )}
          </div>
          <div className="thumb-row">
            {thumbs.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className={`thumb ${activeImg === i ? "active" : ""}`}
                onClick={() => setActiveImg(i)}
              />
            ))}
          </div>
          {/* Share */}
          <button className="share-btn" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied!");
          }}>
            <FiShare2 size={14}/> Share Product
          </button>
        </div>

        {/* Info */}
        <div className="pd-info">
          <div className="pd-brand">{product.brand}</div>
          <h1 className="pd-title">{product.title}</h1>

          {/* Rating */}
          <div className="pd-rating-row">
            <span className="stars">{"★".repeat(Math.round(product.rating))}</span>
            <span className="rat-num">{avgRating}</span>
            <span className="rat-count">({product.reviews.toLocaleString()} reviews)</span>
          </div>

          {/* Price */}
          <div className="pd-price-row">
            <span className="pd-price">₹{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="pd-og">₹{product.originalPrice.toLocaleString()}</span>
            )}
            {discount > 0 && (
              <span className="pd-disc">{discount}% OFF</span>
            )}
          </div>
          {savings > 0 && (
            <p className="pd-savings">
              🎉 You save ₹{savings.toLocaleString()}!
            </p>
          )}

          <div className="pd-divider"/>

          {/* Flavour selector */}
          {product.flavours?.length > 0 && (
            <>
              <div className="opt-label">
                Flavour: <strong>{selFlavour}</strong>
              </div>
              <div className="flavour-row">
                {product.flavours.map((fl) => (
                  <button
                    key={fl}
                    className={`fv-pill ${selFlavour === fl ? "active" : ""}`}
                    onClick={() => setSelFlavour(fl)}
                  >
                    {fl}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Quantity */}
          <div className="opt-label" style={{ marginTop: "14px" }}>Quantity</div>
          <div className="qty-row">
            <div className="qty-ctrl">
              <button
                className="qty-btn"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <FiMinus size={14}/>
              </button>
              <span className="qty-val">{qty}</span>
              <button
                className="qty-btn"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              >
                <FiPlus size={14}/>
              </button>
            </div>
            {product.stock > 0 ? (
              <span className="stock-in">✓ In Stock ({product.stock} left)</span>
            ) : (
              <span className="stock-out">✗ Out of Stock</span>
            )}
          </div>

          {/* CTA buttons */}
          <div className="pd-btn-row">
            <button
              className="btn-cart"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <FiShoppingCart size={16}/>
              Add to Cart
            </button>
            <button
              className="btn-buy"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              <FiZap size={16}/>
              Buy Now
            </button>
            <button
              className={`btn-wish ${isWishlisted ? "active" : ""}`}
              onClick={handleWishlist}
            >
              <FiHeart size={18}/>
            </button>
          </div>

          {/* Trust badges */}
          <div className="trust-mini">
            {[
              { icon: <FiTruck   size={14}/>, text: "Free Delivery above ₹999" },
              { icon: <FiShield  size={14}/>, text: "100% Authentic"           },
              { icon: <FiRefreshCw size={14}/>, text: "7-day Easy Returns"     },
              { icon: <FiLock    size={14}/>, text: "Secure Payment"           },
            ].map((t) => (
              <div className="trust-chip" key={t.text}>
                {t.icon} {t.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="pd-tabs-wrap">
        <div className="pd-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`pd-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "Reviews" ? `Reviews (${reviews.length || product.reviews})` : tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="pd-tab-content">

        {activeTab === "Description" && (
          <div className="tab-desc">
            <p className="desc-text">{product.description}</p>
            <div className="detail-grid">
              {[
                { k: "Brand",    v: product.brand    },
                { k: "Weight",   v: product.weight   },
                { k: "Category", v: product.category.replace(/-/g, " ") },
                { k: "In Stock", v: `${product.stock} units` },
              ].map(({ k, v }) => (
                <div className="detail-row" key={k}>
                  <span className="detail-key">{k}</span>
                  <span className="detail-val">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Nutrition Facts" && (
          <div className="tab-nutrition">
            <div className="nutrition-card">
              <div className="nc-header">Nutrition Facts — Per Serving</div>
              <div className="nc-sub">Serving Size: 1 Scoop (31g)</div>
              {[
                { label: "Calories",  value: "120 kcal" },
                { label: "Protein",   value: "24g"      },
                { label: "Carbs",     value: "3g"       },
                { label: "Fat",       value: "1.5g"     },
                { label: "Sugar",     value: "1g"       },
                { label: "Sodium",    value: "60mg"     },
                { label: "BCAA",      value: "5.5g"     },
                { label: "Glutamine", value: "4g"       },
              ].map(({ label, value }) => (
                <div className="nc-row" key={label}>
                  <span className="nc-label">{label}</span>
                  <span className="nc-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Reviews" && (
          <div className="tab-reviews">

            {/* Summary */}
            <div className="review-summary">
              <div className="rs-big">
                <div className="rs-num">{avgRating}</div>
                <div className="rs-stars">
                  {"★".repeat(Math.round(product.rating))}
                </div>
                <div className="rs-count">
                  {product.reviews.toLocaleString()} reviews
                </div>
              </div>
              <div className="rs-bars">
                {ratingBars.map(({ star, pct }) => (
                  <div className="rb-row" key={star}>
                    <span className="rb-lbl">{star}★</span>
                    <div className="rb-track">
                      <div className="rb-fill" style={{ width: `${pct}%` }}/>
                    </div>
                    <span className="rb-pct">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review cards */}
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div className="review-card" key={rev.id}>
                  <div className="rv-top">
                    <div className="rv-avatar">
                      {rev.name.charAt(0)}
                    </div>
                    <div className="rv-meta">
                      <div className="rv-name">{rev.name}</div>
                      <div className="rv-date">{rev.date}</div>
                    </div>
                    <div className="rv-stars">
                      {"★".repeat(rev.rating)}
                      {"☆".repeat(5 - rev.rating)}
                    </div>
                  </div>
                  <p className="rv-text">{rev.text}</p>
                </div>
              ))
            ) : (
              <div className="no-reviews">
                <FiStar size={32} color="#ddd"/>
                <p>No reviews yet for this product.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <div className="pd-related">
          <div className="related-header">
            <h2 className="related-title">YOU MAY ALSO LIKE</h2>
            <Link to="/products" className="see-all-link">View All →</Link>
          </div>
          <div className="related-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p}/>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetail;