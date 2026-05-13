import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const EditModal = ({ taskId, onClose, onTaskUpdated }) => {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "High",
    status: "active",
    created: "",
    dueDate: "",
  });
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const toInputDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // Fetch task data
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error("Failed to load task");
        const data = await res.json();
        setTaskData({
          title: data.title || "",
          description: data.description || "",
          priority: data.priority || "High",
          status: data.status || "active",
          created: toInputDate(data.created),
          dueDate: toInputDate(data.dueDate),
        });
      } catch {
        setStatus("Unable to load task.");
      } finally {
        setIsLoading(false);
      }
    };
    if (taskId) fetchTask();
  }, [taskId]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setStatus("Saving…");

    if (taskData.dueDate && taskData.created) {
      if (new Date(taskData.dueDate) < new Date(taskData.created)) {
        setStatus("Due date cannot be before the created date.");
        return;
      }
    }

    try {
      const body = {
        title: taskData.title.trim(),
        description: taskData.description.trim(),
        priority: taskData.priority,
        status: taskData.status,
        created: taskData.created || new Date().toISOString().split("T")[0],
        dueDate: taskData.dueDate || null,
      };

      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${BASE_URL}/tasks/edit/${taskId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Update failed");
      }

      setStatus("Saved ✓");
      if (onTaskUpdated) onTaskUpdated();
      setTimeout(() => onClose(), 700);
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  };

  const statusColor = status.startsWith("Saved")
    ? "text-green-400"
    : status === "Saving…"
    ? "text-[#B8AED4]"
    : "text-red-400";

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      {/* Card — stop propagation so clicking inside doesn't close */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full max-w-[520px] mx-4 rounded-2xl p-6 relative"
        style={{
          background: "rgba(10, 9, 30, 0.96)",
          border: "1px solid rgba(152, 37, 152, 0.25)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.05)",
          backdropFilter: "blur(24px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <FaEdit size={17} className="text-[#982598]" />
            <h2 className="text-lg font-bold text-white tracking-tight">Edit Task</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150"
            style={{ color: "rgba(255,255,255,0.35)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px mb-5" style={{ background: "rgba(255,255,255,0.06)" }} />

        {/* Loading */}
        {isLoading ? (
          <div className="flex items-center justify-center h-40 gap-3 text-[#B8AED4]">
            <div className="w-5 h-5 rounded-full border-2 border-[#982598] border-t-transparent animate-spin" />
            <p>Loading task…</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="edit-label">Title</label>
              <input
                name="title"
                value={taskData.title}
                onChange={handleChange}
                placeholder="Task title"
                className="edit-input"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="edit-label">Description</label>
              <textarea
                name="description"
                value={taskData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Add details…"
                className="edit-textarea"
              />
            </div>

            {/* Dates - side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="edit-label">Created Date</label>
                <input name="created" type="date" value={taskData.created} onChange={handleChange} className="edit-input" required />
              </div>
              <div className="space-y-1.5">
                <label className="edit-label">Due Date</label>
                <input name="dueDate" type="date" value={taskData.dueDate} onChange={handleChange} className="edit-input" />
              </div>
            </div>

            {/* Priority + Save in one row */}
            <div className="flex items-end gap-3 pt-1">
              <div className="space-y-1.5 flex-1">
                <label className="edit-label">Priority</label>
                <select name="priority" value={taskData.priority} onChange={handleChange} className="edit-input">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <button type="submit" className="edit-button shrink-0">
                Save Changes
              </button>
            </div>

            {/* Status */}
            {status && <p className={`text-sm ${statusColor}`}>{status}</p>}
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default EditModal;
