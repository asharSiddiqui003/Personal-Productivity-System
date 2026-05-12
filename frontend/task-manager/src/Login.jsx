import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoArrowForwardOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoAlertCircleOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Securely store tokens returned by authServer.js
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        // Trigger parent to render the dashboard
        onLogin();
      } else {
        const errorText = await response.json();
        setErrorMessage(errorText || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error: Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };

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
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-white/20"
          >
            <span className="text-white text-2xl font-bold tracking-tighter">TM</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-gray-400 text-sm">Sign in to manage your tasks and habits</p>
        </div>

        {/* Error banner */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium shadow-inner"
            >
              <IoAlertCircleOutline size={18} className="shrink-0" />
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
              <IoMailOutline size={20} />
            </div>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0a0b16]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
              placeholder="Email address"
            />
          </div>

          {/* Password with show/hide */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
              <IoLockClosedOutline size={20} />
            </div>
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0b16]/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
            </button>
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between text-sm pt-1">
            <label className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer transition-colors">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  className="peer appearance-none w-4 h-4 border border-gray-600 rounded bg-[#0a0b16] checked:bg-indigo-500 checked:border-indigo-500 transition-all cursor-pointer"
                />
                <svg
                  className="absolute w-3 h-3 text-white left-0.5 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              Remember me
            </label>
            <button
              type="button"
              className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none border border-white/10 hover:border-white/20 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <IoArrowForwardOutline size={18} />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors ml-1"
          >
            Sign up
          </button>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
