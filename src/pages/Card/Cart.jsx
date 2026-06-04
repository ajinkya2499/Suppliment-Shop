import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiTrash2, FiMinus, FiPlus, FiShoppingBag,
  FiLock, FiTruck, FiRefreshCw, FiShield, FiTag,
} from "react-icons/fi";
import { removeFromCart, updateQuantity, clearCart } from "../../redux/slices/cartSlice";
import toast from "react-hot-toast";
import styles from "./Cart.module.css";   // ← CSS Module import

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
      <div className={styles.cartEmpty}>
        <div className={styles.emptyIcon}>🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/products" className={styles.emptyShopBtn}>
          <FiShoppingBag size={16}/> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>

      {/* Breadcrumb */}
      <div className={styles.cartBreadcrumb}>
        <Link to="/">Home</Link> ›
        <Link to="/products">Products</Link> ›
        <span>Cart ({totalItems} items)</span>
      </div>

      {/* Steps */}
      <div className={styles.stepsBar}>
        {STEPS.map((step, i) => (
          <div className={styles.stepGroup} key={step}>
            <div className={`${styles.stepDot} ${i === 0 ? styles.active : styles.gray}`}>
              {i === 0 ? "✓" : i + 1}
            </div>
            <div className={`${styles.stepLbl} ${i === 0 ? styles.active : ""}`}>{step}</div>
            {i < STEPS.length - 1 && <div className={styles.stepLine}/>}
          </div>
        ))}
      </div>

      <div className={styles.cartBody}>

        {/* ── LEFT: Cart items ── */}
        <div className={styles.cartLeft}>
          <div className={styles.cartHeaderRow}>
            <h1 className={styles.cartTitle}>MY CART ({totalItems} items)</h1>
            <button className={styles.clearCartBtn} onClick={handleClearCart}>
              <FiTrash2 size={13}/> Clear Cart
            </button>
          </div>

          {items.map((item) => (
            <div className={styles.cartItem} key={item.id}>
              <Link to={`/products/${item.id}`} className={styles.ciImgLink}>
                <img src={item.image} alt={item.title} className={styles.ciImg}/>
              </Link>

              <div className={styles.ciInfo}>
                <div className={styles.ciBrand}>{item.brand}</div>
                <Link to={`/products/${item.id}`} className={styles.ciName}>
                  {item.title}
                </Link>
                <div className={styles.ciMeta}>
                  {item.weight && <span>Weight: {item.weight}</span>}
                </div>
                {item.stock <= 5 && (
                  <div className={styles.ciLowStock}>
                    ⚠️ Only {item.stock} left!
                  </div>
                )}
                <div className={styles.ciActions}>
                  <div className={styles.qtyCtrl}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => handleQty(item.id, item.quantity - 1)}
                    >
                      <FiMinus size={12}/>
                    </button>
                    <span className={styles.qtyVal}>{item.quantity}</span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => handleQty(item.id, Math.min(item.stock, item.quantity + 1))}
                    >
                      <FiPlus size={12}/>
                    </button>
                  </div>
                  <button
                    className={styles.ciRemoveBtn}
                    onClick={() => handleRemove(item.id, item.title)}
                  >
                    <FiTrash2 size={13}/> Remove
                  </button>
                </div>
              </div>

              <div className={styles.ciPriceCol}>
                <div className={styles.ciTotalPrice}>
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>
                <div className={styles.ciUnitPrice}>
                  ₹{item.price.toLocaleString()} × {item.quantity}
                </div>
                {item.originalPrice > item.price && (
                  <div className={styles.ciSaved}>
                    Save ₹{((item.originalPrice - item.price) * item.quantity).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── RIGHT: Summary ── */}
        <div className={styles.cartRight}>

          {/* Coupon */}
          <div className={styles.couponBox}>
            <div className={styles.couponLabel}>
              <FiTag size={14}/> Apply Coupon
            </div>

            {appliedCoupon ? (
              <div className={styles.couponApplied}>
                <span className={styles.couponCodeTag}>{appliedCoupon}</span>
                <span className={styles.couponSuccess}>
                  {COUPONS[appliedCoupon] * 100}% off applied!
                </span>
                <button className={styles.couponRemove} onClick={handleRemoveCoupon}>✕</button>
              </div>
            ) : (
              <>
                <div className={styles.couponRow}>
                  <input
                    className={styles.couponInput}
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  />
                  <button className={styles.couponBtn} onClick={handleApplyCoupon}>
                    Apply
                  </button>
                </div>
                {couponError && (
                  <div className={styles.couponError}>{couponError}</div>
                )}
                <div className={styles.couponHints}>
                  Try: <span onClick={() => setCouponCode("MUSCLE20")}>MUSCLE20</span>,{" "}
                  <span onClick={() => setCouponCode("FUEL10")}>FUEL10</span>,{" "}
                  <span onClick={() => setCouponCode("FIRST15")}>FIRST15</span>
                </div>
              </>
            )}
          </div>

          {/* Order summary */}
          <div className={styles.orderSummary}>
            <div className={styles.osTitle}>ORDER SUMMARY</div>

            <div className={styles.osRow}>
              <span>Subtotal ({totalItems} items)</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className={`${styles.osRow} ${styles.green}`}>
              <span>Product Discount</span>
              <span>− ₹{itemDiscount.toLocaleString()}</span>
            </div>
            {couponDiscount > 0 && (
              <div className={`${styles.osRow} ${styles.green}`}>
                <span>Coupon ({appliedCoupon})</span>
                <span>− ₹{couponDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className={styles.osRow}>
              <span>Delivery</span>
              <span className={delivery === 0 ? styles.green : ""}>
                {delivery === 0 ? "FREE" : `₹${delivery}`}
              </span>
            </div>

            <div className={styles.osDivider}/>

            <div className={`${styles.osRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>

            {totalSavings > 0 && (
              <div className={styles.osSavings}>
                🎉 You're saving ₹{totalSavings.toLocaleString()} on this order!
              </div>
            )}
          </div>

          {/* Checkout button */}
          <button className={styles.checkoutBtn} onClick={handleCheckout}>
            Proceed to Checkout →
          </button>

          <div className={styles.secureNote}>
            <FiLock size={12}/> Secure checkout via Razorpay
          </div>

          {/* Trust icons */}
          <div className={styles.trustChips}>
            {[
              { icon: <FiShield    size={16}/>, text: "Authentic" },
              { icon: <FiRefreshCw size={16}/>, text: "Returns"   },
              { icon: <FiTruck     size={16}/>, text: "Free Ship" },
            ].map((t) => (
              <div className={styles.trustChip} key={t.text}>
                {t.icon}
                <span>{t.text}</span>
              </div>
            ))}
          </div>

          {/* Continue shopping */}
          <Link to="/products" className={styles.continueLink}>
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;