import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoArrowForwardOutline,
  IoPersonOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import flowerBloom from "./assets/flower-seq/flower_051.png";

// Password strength helper
function getStrength(pw) {
  if (pw.length === 0) return { level: 0, label: "", color: "" };
  if (pw.length < 8)   return { level: 1, label: "Too short", color: "bg-[var(--danger)]" };
  if (pw.length < 12)  return { level: 2, label: "Fair", color: "bg-[var(--accent)]" };
  if (pw.length < 16)  return { level: 3, label: "Good", color: "bg-[var(--accent)]" };
  return               { level: 4, label: "Strong", color: "bg-[var(--accent)]" };
}

// Google "G" SVG (official brand colors)
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
      <path d="M47.532 24.552c0-1.636-.132-3.2-.396-4.704H24.48v8.928h12.984c-.564 3.012-2.232 5.568-4.752 7.284v6.024h7.692c4.5-4.14 7.128-10.248 7.128-17.532z" fill="#4285F4"/>
      <path d="M24.48 48c6.504 0 11.964-2.16 15.948-5.88l-7.692-6.024c-2.16 1.44-4.908 2.304-8.256 2.304-6.348 0-11.724-4.284-13.644-10.044H3.024v6.216C6.984 42.756 15.204 48 24.48 48z" fill="#34A853"/>
      <path d="M10.836 28.356A14.61 14.61 0 0 1 9.9 24c0-1.512.264-2.976.936-4.356v-6.216H3.024A23.988 23.988 0 0 0 .48 24c0 3.876.924 7.548 2.544 10.572l7.812-6.216z" fill="#FBBC05"/>
      <path d="M24.48 9.6c3.576 0 6.78 1.236 9.3 3.648l6.948-6.948C36.444 2.388 30.984 0 24.48 0 15.204 0 6.984 5.244 3.024 13.428l7.812 6.216C12.756 13.884 18.132 9.6 24.48 9.6z" fill="#EA4335"/>
    </svg>
  );
}

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const AUTH_URL = import.meta.env.VITE_AUTH_URL || "http://localhost:4000";

function Signup({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const strength = getStrength(password);

  // ── Email/password signup ──────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { setErrorMessage("Passwords do not match."); return; }
    if (password.length < 8) { setErrorMessage("Password must be at least 8 characters."); return; }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, email, password }),
      });

      if (response.ok) {
        setSuccessMessage("Account created! Redirecting to login…");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || "Registration failed. Email might already exist.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error: Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

  // ── Google OAuth signup ────────────────────────────────────
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setErrorMessage("");
      try {
        const res = await fetch(`${AUTH_URL}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: tokenResponse.access_token }),
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          onLogin();
          navigate("/");
        } else {
          let msg = "Google sign-up failed.";
          try {
            const err = await res.json();
            msg = typeof err === "string" ? err : (err?.error || err?.message || msg);
          } catch {
            // non-JSON response
          }
          setErrorMessage(msg);
        }
      } catch {
        setErrorMessage("Network error during Google sign-up.");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => setErrorMessage("Google sign-up was cancelled or failed."),
  });

  return (
    <div className="min-h-screen w-full flex flex-row bg-[var(--bg-canvas)] overflow-hidden">
      {/* Left panel: flat --oxblood panel with peeking bloom (hidden below 900px) */}
      <div className="hidden min-[900px]:flex min-[900px]:w-1/2 min-h-screen h-full bg-[var(--oxblood)] relative overflow-hidden flex-col justify-between p-10 md:p-14 lg:p-16 shrink-0">
        <h1
          className="text-[var(--text-strong)] font-heading leading-[1.12] tracking-tight max-w-md z-10"
          style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 300 }}
        >
          Start with one task.
        </h1>

        <div
          className="absolute left-1/2 -translate-x-1/2 top-[55%] pointer-events-none select-none z-0"
          style={{ width: "min(180%, 2050px)" }}
        >
          <img
            src={flowerBloom}
            alt=""
            aria-hidden="true"
            className="w-full h-auto object-contain block"
            style={{ transform: "translateY(-17.07%)" }}
          />
        </div>
      </div>

      {/* Right panel: --bg-canvas with the form directly on canvas */}
      <div className="w-full min-[900px]:w-1/2 min-h-screen flex items-center justify-center p-6 md:p-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-[400px] py-8 z-10"
        >
          {/* Logo + heading */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-[var(--accent)] rounded-2xl mx-auto mb-6 flex items-center justify-center border border-[var(--line-card)]"
            >
              <span className="text-[var(--on-accent)] text-3xl font-heading font-bold select-none">F</span>
            </motion.div>
            <h2 className="text-3xl font-normal font-heading text-[var(--text-strong)] mb-2 tracking-tight">Create Account</h2>
            <p className="text-[var(--text-muted)] text-sm">Join us to master your productivity</p>
          </div>

          {/* Feedback banners */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="mb-5 flex items-center gap-2 p-3 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/30 text-[var(--danger)] text-sm font-medium"
              >
                <IoAlertCircleOutline size={18} className="shrink-0" />
                {errorMessage}
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="mb-5 flex items-center gap-2 p-3 rounded-xl bg-[var(--accent-tint)] border border-[var(--accent)]/30 text-[var(--accent)] text-sm font-medium"
              >
                <IoCheckmarkCircleOutline size={18} className="shrink-0" />
                {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google OAuth button */}
          <button
            type="button"
            onClick={() => { setErrorMessage(""); handleGoogleLogin(); }}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-[var(--surface)] hover:bg-[var(--hover)] border border-[var(--line-control)] text-[var(--text-strong)] font-medium py-3 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none mb-6"
          >
            {googleLoading
              ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <GoogleIcon />}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[var(--line)]" />
            <span className="text-xs text-[var(--text-subtle)] font-medium uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-[var(--line)]" />
          </div>

          {/* Email/password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-subtle)] group-focus-within:text-[var(--accent)] transition-colors">
                <IoPersonOutline size={20} />
              </div>
              <input
                id="signup-username"
                type="text" required value={username}
                onChange={(e) => { setUsername(e.target.value); setErrorMessage(""); }}
                className="w-full bg-[var(--surface)] border border-[var(--line-control)] rounded-xl py-3.5 pl-12 pr-4 text-[var(--text-strong)] placeholder-[var(--text-subtle)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] transition-all"
                placeholder="Username"
              />
            </div>

            {/* Email */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-subtle)] group-focus-within:text-[var(--accent)] transition-colors">
                <IoMailOutline size={20} />
              </div>
              <input
                id="signup-email"
                type="email" required value={email}
                onChange={(e) => { setEmail(e.target.value); setErrorMessage(""); }}
                className="w-full bg-[var(--surface)] border border-[var(--line-control)] rounded-xl py-3.5 pl-12 pr-4 text-[var(--text-strong)] placeholder-[var(--text-subtle)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] transition-all"
                placeholder="Email address"
              />
            </div>

            {/* Password + strength */}
            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-subtle)] group-focus-within:text-[var(--accent)] transition-colors">
                  <IoLockClosedOutline size={20} />
                </div>
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"} required value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMessage(""); }}
                  className="w-full bg-[var(--surface)] border border-[var(--line-control)] rounded-xl py-3.5 pl-12 pr-12 text-[var(--text-strong)] placeholder-[var(--text-subtle)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] transition-all"
                  placeholder="Password"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--text-subtle)] hover:text-[var(--text-strong)] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                </button>
              </div>
              {/* Strength bar */}
              {password && (
                <div className="flex items-center gap-1.5 px-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : "bg-[var(--line-control)]"}`} />
                  ))}
                  <span className="text-xs text-[var(--text-subtle)] font-mono tabular-nums ml-1 w-14 text-right">{strength.label}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-subtle)] group-focus-within:text-[var(--accent)] transition-colors">
                <IoLockClosedOutline size={20} />
              </div>
              <input
                id="signup-confirm-password"
                type={showConfirm ? "text" : "password"} required value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setErrorMessage(""); }}
                className={`w-full bg-[var(--surface)] border rounded-xl py-3.5 pl-12 pr-12 text-[var(--text-strong)] placeholder-[var(--text-subtle)] focus:outline-none focus:ring-2 transition-all ${
                  confirmPassword && confirmPassword !== password
                    ? "border-[var(--danger)]/50 focus:border-[var(--danger)] focus:ring-[var(--danger)]"
                    : "border-[var(--line-control)] focus:border-[var(--accent)] focus:ring-[var(--accent)]"
                }`}
                placeholder="Confirm password"
              />
              <button type="button" onClick={() => setShowConfirm(v => !v)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[var(--text-subtle)] hover:text-[var(--text-strong)] transition-colors"
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}>
                {showConfirm ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] active:bg-[var(--accent-press)] text-[var(--on-accent)] font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none mt-2"
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><IoArrowForwardOutline size={18} /> Create Account</>}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-[var(--text-muted)]">
            Already have an account?{" "}
            <button type="button" onClick={() => navigate("/login")}
              className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors ml-1">
              Sign in
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Signup;
