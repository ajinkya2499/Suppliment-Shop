import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiTrash2, FiMinus, FiPlus, FiShoppingBag,
  FiLock, FiTruck, FiRefreshCw, FiShield, FiTag,
} from "react-icons/fi";
import { removeFromCart, updateQuantity, clearCart } from "../../redux/slices/cartSlice";
import toast from "react-hot-toast";
import "./Cart.css";

/* ── valid coupons ── */
const COUPONS = {
  MUSCLE20: 0.20,
  FUEL10:   0.10,
  FIRST15:  0.15,
};

const STEPS = ["Cart", "Address", "Payment", "Confirm"];

const Cart = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { items } = useSelector((s) => s.cart);

  const [couponCode,    setCouponCode]    = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError,   setCouponError]   = useState("");

  /* ── calculations ── */
  const subtotal     = items.reduce((s, i) => s + i.originalPrice * i.quantity, 0);
  const itemDiscount = items.reduce((s, i) => s + (i.originalPrice - i.price) * i.quantity, 0);
  const afterDiscount = subtotal - itemDiscount;
  const couponDiscount = appliedCoupon
    ? Math.round(afterDiscount * COUPONS[appliedCoupon])
    : 0;
  const delivery     = afterDiscount - couponDiscount >= 999 ? 0 : 99;
  const total        = afterDiscount - couponDiscount + delivery;
  const totalSavings = itemDiscount + couponDiscount + (delivery === 0 ? 99 : 0);
  const totalItems   = items.reduce((s, i) => s + i.quantity, 0);

  /* ── handlers ── */
  const handleQty = (id, qty) => {
    if (qty < 1) return;
    dispatch(updateQuantity({ id, quantity: qty }));
  };

  const handleRemove = (id, name) => {
    dispatch(removeFromCart(id));
    toast(`${name.slice(0, 22)}… removed`);
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast("Cart cleared");
  };

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (COUPONS[code]) {
      setAppliedCoupon(code);
      setCouponError("");
      toast.success(`Coupon ${code} applied! ${COUPONS[code] * 100}% off`);
    } else {
      setCouponError("Invalid coupon code");
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    toast("Coupon removed");
  };

  const handleCheckout = () => {
    toast.success("Checkout coming soon! (after Login page is built)");
  };

  /* ── empty state ── */
  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="empty-shop-btn">
          <FiShoppingBag size={16}/> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">

      {/* Breadcrumb */}
      <div className="cart-breadcrumb">
        <Link to="/">Home</Link> ›
        <Link to="/products">Products</Link> ›
        <span>Cart ({totalItems} items)</span>
      </div>

      {/* Steps */}
      <div className="steps-bar">
        {STEPS.map((step, i) => (
          <div className="step-group" key={step}>
            <div className={`step-dot ${i === 0 ? "active" : "gray"}`}>
              {i === 0 ? "✓" : i + 1}
            </div>
            <div className={`step-lbl ${i === 0 ? "active" : ""}`}>{step}</div>
            {i < STEPS.length - 1 && <div className="step-line"/>}
          </div>
        ))}
      </div>

      <div className="cart-body">

        {/* ── LEFT: Cart items ── */}
        <div className="cart-left">
          <div className="cart-header-row">
            <h1 className="cart-title">MY CART ({totalItems} items)</h1>
            <button className="clear-cart-btn" onClick={handleClearCart}>
              <FiTrash2 size={13}/> Clear Cart
            </button>
          </div>

          {items.map((item) => (
            <div className="cart-item" key={item.id}>
              <Link to={`/products/${item.id}`} className="ci-img-link">
                <img src={item.image} alt={item.title} className="ci-img"/>
              </Link>

              <div className="ci-info">
                <div className="ci-brand">{item.brand}</div>
                <Link to={`/products/${item.id}`} className="ci-name">
                  {item.title}
                </Link>
                <div className="ci-meta">
                  {item.weight && <span>Weight: {item.weight}</span>}
                </div>
                {item.stock <= 5 && (
                  <div className="ci-low-stock">
                    ⚠️ Only {item.stock} left!
                  </div>
                )}
                <div className="ci-actions">
                  <div className="qty-ctrl">
                    <button
                      className="qty-btn"
                      onClick={() => handleQty(item.id, item.quantity - 1)}
                    >
                      <FiMinus size={12}/>
                    </button>
                    <span className="qty-val">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => handleQty(item.id, Math.min(item.stock, item.quantity + 1))}
                    >
                      <FiPlus size={12}/>
                    </button>
                  </div>
                  <button
                    className="ci-remove-btn"
                    onClick={() => handleRemove(item.id, item.title)}
                  >
                    <FiTrash2 size={13}/> Remove
                  </button>
                </div>
              </div>

              <div className="ci-price-col">
                <div className="ci-total-price">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>
                <div className="ci-unit-price">
                  ₹{item.price.toLocaleString()} × {item.quantity}
                </div>
                {item.originalPrice > item.price && (
                  <div className="ci-saved">
                    Save ₹{((item.originalPrice - item.price) * item.quantity).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── RIGHT: Summary ── */}
        <div className="cart-right">

          {/* Coupon */}
          <div className="coupon-box">
            <div className="coupon-label">
              <FiTag size={14}/> Apply Coupon
            </div>

            {appliedCoupon ? (
              <div className="coupon-applied">
                <span className="coupon-code-tag">{appliedCoupon}</span>
                <span className="coupon-success">
                  {COUPONS[appliedCoupon] * 100}% off applied!
                </span>
                <button className="coupon-remove" onClick={handleRemoveCoupon}>✕</button>
              </div>
            ) : (
              <>
                <div className="coupon-row">
                  <input
                    className="coupon-input"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  />
                  <button className="coupon-btn" onClick={handleApplyCoupon}>
                    Apply
                  </button>
                </div>
                {couponError && (
                  <div className="coupon-error">{couponError}</div>
                )}
                <div className="coupon-hints">
                  Try: <span onClick={() => setCouponCode("MUSCLE20")}>MUSCLE20</span>,{" "}
                  <span onClick={() => setCouponCode("FUEL10")}>FUEL10</span>,{" "}
                  <span onClick={() => setCouponCode("FIRST15")}>FIRST15</span>
                </div>
              </>
            )}
          </div>

          {/* Order summary */}
          <div className="order-summary">
            <div className="os-title">ORDER SUMMARY</div>

            <div className="os-row">
              <span>Subtotal ({totalItems} items)</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="os-row green">
              <span>Product Discount</span>
              <span>− ₹{itemDiscount.toLocaleString()}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="os-row green">
                <span>Coupon ({appliedCoupon})</span>
                <span>− ₹{couponDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="os-row">
              <span>Delivery</span>
              <span className={delivery === 0 ? "green" : ""}>
                {delivery === 0 ? "FREE" : `₹${delivery}`}
              </span>
            </div>

            <div className="os-divider"/>

            <div className="os-row total-row">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            {totalSavings > 0 && (
              <div className="os-savings">
                🎉 You're saving ₹{totalSavings.toLocaleString()} on this order!
              </div>
            )}
          </div>

          {/* Checkout button */}
          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout →
          </button>

          <div className="secure-note">
            <FiLock size={12}/> Secure checkout via Razorpay
          </div>

          {/* Trust icons */}
          <div className="trust-chips">
            {[
              { icon: <FiShield    size={16}/>, text: "Authentic" },
              { icon: <FiRefreshCw size={16}/>, text: "Returns"   },
              { icon: <FiTruck     size={16}/>, text: "Free Ship" },
            ].map((t) => (
              <div className="trust-chip" key={t.text}>
                {t.icon}
                <span>{t.text}</span>
              </div>
            ))}
          </div>

          {/* Continue shopping */}
          <Link to="/products" className="continue-link">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;