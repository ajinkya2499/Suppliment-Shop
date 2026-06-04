import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiYoutube,
  FiMail,
} from "react-icons/fi";
import toast from "react-hot-toast";
import styles from "./Footer.module.css";

const LINKS = {
  Products: [
    { label: "Whey Protein", to: "/products?category=whey-protein" },
    { label: "Mass Gainer", to: "/products?category=mass-gainer" },
    { label: "Pre-Workout", to: "/products?category=pre-workout" },
    { label: "Creatine", to: "/products?category=creatine" },
    { label: "Vitamins", to: "/products?category=vitamins" },
    { label: "All Products", to: "/products" },
  ],
  Company: [
    { label: "About Us", to: "/" },
    { label: "Blog", to: "/" },
    { label: "Careers", to: "/" },
    { label: "Press", to: "/" },
    { label: "Contact Us", to: "/" },
  ],
  Support: [
    { label: "Track Order", to: "/" },
    { label: "Returns Policy", to: "/" },
    { label: "FAQ", to: "/" },
    { label: "Privacy Policy", to: "/" },
    { label: "Terms of Service", to: "/" },
  ],
};

const SOCIALS = [
  { icon: <FiInstagram size={16} />, label: "Instagram" },
  { icon: <FiFacebook size={16} />, label: "Facebook" },
  { icon: <FiTwitter size={16} />, label: "Twitter" },
  { icon: <FiYoutube size={16} />, label: "YouTube" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Enter a valid email address");
      return;
    }
    setSubscribed(true);
    setEmail("");
    toast.success("🎉 Subscribed! Check your inbox for 10% off.");
  };

  return (
    <footer className={styles.siteFooter}>
      {/* ── Newsletter bar ── */}
      <div className={styles.ftNewsletter}>
        <div className={styles.ftNlText}>
          <h3 className={styles.ftNlTitle}>GET 10% OFF YOUR FIRST ORDER</h3>
          <p className={styles.ftNlSub}>
            Subscribe for deals, fitness tips &amp; new arrivals
          </p>
        </div>
        {subscribed ? (
          <div className={styles.ftNlSuccess}>
            ✅ You're subscribed! Check your inbox.
          </div>
        ) : (
          <form className={styles.ftNlForm} onSubmit={handleSubscribe}>
            <div className={styles.ftNlInputWrap}>
              <FiMail className={styles.ftNlIcon} />
              <input
                className={styles.ftNlInput}
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className={styles.ftNlBtn} type="submit">
              Subscribe
            </button>
          </form>
        )}
      </div>

      {/* ── Main grid ── */}
      <div className={styles.ftMain}>
        {/* Brand column */}
        <div className={styles.ftBrand}>
          <Link to="/" className={styles.ftLogo}>
            FUEL<span>FIT</span>
          </Link>
          <p className={styles.ftDesc}>
            Premium proteins &amp; supplements for athletes who refuse to
            compromise. 100% authentic products, fast delivery across India.
          </p>
          <div className={styles.ftSocials}>
            {SOCIALS.map((s) => (
              <button
                key={s.label}
                className={styles.ftSocialBtn}
                title={s.label}
                onClick={() => toast(`${s.label} coming soon!`)}
              >
                {s.icon}
              </button>
            ))}
          </div>

          {/* Trust badges */}
          <div className={styles.ftTrust}>
            <div className={styles.ftTrustBadge}>✅ 100% Authentic</div>
            <div className={styles.ftTrustBadge}>🚚 Free Delivery</div>
            <div className={styles.ftTrustBadge}>🔄 Easy Returns</div>
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([title, links]) => (
          <div className={styles.ftCol} key={title}>
            <h4 className={styles.ftColTitle}>{title}</h4>
            {links.map((l) => (
              <Link to={l.to} className={styles.ftLink} key={l.label}>
                {l.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* ── Bottom bar ── */}
      <div className={styles.ftBottom}>
        <p className={styles.ftCopy}>
          © 2025 <span>FuelFit</span>. All rights reserved. Made with 💪 in
          India.
        </p>

        <div className={styles.ftPayment}>
          <span className={styles.ftPayLabel}>We accept:</span>
          {["Razorpay", "UPI", "Visa", "Mastercard", "COD"].map((p) => (
            <div className={styles.ftPayBadge} key={p}>
              {p}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
