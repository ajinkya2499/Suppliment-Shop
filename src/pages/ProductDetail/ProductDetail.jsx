import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiShoppingCart,
  FiHeart,
  FiZap,
  FiShare2,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiLock,
  FiChevronRight,
  FiMinus,
  FiPlus,
  FiStar,
} from "react-icons/fi";
import {
  getProductById,
  getRelatedProducts,
  getProductReviews,
} from "../../services/api";
import { addToCart } from "../../redux/slices/cartSlice";
import { toggleWishlist } from "../../redux/slices/wishlistSlice";
import ProductCard from "../../components/ui/ProductCard";
import toast from "react-hot-toast";
import styles from "./ProductDetail.module.css";

const TABS = ["Description", "Nutrition Facts", "Reviews"];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeImg, setActiveImg] = useState(0);
  const [selFlavour, setSelFlavour] = useState("");
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("Description");

  const wishlistItems = useSelector((s) => s.wishlist.items);
  const isWishlisted = wishlistItems.some((i) => i.id === Number(id));

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

  const discount = product
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;
  const savings = product ? product.originalPrice - product.price : 0;
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : product?.rating;

  const ratingBars = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
    return { star, pct };
  });

  const thumbs = product ? [product.image, product.image, product.image] : [];

  if (loading)
    return (
      <div className={styles.pdLoading}>
        <div className={styles.pdSpinner} />
      </div>
    );
  if (!product)
    return (
      <div className={styles.pdLoading}>
        <p>Product not found.</p>
      </div>
    );

  return (
    <div className={styles.pdPage}>
      {/* Breadcrumb */}
      <div className={styles.pdBreadcrumb}>
        <Link to="/">Home</Link>
        <FiChevronRight size={12} />
        <Link to="/products">Products</Link>
        <FiChevronRight size={12} />
        <span>{product.title}</span>
      </div>

      {/* Top: Image + Info */}
      <div className={styles.pdTop}>
        {/* Images */}
        <div className={styles.pdImages}>
          <div className={styles.mainImgWrap}>
            <img
              src={thumbs[activeImg]}
              alt={product.title}
              className={styles.mainImg}
            />
            {discount > 0 && (
              <span className={styles.imgDiscountBadge}>{discount}% OFF</span>
            )}
          </div>
          <div className={styles.thumbRow}>
            {thumbs.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className={`${styles.thumb} ${activeImg === i ? styles.active : ""}`}
                onClick={() => setActiveImg(i)}
              />
            ))}
          </div>
          <button
            className={styles.shareBtn}
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied!");
            }}
          >
            <FiShare2 size={14} /> Share Product
          </button>
        </div>

        {/* Info */}
        <div className={styles.pdInfo}>
          <div className={styles.pdBrand}>{product.brand}</div>
          <h1 className={styles.pdTitle}>{product.title}</h1>

          <div className={styles.pdRatingRow}>
            <span className={styles.stars}>
              {"★".repeat(Math.round(product.rating))}
            </span>
            <span className={styles.ratNum}>{avgRating}</span>
            <span className={styles.ratCount}>
              ({product.reviews.toLocaleString()} reviews)
            </span>
          </div>

          <div className={styles.pdPriceRow}>
            <span className={styles.pdPrice}>
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className={styles.pdOg}>
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
            {discount > 0 && (
              <span className={styles.pdDisc}>{discount}% OFF</span>
            )}
          </div>
          {savings > 0 && (
            <p className={styles.pdSavings}>
              🎉 You save ₹{savings.toLocaleString()}!
            </p>
          )}

          <div className={styles.pdDivider} />

          {product.flavours?.length > 0 && (
            <>
              <div className={styles.optLabel}>
                Flavour: <strong>{selFlavour}</strong>
              </div>
              <div className={styles.flavourRow}>
                {product.flavours.map((fl) => (
                  <button
                    key={fl}
                    className={`${styles.fvPill} ${selFlavour === fl ? styles.active : ""}`}
                    onClick={() => setSelFlavour(fl)}
                  >
                    {fl}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className={styles.optLabel} style={{ marginTop: "14px" }}>
            Quantity
          </div>
          <div className={styles.qtyRow}>
            <div className={styles.qtyCtrl}>
              <button
                className={styles.qtyBtn}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <FiMinus size={14} />
              </button>
              <span className={styles.qtyVal}>{qty}</span>
              <button
                className={styles.qtyBtn}
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              >
                <FiPlus size={14} />
              </button>
            </div>
            {product.stock > 0 ? (
              <span className={styles.stockIn}>
                ✓ In Stock ({product.stock} left)
              </span>
            ) : (
              <span className={styles.stockOut}>✗ Out of Stock</span>
            )}
          </div>

          <div className={styles.pdBtnRow}>
            <button
              className={styles.btnCart}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <FiShoppingCart size={16} /> Add to Cart
            </button>
            <button
              className={styles.btnBuy}
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              <FiZap size={16} /> Buy Now
            </button>
            <button
              className={`${styles.btnWish} ${isWishlisted ? styles.active : ""}`}
              onClick={handleWishlist}
            >
              <FiHeart size={18} />
            </button>
          </div>

          <div className={styles.trustMini}>
            {[
              { icon: <FiTruck size={14} />, text: "Free Delivery above ₹999" },
              { icon: <FiShield size={14} />, text: "100% Authentic" },
              { icon: <FiRefreshCw size={14} />, text: "7-day Easy Returns" },
              { icon: <FiLock size={14} />, text: "Secure Payment" },
            ].map((t) => (
              <div className={styles.trustChip} key={t.text}>
                {t.icon} {t.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.pdTabsWrap}>
        <div className={styles.pdTabs}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`${styles.pdTab} ${activeTab === tab ? styles.active : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "Reviews"
                ? `Reviews (${reviews.length || product.reviews})`
                : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className={styles.pdTabContent}>
        {activeTab === "Description" && (
          <div className={styles.tabDesc}>
            <p className={styles.descText}>{product.description}</p>
            <div className={styles.detailGrid}>
              {[
                { k: "Brand", v: product.brand },
                { k: "Weight", v: product.weight },
                { k: "Category", v: product.category.replace(/-/g, " ") },
                { k: "In Stock", v: `${product.stock} units` },
              ].map(({ k, v }) => (
                <div className={styles.detailRow} key={k}>
                  <span className={styles.detailKey}>{k}</span>
                  <span className={styles.detailVal}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Nutrition Facts" && (
          <div className={styles.tabNutrition}>
            <div className={styles.nutritionCard}>
              <div className={styles.ncHeader}>
                Nutrition Facts — Per Serving
              </div>
              <div className={styles.ncSub}>Serving Size: 1 Scoop (31g)</div>
              {[
                { label: "Calories", value: "120 kcal" },
                { label: "Protein", value: "24g" },
                { label: "Carbs", value: "3g" },
                { label: "Fat", value: "1.5g" },
                { label: "Sugar", value: "1g" },
                { label: "Sodium", value: "60mg" },
                { label: "BCAA", value: "5.5g" },
                { label: "Glutamine", value: "4g" },
              ].map(({ label, value }) => (
                <div className={styles.ncRow} key={label}>
                  <span className={styles.ncLabel}>{label}</span>
                  <span className={styles.ncValue}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Reviews" && (
          <div className={styles.tabReviews}>
            <div className={styles.reviewSummary}>
              <div className={styles.rsBig}>
                <div className={styles.rsNum}>{avgRating}</div>
                <div className={styles.rsStars}>
                  {"★".repeat(Math.round(product.rating))}
                </div>
                <div className={styles.rsCount}>
                  {product.reviews.toLocaleString()} reviews
                </div>
              </div>
              <div className={styles.rsBars}>
                {ratingBars.map(({ star, pct }) => (
                  <div className={styles.rbRow} key={star}>
                    <span className={styles.rbLbl}>{star}★</span>
                    <div className={styles.rbTrack}>
                      <div
                        className={styles.rbFill}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className={styles.rbPct}>{pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div className={styles.reviewCard} key={rev.id}>
                  <div className={styles.rvTop}>
                    <div className={styles.rvAvatar}>{rev.name.charAt(0)}</div>
                    <div className={styles.rvMeta}>
                      <div className={styles.rvName}>{rev.name}</div>
                      <div className={styles.rvDate}>{rev.date}</div>
                    </div>
                    <div className={styles.rvStars}>
                      {"★".repeat(rev.rating)}
                      {"☆".repeat(5 - rev.rating)}
                    </div>
                  </div>
                  <p className={styles.rvText}>{rev.text}</p>
                </div>
              ))
            ) : (
              <div className={styles.noReviews}>
                <FiStar size={32} color="#ddd" />
                <p>No reviews yet for this product.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className={styles.pdRelated}>
          <div className={styles.relatedHeader}>
            <h2 className={styles.relatedTitle}>YOU MAY ALSO LIKE</h2>
            <Link to="/products" className={styles.seeAllLink}>
              View All →
            </Link>
          </div>
          <div className={styles.relatedGrid}>
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
