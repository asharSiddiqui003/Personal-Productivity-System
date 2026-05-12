import { GoStack } from "react-icons/go";
import { FiInbox } from "react-icons/fi";
import { IoCalendarNumberOutline, IoCloseOutline } from "react-icons/io5";
import { BiTask } from "react-icons/bi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Sidebar({ mobileOpen, onMobileClose }) {
  const [active, setActive] = useState("All");
  const Navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === "/") {
      setActive("All");
    } else {
      const path = window.location.pathname.replace("/", "");
      const formatted = path.charAt(0).toUpperCase() + path.slice(1);
      setActive(formatted || "All");
    }
  }, []);

  const handleClick = (id, path) => {
    setActive(id);
    Navigate(path);
    if (onMobileClose) onMobileClose();
  };

  const sidebarContent = (
    <>
      {/* Workspace chip */}
      <div className="px-3 mb-5 mt-1">
        <div
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
          style={{
            background: "rgba(152,37,152,0.08)",
            border: "1px solid rgba(152,37,152,0.2)",
          }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-md shadow-[#982598]/50"
            style={{ background: "linear-gradient(135deg, #982598, #6d28d9)" }}
          >
            <BiTask size={15} className="text-white" />
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">My Workspace</span>
        </div>
      </div>

      {/* Section label */}
      <p className="px-6 mb-1.5 text-[10px] uppercase tracking-[0.18em] text-white/30 font-semibold">
        Menu
      </p>

      <SidebarButton
        icon={<GoStack size={17} />}
        text="All"
        isActive={active === "All"}
        onClick={() => handleClick("All", "/")}
      />
      <SidebarButton
        icon={<FiInbox size={17} />}
        text="Inbox"
        isActive={active === "Inbox"}
        onClick={() => handleClick("Inbox", "/inbox")}
      />
      <SidebarButton
        icon={
          <svg viewBox="7 0 35 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-4">
            <path d="M25.8159 7.81367L23.1909 16.5637C23.1503 16.6988 23.0673 16.8173 22.9541 16.9015C22.8409 16.9857 22.7036 17.0312 22.5625 17.0312C22.4986 17.0313 22.435 17.0219 22.3738 17.0034C22.2076 16.9528 22.0682 16.8384 21.9862 16.6853C21.9042 16.5321 21.8863 16.3527 21.9363 16.1863L24.3054 8.28125H20.8125C20.6385 8.28125 20.4715 8.21211 20.3485 8.08904C20.2254 7.96597 20.1562 7.79905 20.1562 7.625C20.1562 7.45095 20.2254 7.28403 20.3485 7.16096C20.4715 7.03789 20.6385 6.96875 20.8125 6.96875H25.1875C25.2898 6.96878 25.3907 6.99272 25.4821 7.03867C25.5735 7.08462 25.6529 7.15129 25.7139 7.23338C25.775 7.31547 25.816 7.41069 25.8337 7.51144C25.8514 7.6122 25.8453 7.71569 25.8159 7.81367Z" fill="currentColor" />
            <path fillRule="evenodd" clipRule="evenodd" d="M16.4188 8.4187C16.5066 8.33092 16.6258 8.28162 16.75 8.28162C16.8742 8.28162 16.9934 8.33092 17.0812 8.4187L20.8313 12.1687C20.919 12.2566 20.9683 12.3757 20.9683 12.5C20.9683 12.6242 20.919 12.7433 20.8313 12.8312L17.0812 16.5812C17.0383 16.6273 16.9866 16.6642 16.9291 16.6898C16.8716 16.7154 16.8095 16.7292 16.7466 16.7303C16.6836 16.7314 16.6211 16.7199 16.5628 16.6963C16.5044 16.6727 16.4514 16.6376 16.4069 16.5931C16.3623 16.5486 16.3272 16.4956 16.3037 16.4372C16.2801 16.3788 16.2685 16.3163 16.2696 16.2534C16.2707 16.1904 16.2845 16.1284 16.3101 16.0709C16.3358 16.0134 16.3727 15.9616 16.4188 15.9187L19.3688 12.9687H10.5C10.3757 12.9687 10.2565 12.9193 10.1685 12.8314C10.0806 12.7435 10.0312 12.6243 10.0312 12.5C10.0312 12.3756 10.0806 12.2564 10.1685 12.1685C10.2565 12.0806 10.3757 12.0312 10.5 12.0312H19.3688L16.4188 9.0812C16.331 8.99331 16.2817 8.87417 16.2817 8.74995C16.2817 8.62573 16.331 8.50659 16.4188 8.4187Z" fill="currentColor" />
            <path d="M9 9.4C9 7.16 9 6.04 9.436 5.184C9.81949 4.43139 10.4314 3.81949 11.184 3.436C12.04 3 13.16 3 15.4 3H20.6C22.84 3 23.96 3 24.816 3.436C25.5686 3.81949 26.1805 4.43139 26.564 5.184C27 6.04 27 7.16 27 9.4V14.6C27 16.84 27 17.96 26.564 18.816C26.1805 19.5686 25.5686 20.1805 24.816 20.564C23.96 21 22.84 21 20.6 21H15.4C13.16 21 12.04 21 11.184 20.564C10.4314 20.1805 9.81949 19.5686 9.436 18.816C9 17.96 9 16.84 9 14.6V9.4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
        text="Next 7D"
        isActive={active === "Next 7D"}
        onClick={() => handleClick("Next 7D", "/next-7d")}
      />

      {/* Divider + Views section */}
      <div className="mx-5 my-3 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
      <p className="px-6 mb-1.5 text-[10px] uppercase tracking-[0.18em] text-white/30 font-semibold">
        Views
      </p>

      <SidebarButton
        icon={<IoCalendarNumberOutline size={17} />}
        text="Calendar"
        isActive={active === "Calendar"}
        onClick={() => handleClick("Calendar", "/calendar")}
      />
    </>
  );

  return (
    <>
      {/* ── DESKTOP sidebar ── */}
      <motion.div
        initial={{ x: -250, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -250, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="sidebar fixed left-20 top-0 hidden md:flex flex-col"
      >
        {sidebarContent}
      </motion.div>

      {/* ── MOBILE sidebar overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="md:hidden fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden fixed left-0 top-0 bottom-16 z-[95] w-72 flex flex-col py-4"
              style={{
                background: "rgba(11, 10, 32, 0.97)",
                backdropFilter: "blur(28px)",
                WebkitBackdropFilter: "blur(28px)",
                borderRight: "1px solid rgba(152, 37, 152, 0.18)",
                boxShadow: "6px 0 40px rgba(0, 0, 0, 0.65)",
              }}
            >
              {/* Close button */}
              <div className="flex justify-end px-4 mb-2">
                <button
                  onClick={onMobileClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#B8AED4] hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <IoCloseOutline size={20} />
                </button>
              </div>
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

const SidebarButton = ({ text, icon, onClick, isActive }) => {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 h-10 w-[232px] mx-auto px-4 rounded-xl mb-0.5 text-sm font-medium transition-all duration-200 cursor-pointer relative"
      style={
        isActive
          ? {
              background: "rgba(152,37,152,0.15)",
              borderLeft: "3px solid #982598",
              paddingLeft: "13px",
              color: "white",
              boxShadow: "inset 0 0 24px rgba(152,37,152,0.06)",
            }
          : { color: "#7a7aac", borderLeft: "3px solid transparent" }
      }
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          e.currentTarget.style.color = "white";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#7a7aac";
        }
      }}
    >
      <span className={isActive ? "text-[#c060c0]" : ""}>{icon}</span>
      {text}
      {isActive && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#982598]" />
      )}
    </button>
  );
};

export default Sidebar;
