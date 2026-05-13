import { GoStack } from "react-icons/go";
import { LuSlidersHorizontal } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import Add from "./Add";
import Task from "./Task";
import { useState, useRef, useEffect } from "react";

const PRIORITIES = ["All", "High", "Medium", "Low"];
const SORTS = [
  { label: "Newest first", value: "date-newest" },
  { label: "Oldest first", value: "date-oldest" },
  { label: "A → Z",        value: "a-z" },
  { label: "Z → A",        value: "z-a" },
];

const All = () => {
  const [refreshKey,      setRefreshKey]      = useState(0);
  const [filterPriority,  setFilterPriority]  = useState("All");
  const [sortBy,          setSortBy]          = useState("date-newest");
  const [filterOpen,      setFilterOpen]      = useState(false);
  const filterRef = useRef(null);

  const refreshTasks = () => setRefreshKey(prev => prev + 1);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const isFiltered = filterPriority !== "All" || sortBy !== "date-newest";

  return (
    <div className="relative md:left-[256px] top-0 min-h-screen w-full md:w-[calc(100%-256px)] px-4 md:px-0 md:pr-8">
      {/* Page heading */}
      <div className="flex items-center gap-3 my-4">
        <GoStack size={32} className="text-[#982598]" />
        <h1 className="text-3xl font-bold text-white tracking-tight">All</h1>
      </div>

      {/* Add row + Filter button */}
      <div className="flex items-center gap-3 mb-1">
        <div className="add-task flex-1">
          <Add onTaskAdded={refreshTasks} />
        </div>

        {/* Filter button */}
        <div className="relative shrink-0" ref={filterRef}>
          <button
            onClick={() => setFilterOpen(o => !o)}
            className="flex items-center gap-2 h-[46px] px-4 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: filterOpen || isFiltered
                ? "rgba(152,37,152,0.18)"
                : "rgba(255,255,255,0.05)",
              border: `1px solid ${filterOpen || isFiltered
                ? "rgba(152,37,152,0.4)"
                : "rgba(255,255,255,0.08)"}`,
              color: isFiltered ? "#c060c0" : "#7a7aac",
            }}
          >
            <LuSlidersHorizontal size={16} />
            <span>Filter</span>
            {isFiltered && (
              <span
                className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                style={{ background: "#982598", color: "white" }}
              >
                !
              </span>
            )}
          </button>

          {/* Dropdown panel */}
          {filterOpen && (
            <div
              className="absolute top-full right-0 mt-2 z-50 rounded-2xl p-4 w-52"
              style={{
                background: "rgba(10,9,30,0.97)",
                border: "1px solid rgba(152,37,152,0.2)",
                backdropFilter: "blur(24px)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
              }}
            >
              {/* Priority filter */}
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/30 font-semibold mb-2">
                Priority
              </p>
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPriority(p)}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-sm mb-0.5 transition-all duration-150"
                  style={{
                    background: filterPriority === p ? "rgba(152,37,152,0.15)" : "transparent",
                    borderLeft: `2px solid ${filterPriority === p ? "#982598" : "transparent"}`,
                    paddingLeft: filterPriority === p ? "10px" : "12px",
                    color: filterPriority === p ? "white" : "#7a7aac",
                  }}
                >
                  {p}
                </button>
              ))}

              {/* Divider */}
              <div className="h-px my-3" style={{ background: "rgba(255,255,255,0.06)" }} />

              {/* Sort */}
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/30 font-semibold mb-2">
                Sort By
              </p>
              {SORTS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSortBy(s.value)}
                  className="w-full text-left px-3 py-1.5 rounded-lg text-sm mb-0.5 transition-all duration-150"
                  style={{
                    background: sortBy === s.value ? "rgba(152,37,152,0.15)" : "transparent",
                    borderLeft: `2px solid ${sortBy === s.value ? "#982598" : "transparent"}`,
                    paddingLeft: sortBy === s.value ? "10px" : "12px",
                    color: sortBy === s.value ? "white" : "#7a7aac",
                  }}
                >
                  {s.label}
                </button>
              ))}

              {/* Reset */}
              {isFiltered && (
                <>
                  <div className="h-px my-3" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <button
                    onClick={() => { setFilterPriority("All"); setSortBy("date-newest"); }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    <IoClose size={14} /> Reset filters
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Task list */}
      <Task
        refreshTrigger={refreshKey}
        filterPriority={filterPriority}
        sortBy={sortBy}
      />
    </div>
  );
};

export default All;
