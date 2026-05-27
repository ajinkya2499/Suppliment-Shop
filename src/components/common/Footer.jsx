import { useState } from "react";
import { Link }     from "react-router-dom";
import {
  FiInstagram, FiFacebook, FiTwitter, FiYoutube, FiMail,
} from "react-icons/fi";
import toast from "react-hot-toast";
import "./Footer.css";

const LINKS = {
  Products: [
    { label: "Whey Protein", to: "/products?category=whey-protein" },
    { label: "Mass Gainer",  to: "/products?category=mass-gainer"  },
    { label: "Pre-Workout",  to: "/products?category=pre-workout"  },
    { label: "Creatine",     to: "/products?category=creatine"     },
    { label: "Vitamins",     to: "/products?category=vitamins"     },
    { label: "All Products", to: "/products"                       },
  ],
  Company: [
    { label: "About Us",  to: "/" },
    { label: "Blog",      to: "/" },
    { label: "Careers",   to: "/" },
    { label: "Press",     to: "/" },
    { label: "Contact Us",to: "/" },
  ],
  Support: [
    { label: "Track Order",     to: "/" },
    { label: "Returns Policy",  to: "/" },
    { label: "FAQ",             to: "/" },
    { label: "Privacy Policy",  to: "/" },
    { label: "Terms of Service",to: "/" },
  ],
};

const SOCIALS = [
  { icon: <FiInstagram size={16}/>, label: "Instagram" },
  { icon: <FiFacebook  size={16}/>, label: "Facebook"  },
  { icon: <FiTwitter   size={16}/>, label: "Twitter"   },
  { icon: <FiYoutube   size={16}/>, label: "YouTube"   },
];

const Footer = () => {
  const [email,     setEmail]     = useState("");
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
    <footer className="site-footer">

      {/* ── Newsletter bar ── */}
      <div className="ft-newsletter">
        <div className="ft-nl-text">
          <h3 className="ft-nl-title">GET 10% OFF YOUR FIRST ORDER</h3>
          <p className="ft-nl-sub">
            Subscribe for deals, fitness tips &amp; new arrivals
          </p>
        </div>
        {subscribed ? (
          <div className="ft-nl-success">
            ✅ You're subscribed! Check your inbox.
          </div>
        ) : (
          <form className="ft-nl-form" onSubmit={handleSubscribe}>
            <div className="ft-nl-input-wrap">
              <FiMail className="ft-nl-icon"/>
              <input
                className="ft-nl-input"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="ft-nl-btn" type="submit">
              Subscribe
            </button>
          </form>
        )}
      </div>

      {/* ── Main grid ── */}
      <div className="ft-main">

        {/* Brand column */}
        <div className="ft-brand">
          <Link to="/" className="ft-logo">FUEL<span>FIT</span></Link>
          <p className="ft-desc">
            Premium proteins &amp; supplements for athletes who refuse to
            compromise. 100% authentic products, fast delivery across India.
          </p>
          <div className="ft-socials">
            {SOCIALS.map((s) => (
              <button
                key={s.label}
                className="ft-social-btn"
                title={s.label}
                onClick={() => toast(`${s.label} coming soon!`)}
              >
                {s.icon}
              </button>
            ))}
          </div>

          {/* Trust badges */}
          <div className="ft-trust">
            <div className="ft-trust-badge">✅ 100% Authentic</div>
            <div className="ft-trust-badge">🚚 Free Delivery</div>
            <div className="ft-trust-badge">🔄 Easy Returns</div>
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([title, links]) => (
          <div className="ft-col" key={title}>
            <h4 className="ft-col-title">{title}</h4>
            {links.map((l) => (
              <Link to={l.to} className="ft-link" key={l.label}>
                {l.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* ── Bottom bar ── */}
      <div className="ft-bottom">
        <p className="ft-copy">
          © 2025 <span>FuelFit</span>. All rights reserved.
          Made with 💪 in India.
        </p>

        <div className="ft-payment">
          <span className="ft-pay-label">We accept:</span>
          {["Razorpay", "UPI", "Visa", "Mastercard", "COD"].map((p) => (
            <div className="ft-pay-badge" key={p}>{p}</div>
          ))}
        </div>
      </div>

    </footer>
  );
};

export default Footer;