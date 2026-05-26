import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { addToCart } from "../../redux/slices/cartSlice";
import { toggleWishlist } from "../../redux/slices/wishlistSlice";
import toast from "react-hot-toast";
import "./ProductCard.css";

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
    <Link to={`/products/${product.id}`} className="prod-card">
      <div className="prod-img-wrap">
        <img src={product.image} alt={product.title} className="prod-img" />
        <button
          className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
          onClick={handleWishlist}
        >
          <FiHeart size={16} />
        </button>
        {discount > 0 && (
          <span className="discount-badge">{discount}% OFF</span>
        )}
      </div>
      <div className="prod-body">
        <div className="prod-brand">{product.brand}</div>
        <div className="prod-name">{product.title}</div>
        <div className="prod-price-row">
          <span className="prod-price">₹{product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="prod-og">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        <div className="prod-rating">
          <span className="stars">{"★".repeat(Math.round(product.rating))}</span>
          <span>{product.rating} ({product.reviews.toLocaleString()})</span>
        </div>
        <button className="prod-cart-btn" onClick={handleAddToCart}>
          <FiShoppingCart size={14} />
          Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;