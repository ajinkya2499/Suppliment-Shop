import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FiShoppingCart, FiHeart, FiUser, FiSearch } from "react-icons/fi";
import { useState } from "react";
import { logout } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";
import styles from "./Navbar.module.css";

const categories = [
  { name: "All Products", slug: "" },
  { name: "Whey Protein", slug: "whey-protein" },
  { name: "Mass Gainer", slug: "mass-gainer" },
  { name: "Creatine", slug: "creatine" },
  { name: "Pre-Workout", slug: "pre-workout" },
  { name: "Vitamins", slug: "vitamins" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const location = useLocation();
  const currentCat = new URLSearchParams(location.search).get("category");

  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${search.trim()}`);
      setSearch("");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out!");
    navigate("/");
  };

  return (
    <header className={styles.navbarWrapper}>
      {/* Top announcement bar */}
      <div className={styles.navbarTopbar}>
        🔥 Use code MUSCLE20 for 20% off your first order · Free shipping above
        ₹999
      </div>

      {/* Main nav */}
      <nav className={styles.navbarMain}>
        {/* Logo */}
        <Link to="/" className={styles.navbarLogo}>
          FUEL<span>FIT</span>
        </Link>

        {/* Search */}
        <form className={styles.navbarSearch} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search proteins, supplements, brands…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">
            <FiSearch size={16} />
          </button>
        </form>

        {/* Actions */}
        <div className={styles.navbarActions}>
          {isLoggedIn ? (
            <div className={styles.navUserMenu}>
              <button className={styles.navBtn}>
                <FiUser size={20} />
                <span>{user?.name?.split(" ")[0]}</span>
              </button>
              <div className={styles.userDropdown}>
                <Link to="/profile">My Profile</Link>
                <Link to="/orders">My Orders</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className={styles.navBtn}>
              <FiUser size={20} />
              <span>Login</span>
            </Link>
          )}

          <div className={styles.navDivider} />

          <Link to="/wishlist" className={styles.navBtn}>
            <FiHeart size={20} />
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <span className={styles.navBadge}>{wishlistCount}</span>
            )}
          </Link>

          <Link to="/cart" className={styles.navBtn}>
            <FiShoppingCart size={20} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className={styles.navBadge}>{cartCount}</span>
            )}
          </Link>
        </div>
      </nav>

      {/* Category bar */}
      <div className={styles.navbarCats}>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={cat.slug ? `/products?category=${cat.slug}` : "/products"}
            className={`${styles.catLink} ${
              currentCat === cat.slug ||
              (!currentCat && !cat.slug && location.pathname === "/products")
                ? styles.active
                : ""
            }`}
          >
            {cat.name}
          </Link>
        ))}
        <Link
          to="/products?deals=true"
          className={`${styles.catLink} ${styles.dealsLink}`}
        >
          🔥 Deals
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
