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

// Password strength helper
function getStrength(pw) {
  if (pw.length === 0) return { level: 0, label: "", color: "" };
  if (pw.length < 8)   return { level: 1, label: "Too short", color: "bg-red-500" };
  if (pw.length < 12)  return { level: 2, label: "Fair", color: "bg-yellow-500" };
  if (pw.length < 16)  return { level: 3, label: "Good", color: "bg-blue-500" };
  return               { level: 4, label: "Strong", color: "bg-green-500" };
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
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const strength = getStrength(password);

  // ── Email/password signup ──────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreedToTerms) { setErrorMessage("Please agree to the Terms of Service."); return; }
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
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          onLogin(); // update App auth state
          navigate("/");
        } else {
          const err = await res.json();
          setErrorMessage(err || "Google sign-up failed.");
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
    <div className="min-h-screen bg-[#0f1123] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-[#1D1F49]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-10 shadow-[0_0_50px_rgba(79,70,229,0.15)] z-10"
      >
        {/* Logo + heading */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-white/20"
          >
            <span className="text-white text-2xl font-bold tracking-tighter">TM</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h1>
          <p className="text-gray-400 text-sm">Join us to master your productivity</p>
        </div>

        {/* Feedback banners */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="mb-5 flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium"
            >
              <IoAlertCircleOutline size={18} className="shrink-0" />
              {errorMessage}
            </motion.div>
          )}
          {successMessage && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium"
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
          className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium py-3 px-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none mb-6"
        >
          {googleLoading
            ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <GoogleIcon />}
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-gray-500 font-medium uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Email/password form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
              <IoPersonOutline size={20} />
            </div>
            <input
              id="signup-username"
              type="text" required value={username}
              onChange={(e) => { setUsername(e.target.value); setErrorMessage(""); }}
              className="w-full bg-[#0a0b16]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
              placeholder="Username"
            />
          </div>

          {/* Email */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
              <IoMailOutline size={20} />
            </div>
            <input
              id="signup-email"
              type="email" required value={email}
              onChange={(e) => { setEmail(e.target.value); setErrorMessage(""); }}
              className="w-full bg-[#0a0b16]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
              placeholder="Email address"
            />
          </div>

          {/* Password + strength */}
          <div className="space-y-2">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                <IoLockClosedOutline size={20} />
              </div>
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"} required value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMessage(""); }}
                className="w-full bg-[#0a0b16]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                placeholder="Password"
              />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
              </button>
            </div>
            {/* Strength bar */}
            {password && (
              <div className="flex items-center gap-1.5 px-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : "bg-gray-700"}`} />
                ))}
                <span className="text-xs text-gray-500 ml-1 w-14 text-right">{strength.label}</span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
              <IoLockClosedOutline size={20} />
            </div>
            <input
              id="signup-confirm-password"
              type={showConfirm ? "text" : "password"} required value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setErrorMessage(""); }}
              className={`w-full bg-[#0a0b16]/50 border rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all shadow-inner ${
                confirmPassword && confirmPassword !== password
                  ? "border-red-500/50 focus:border-red-500 focus:ring-red-500"
                  : "border-white/10 focus:border-indigo-500 focus:ring-indigo-500"
              }`}
              placeholder="Confirm password"
            />
            <button type="button" onClick={() => setShowConfirm(v => !v)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
              aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}>
              {showConfirm ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
            </button>
          </div>

          {/* Terms checkbox */}
          <label className="flex items-start gap-3 cursor-pointer group pt-1">
            <div className="relative flex items-center mt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => { setAgreedToTerms(e.target.checked); setErrorMessage(""); }}
                className="peer appearance-none w-4 h-4 border border-gray-600 rounded bg-[#0a0b16] checked:bg-indigo-500 checked:border-indigo-500 transition-all cursor-pointer"
              />
              <svg className="absolute w-3 h-3 text-white left-0.5 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
              I agree to the{" "}
              <a href="#" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">Privacy Policy</a>
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none border border-white/10 hover:border-white/20 mt-2"
          >
            {loading
              ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><IoArrowForwardOutline size={18} /> Create Account</>}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <button type="button" onClick={() => navigate("/login")}
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors ml-1">
            Sign in
          </button>
        </p>
      </motion.div>
    </div>
  );
}

export default Signup;
