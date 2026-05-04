import { GoStack } from "react-icons/go";
import { FiInbox, FiActivity } from "react-icons/fi";
import { CgNotes } from "react-icons/cg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Sidebar() {
  const [active, setActive] = useState("All")
  const Navigate = useNavigate();

  useEffect(() => {
    // Only force navigation if the user is at the base URL
    if (window.location.pathname === "/") {
      setActive("All");
    } else {
      // If they landed on /inbox directly, highlight the correct button
      const path = window.location.pathname.replace("/", "");
      const formatted = path.charAt(0).toUpperCase() + path.slice(1);
      setActive(formatted || "All");
    }
  }, []);

  const handleClick = (id, path) => {
    setActive(id);
    Navigate(path)
    console.log(`${id} Clicked!`);
  }
  return (
    <motion.div 
      initial={{ x: -250, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -250, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="sidebar fixed left-16 top-0"
    >
      <SidebarButton
        icon={<GoStack className="size={24}" />}
        text="All"
        isActive={active === "All"}
        onClick={() => handleClick("All", "/")}
      />
      <SidebarButton
        icon={<FiInbox className="size={24}" />}
        text="Inbox"
        isActive={active === "Inbox"}
        onClick={() => handleClick("Inbox", "/inbox")}
      />
      <SidebarButton
        icon={
          <svg
            viewBox="7 0 35 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="w-9 h-6 text-gray-200"
          >
            <path
              d="M25.8159 7.81367L23.1909 16.5637C23.1503 16.6988 23.0673 16.8173 22.9541 16.9015C22.8409 16.9857 22.7036 17.0312 22.5625 17.0312C22.4986 17.0313 22.435 17.0219 22.3738 17.0034C22.2076 16.9528 22.0682 16.8384 21.9862 16.6853C21.9042 16.5321 21.8863 16.3527 21.9363 16.1863L24.3054 8.28125H20.8125C20.6385 8.28125 20.4715 8.21211 20.3485 8.08904C20.2254 7.96597 20.1562 7.79905 20.1562 7.625C20.1562 7.45095 20.2254 7.28403 20.3485 7.16096C20.4715 7.03789 20.6385 6.96875 20.8125 6.96875H25.1875C25.2898 6.96878 25.3907 6.99272 25.4821 7.03867C25.5735 7.08462 25.6529 7.15129 25.7139 7.23338C25.775 7.31547 25.816 7.41069 25.8337 7.51144C25.8514 7.6122 25.8453 7.71569 25.8159 7.81367Z"
              fill="currentColor"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M16.4188 8.4187C16.5066 8.33092 16.6258 8.28162 16.75 8.28162C16.8742 8.28162 16.9934 8.33092 17.0812 8.4187L20.8313 12.1687C20.919 12.2566 20.9683 12.3757 20.9683 12.5C20.9683 12.6242 20.919 12.7433 20.8313 12.8312L17.0812 16.5812C17.0383 16.6273 16.9866 16.6642 16.9291 16.6898C16.8716 16.7154 16.8095 16.7292 16.7466 16.7303C16.6836 16.7314 16.6211 16.7199 16.5628 16.6963C16.5044 16.6727 16.4514 16.6376 16.4069 16.5931C16.3623 16.5486 16.3272 16.4956 16.3037 16.4372C16.2801 16.3788 16.2685 16.3163 16.2696 16.2534C16.2707 16.1904 16.2845 16.1284 16.3101 16.0709C16.3358 16.0134 16.3727 15.9616 16.4188 15.9187L19.3688 12.9687H10.5C10.3757 12.9687 10.2565 12.9193 10.1685 12.8314C10.0806 12.7435 10.0312 12.6243 10.0312 12.5C10.0312 12.3756 10.0806 12.2564 10.1685 12.1685C10.2565 12.0806 10.3757 12.0312 10.5 12.0312H19.3688L16.4188 9.0812C16.331 8.99331 16.2817 8.87417 16.2817 8.74995C16.2817 8.62573 16.331 8.50659 16.4188 8.4187Z"
              fill="currentColor"
            />
            <path
              d="M9 9.4C9 7.16 9 6.04 9.436 5.184C9.81949 4.43139 10.4314 3.81949 11.184 3.436C12.04 3 13.16 3 15.4 3H20.6C22.84 3 23.96 3 24.816 3.436C25.5686 3.81949 26.1805 4.43139 26.564 5.184C27 6.04 27 7.16 27 9.4V14.6C27 16.84 27 17.96 26.564 18.816C26.1805 19.5686 25.5686 20.1805 24.816 20.564C23.96 21 22.84 21 20.6 21H15.4C13.16 21 12.04 21 11.184 20.564C10.4314 20.1805 9.81949 19.5686 9.436 18.816C9 17.96 9 16.84 9 14.6V9.4Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        }
        text="Next 7D"
        isActive={active === "Next 7D"}
        onClick={() => handleClick("Next 7D", "/next-7d")}
      />
      <SidebarButton
        icon={<CgNotes size={24} />}
        text="Summary"
        isActive={active === "Summary"}
        onClick={() => handleClick("Summary", "/summary")}
      />

    </motion.div>
  );
}

const SidebarButton = ({ text, icon, onClick, isActive }) => {
  return (
    <div>
      <button
        className={`sidebar-buttons ${isActive ? "bg-[#2a2c5b] inset-shadow-2xs" : ""}`}
        onClick={onClick}

      >
        <span className="sidebar-icons">{icon}</span>
        {text}
      </button>
    </div>
  );
};

export default Sidebar;
