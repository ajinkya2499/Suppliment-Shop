import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiPhone,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";
import { loginUser, registerUser } from "../../services/api";
import { loginSuccess } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";
import styles from "./Login.module.css";

/* ────────────────────────────────────────────
   Helpers
──────────────────────────────────────────── */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getPasswordStrength = (pw) => {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: "", color: "" },
    { label: "Weak", color: "#e53935" },
    { label: "Fair", color: "#fb8c00" },
    { label: "Good", color: "#43a047" },
    { label: "Strong", color: "#1b5e20" },
  ];
  return { score, ...map[score] };
};

/* ────────────────────────────────────────────
   Component
──────────────────────────────────────────── */
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const defaultTab = location.state?.tab || "login";
  const [tab, setTab] = useState(defaultTab); // "login" | "register"

  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /* login fields */
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  /* register fields */
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);

  const pwStrength = getPasswordStrength(regPassword);

  /* ── Validation ── */
  const validateLogin = () => {
    const e = {};
    if (!loginEmail) e.loginEmail = "Email is required";
    else if (!emailRegex.test(loginEmail)) e.loginEmail = "Enter a valid email";
    if (!loginPassword) e.loginPassword = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateRegister = () => {
    const e = {};
    if (!regName.trim()) e.regName = "Full name is required";
    if (!regEmail) e.regEmail = "Email is required";
    else if (!emailRegex.test(regEmail)) e.regEmail = "Enter a valid email";
    if (regPhone && regPhone.length !== 10)
      e.regPhone = "Enter valid 10-digit number";
    if (!regPassword) e.regPassword = "Password is required";
    else if (regPassword.length < 8) e.regPassword = "Minimum 8 characters";
    if (regPassword !== regConfirm) e.regConfirm = "Passwords do not match";
    if (!agreed) e.agreed = "Please accept terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Submit handlers ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoading(true);
    try {
      const res = await loginUser({
        email: loginEmail,
        password: loginPassword,
      });
      dispatch(loginSuccess(res.data));
      toast.success(`Welcome back, ${res.data.user.name}! 💪`);
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    } catch {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;
    setLoading(true);
    try {
      const res = await registerUser({
        name: regName,
        email: regEmail,
        phone: regPhone,
      });
      dispatch(loginSuccess(res.data));
      toast.success(`Account created! Welcome, ${res.data.user.name}! 🎉`);
      navigate("/");
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Render ── */
  return (
    <div className={styles.authPage}>
      {/* ── Left panel ── */}
      <div className={styles.authLeft}>
        <Link to="/" className={styles.authLogo}>
          FUEL<span>FIT</span>
        </Link>

        <div className={styles.authLeftContent}>
          <h2 className={styles.authHeadline}>
            YOUR GAINS
            <br />
            START <span>HERE</span>
          </h2>
          <p className={styles.authSub}>
            Join 50,000+ athletes who trust FuelFit for premium proteins and
            supplements delivered to their door.
          </p>
          <div className={styles.authStats}>
            {[
              { num: "500+", lbl: "Products" },
              { num: "50K+", lbl: "Members" },
              { num: "4.8★", lbl: "Rating" },
            ].map((s) => (
              <div className={styles.authStat} key={s.lbl}>
                <div className={styles.asNum}>{s.num}</div>
                <div className={styles.asLbl}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.authImg}>
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=700"
            alt="gym"
          />
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className={styles.authRight}>
        {/* Tabs */}
        <div className={styles.authTabs}>
          <button
            className={`${styles.authTab} ${tab === "login" ? styles.authTabActive : ""}`}
            onClick={() => {
              setTab("login");
              setErrors({});
            }}
          >
            Login
          </button>
          <button
            className={`${styles.authTab} ${tab === "register" ? styles.authTabActive : ""}`}
            onClick={() => {
              setTab("register");
              setErrors({});
            }}
          >
            Register
          </button>
        </div>

        {/* ══ LOGIN FORM ══ */}
        {tab === "login" && (
          <form className={styles.authForm} onSubmit={handleLogin} noValidate>
            <h1 className={styles.formTitle}>WELCOME BACK</h1>
            <p className={styles.formSub}>
              Login to access your orders and wishlist
            </p>

            {/* Email */}
            <div className={styles.formGroup}>
              <label className={styles.fgLabel}>EMAIL ADDRESS</label>
              <div className={styles.fgWrap}>
                <FiMail className={styles.fgIcon} />
                <input
                  className={`${styles.fgInput} ${errors.loginEmail ? styles.fgInputError : ""}`}
                  type="email"
                  placeholder="rahul@example.com"
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    if (errors.loginEmail)
                      setErrors((p) => ({ ...p, loginEmail: "" }));
                  }}
                />
              </div>
              {errors.loginEmail && (
                <span className={styles.fgError}>
                  <FiAlertCircle size={11} /> {errors.loginEmail}
                </span>
              )}
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <label className={styles.fgLabel}>PASSWORD</label>
              <div className={styles.fgWrap}>
                <FiLock className={styles.fgIcon} />
                <input
                  className={`${styles.fgInput} ${errors.loginPassword ? styles.fgInputError : ""}`}
                  type={showPw ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if (errors.loginPassword)
                      setErrors((p) => ({ ...p, loginPassword: "" }));
                  }}
                />
                <button
                  type="button"
                  className={styles.fgEye}
                  onClick={() => setShowPw((p) => !p)}
                >
                  {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
              {errors.loginPassword && (
                <span className={styles.fgError}>
                  <FiAlertCircle size={11} /> {errors.loginPassword}
                </span>
              )}
            </div>

            <button type="button" className={styles.forgotLink}>
              Forgot Password?
            </button>

            <button className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <span className={styles.btnSpinner} />
              ) : (
                "Login to FuelFit"
              )}
            </button>

            <div className={styles.orDivider}>
              <span />
              <p>OR</p>
              <span />
            </div>

            <button
              type="button"
              className={styles.googleBtn}
              onClick={() => toast("Google login coming soon!")}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              Continue with Google
            </button>

            <p className={styles.switchText}>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setTab("register");
                  setErrors({});
                }}
              >
                Register now →
              </button>
            </p>
          </form>
        )}

        {/* ══ REGISTER FORM ══ */}
        {tab === "register" && (
          <form
            className={styles.authForm}
            onSubmit={handleRegister}
            noValidate
          >
            <h1 className={styles.formTitle}>CREATE ACCOUNT</h1>
            <p className={styles.formSub}>
              Join FuelFit and start your fitness journey
            </p>

            {/* Name */}
            <div className={styles.formGroup}>
              <label className={styles.fgLabel}>FULL NAME</label>
              <div className={styles.fgWrap}>
                <FiUser className={styles.fgIcon} />
                <input
                  className={`${styles.fgInput} ${errors.regName ? styles.fgInputError : ""}`}
                  type="text"
                  placeholder="Enter you name"
                  value={regName}
                  onChange={(e) => {
                    setRegName(e.target.value);
                    if (errors.regName)
                      setErrors((p) => ({ ...p, regName: "" }));
                  }}
                />
              </div>
              {errors.regName && (
                <span className={styles.fgError}>
                  <FiAlertCircle size={11} /> {errors.regName}
                </span>
              )}
            </div>

            {/* Email + Phone row */}
            <div className={styles.twoCol}>
              <div className={styles.formGroup}>
                <label className={styles.fgLabel}>EMAIL</label>
                <div className={styles.fgWrap}>
                  <FiMail className={styles.fgIcon} />
                  <input
                    className={`${styles.fgInput} ${errors.regEmail ? styles.fgInputError : ""}`}
                    type="email"
                    placeholder="you@example.com"
                    value={regEmail}
                    onChange={(e) => {
                      setRegEmail(e.target.value);
                      if (errors.regEmail)
                        setErrors((p) => ({ ...p, regEmail: "" }));
                    }}
                  />
                </div>
                {errors.regEmail && (
                  <span className={styles.fgError}>
                    <FiAlertCircle size={11} /> {errors.regEmail}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.fgLabel}>PHONE (optional)</label>
                <div className={styles.fgWrap}>
                  <FiPhone className={styles.fgIcon} />
                  <input
                    className={`${styles.fgInput} ${errors.regPhone ? styles.fgInputError : ""}`}
                    type="tel"
                    placeholder="Enter the 10 Digit Mobile Number"
                    value={regPhone}
                    onChange={(e) => {
                      setRegPhone(
                        e.target.value.replace(/\D/, "").slice(0, 10),
                      );
                      if (errors.regPhone)
                        setErrors((p) => ({ ...p, regPhone: "" }));
                    }}
                  />
                </div>
                {errors.regPhone && (
                  <span className={styles.fgError}>
                    <FiAlertCircle size={11} /> {errors.regPhone}
                  </span>
                )}
              </div>
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <label className={styles.fgLabel}>PASSWORD</label>
              <div className={styles.fgWrap}>
                <FiLock className={styles.fgIcon} />
                <input
                  className={`${styles.fgInput} ${errors.regPassword ? styles.fgInputError : ""}`}
                  type={showPw ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={regPassword}
                  onChange={(e) => {
                    setRegPassword(e.target.value);
                    if (errors.regPassword)
                      setErrors((p) => ({ ...p, regPassword: "" }));
                  }}
                />
                <button
                  type="button"
                  className={styles.fgEye}
                  onClick={() => setShowPw((p) => !p)}
                >
                  {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
              {regPassword && (
                <div className={styles.strengthWrap}>
                  <div className={styles.strengthBar}>
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className={styles.strengthSeg}
                        style={{
                          background:
                            n <= pwStrength.score ? pwStrength.color : "#eee",
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ color: pwStrength.color }}>
                    {pwStrength.label}
                  </span>
                </div>
              )}
              {errors.regPassword && (
                <span className={styles.fgError}>
                  <FiAlertCircle size={11} /> {errors.regPassword}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div className={styles.formGroup}>
              <label className={styles.fgLabel}>CONFIRM PASSWORD</label>
              <div className={styles.fgWrap}>
                <FiLock className={styles.fgIcon} />
                <input
                  className={`${styles.fgInput} ${errors.regConfirm ? styles.fgInputError : ""}`}
                  type={showCPw ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={regConfirm}
                  onChange={(e) => {
                    setRegConfirm(e.target.value);
                    if (errors.regConfirm)
                      setErrors((p) => ({ ...p, regConfirm: "" }));
                  }}
                />
                <button
                  type="button"
                  className={styles.fgEye}
                  onClick={() => setShowCPw((p) => !p)}
                >
                  {showCPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
                {regConfirm && regPassword === regConfirm && (
                  <FiCheck className={styles.fgCheck} />
                )}
              </div>
              {errors.regConfirm && (
                <span className={styles.fgError}>
                  <FiAlertCircle size={11} /> {errors.regConfirm}
                </span>
              )}
            </div>

            {/* Terms */}
            <label className={styles.termsRow}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  if (errors.agreed) setErrors((p) => ({ ...p, agreed: "" }));
                }}
              />
              <span>
                I agree to the <a href="#terms">Terms of Service</a> and{" "}
                <a href="#privacy">Privacy Policy</a>
              </span>
            </label>
            {errors.agreed && (
              <span
                className={styles.fgError}
                style={{ display: "block", marginTop: 4 }}
              >
                <FiAlertCircle size={11} /> {errors.agreed}
              </span>
            )}

            <button className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <span className={styles.btnSpinner} />
              ) : (
                "Create Account"
              )}
            </button>

            <p className={styles.switchText}>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setTab("login");
                  setErrors({});
                }}
              >
                Login →
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
