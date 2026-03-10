import {
  IoPersonOutline,
  IoCalendarNumberOutline,
  IoSearch,
} from "react-icons/io5";
import { BiTask } from "react-icons/bi";
import { FaRunning } from "react-icons/fa";
import { useState } from "react";

function Navbar() {
  const [active, setActive] = useState("Tasks");

  const handleClick = (name) => {
    setActive(name);
    console.log(`${name} clicked`);
  };

  return (
    <div className="fixed top-0 left-0 h-screen z-50 w-16 px-2 flex flex-col gap-4 bg-[#1D1F49]">
      
      <NavBarIcon
        icon={<IoPersonOutline size={24} />}
        text="Profile"
        isActive={active === "Profile"}
        onClick={() => handleClick("Profile")}
      />

      <div className="w-full h-px bg-[#F1E9E9]" />

      <NavBarIcon
        icon={<BiTask size={24} />}
        text="Tasks"
        isActive={active === "Tasks"}
        onClick={() => handleClick("Tasks")}
      />

      <NavBarIcon
        icon={<IoCalendarNumberOutline size={24} />}
        text="Calendar"
        isActive={active === "Calendar"}
        onClick={() => handleClick("Calendar")}
      />

      <NavBarIcon
        icon={<FaRunning size={24} />}
        text="Habit"
        isActive={active === "Habit"}
        onClick={() => handleClick("Habit")}
      />

      <NavBarIcon
        icon={<IoSearch size={24} />}
        text="Search"
        isActive={active === "Search"}
        onClick={() => handleClick("Search")}
      />
    </div>
  );
}

const NavBarIcon = ({ icon, text, onClick, isActive }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        navbar-icon group
        transition-all duration-200
        ${isActive ? "rounded-xl bg-indigo-500" : "rounded-3xl"}
      `}
    >
      {icon}
      <span className="navbar-tooltip group-hover:scale-100">
        {text}
      </span>
    </button>
  );
};


export default Navbar;
