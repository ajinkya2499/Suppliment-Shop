import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { addToCart } from "../../redux/slices/cartSlice";
import { toggleWishlist } from "../../redux/slices/wishlistSlice";
import toast from "react-hot-toast";
import styles from "./ProductCard.module.css";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((s) => s.wishlist.items);
  const isWishlisted = wishlistItems.some((i) => i.id === product.id);

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(product));
    toast.success(`${product.title.slice(0, 20)}... added to cart!`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
    toast(isWishlisted ? "Removed from wishlist" : "Added to wishlist ❤️");
  };

  return (
    <Link to={`/products/${product.id}`} className={styles.prodCard}>
      <div className={styles.prodImgWrap}>
        <img
          src={product.image}
          alt={product.title}
          className={styles.prodImg}
        />

        <button
          className={`${styles.wishlistBtn} ${
            isWishlisted ? styles.active : ""
          }`}
          onClick={handleWishlist}
        >
          <FiHeart size={16} />
        </button>

        {discount > 0 && (
          <span className={styles.discountBadge}>
            {discount}% OFF
          </span>
        )}
      </div>

      <div className={styles.prodBody}>
        <div className={styles.prodBrand}>{product.brand}</div>

        <div className={styles.prodName}>
          {product.title}
        </div>

        <div className={styles.prodPriceRow}>
          <span className={styles.prodPrice}>
            ₹{product.price.toLocaleString()}
          </span>

          {product.originalPrice > product.price && (
            <span className={styles.prodOg}>
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className={styles.prodRating}>
          <span className={styles.stars}>
            {"★".repeat(Math.round(product.rating))}
          </span>

          <span>
            {product.rating} ({product.reviews.toLocaleString()})
          </span>
        </div>

        <button
          className={styles.prodCartBtn}
          onClick={handleAddToCart}
        >
          <FiShoppingCart size={14} />
          Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;