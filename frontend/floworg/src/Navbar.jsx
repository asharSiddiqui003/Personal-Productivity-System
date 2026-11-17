import { IoPersonOutline, IoTimerOutline, IoSearch } from "react-icons/io5";
import { BiTask } from "react-icons/bi";
import { FaRunning } from "react-icons/fa";
import { RiMenu3Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { name: "Profile", icon: IoPersonOutline, path: "/profile" },
  null,
  { name: "Tasks", icon: BiTask, path: "/" },
  { name: "Pomodoro", icon: IoTimerOutline, path: "/pomodoro" },
  { name: "Habit", icon: FaRunning, path: "/habits" },
  { name: "Search", icon: IoSearch, path: null },
];

function Navbar({ activeNav, setActiveNav, onHamburgerClick }) {
  const navigate = useNavigate();

  const handleClick = (name, path) => {
    setActiveNav(name);
    if (path) navigate(path);
  };

  // Items shown in mobile bottom bar (excluding null dividers)
  const mobileItems = navItems.filter((item) => item !== null);

  return (
    <>
      {/* ── DESKTOP: left sidebar ── */}
      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="hidden md:flex fixed top-0 left-0 h-screen z-50 w-20 flex-col items-center gap-1 py-4"
        style={{
          background: "var(--bg-rail)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          boxShadow: "4px 0 32px rgba(0,0,0,0.8), inset -1px 0 0 rgba(0,0,0,0.2)",
        }}
      >
        {/* Brand logo monogram tile */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.05, duration: 0.3, type: "spring", stiffness: 260 }}
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shrink-0 overflow-hidden relative group cursor-pointer"
          style={{
            background: "var(--accent)",
            color: "var(--on-accent)",
          }}
          onClick={() => navigate("/")}
        >
          <span
            className="text-2xl font-bold font-heading relative z-10 select-none leading-none"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            F
          </span>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>

        {navItems.map((item, i) => {
          if (item === null) {
            return (
              <motion.div
                key="divider"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="w-8 h-px my-1"
                style={{ background: "var(--line)" }}
              />
            );
          }
          return (
            <motion.div
              key={item.name}
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.35, ease: "easeOut" }}
            >
              <NavBarIcon
                icon={item.icon}
                text={item.name}
                isActive={activeNav === item.name}
                onClick={() => handleClick(item.name, item.path)}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── MOBILE: bottom tab bar ── */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 h-16"
        style={{
          background: "var(--bg-rail)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          boxShadow: "0 -4px 32px rgba(0,0,0,0.8), inset 0 1px 0 rgba(0,0,0,0.2)",
        }}
      >
        {/* Hamburger — only visible when on Tasks view */}
        {activeNav === "Tasks" && (
          <button
            onClick={onHamburgerClick}
            className="flex flex-col items-center justify-center w-12 h-12 rounded-xl gap-1 transition-all"
            style={{ color: "var(--rail-icon)" }}
          >
            <RiMenu3Line size={22} />
            <span className="text-[9px] font-semibold">Menu</span>
          </button>
        )}

        {mobileItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.name;
          return (
            <button
              key={item.name}
              onClick={() => handleClick(item.name, item.path)}
              className="flex flex-col items-center justify-center w-12 h-12 rounded-xl gap-1 transition-all outline-none focus-visible:outline-2 focus-visible:outline-[var(--text)] focus-visible:outline-offset-2"
              style={{
                background: isActive ? "var(--accent)" : "transparent",
                color: isActive ? "var(--on-accent)" : "var(--rail-icon)",
              }}
            >
              <Icon size={20} />
              <span className="text-[9px] font-semibold">{item.name}</span>
            </button>
          );
        })}
      </motion.div>
    </>
  );
}

const NavBarIcon = ({ icon: Icon, text, onClick, isActive }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="navbar-icon group outline-none focus-visible:outline-2 focus-visible:outline-[var(--text)] focus-visible:outline-offset-2"
      style={
        isActive
          ? {
            borderRadius: "12px",
            background: "var(--accent)",
            color: "var(--on-accent)",
          }
          : {
            borderRadius: "24px",
            background: "var(--rail-item)",
            color: "var(--rail-icon)",
            transition: "all 0.25s ease",
          }
      }
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.borderRadius = "12px";
          e.currentTarget.style.background = "var(--rail-item-hover)";
          e.currentTarget.style.color = "var(--text-strong)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.borderRadius = "24px";
          e.currentTarget.style.background = "var(--rail-item)";
          e.currentTarget.style.color = "var(--rail-icon)";
        }
      }}
    >
      <Icon size={24} />
      <span className="navbar-tooltip group-hover:scale-100">{text}</span>
    </button>
  );
};

export default Navbar;
