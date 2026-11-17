import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import EditModal from "./EditModal";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
};

const Task = ({ refreshTrigger, filterPriority = "All", sortBy = "date-newest" }) => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTasks, setActiveTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Apply filter + sort to active tasks
  const displayedTasks = useMemo(() => {
    let tasks = [...activeTasks];
    if (filterPriority !== "All") {
      tasks = tasks.filter(t => t.priority?.toLowerCase() === filterPriority.toLowerCase());
    }
    if (sortBy === "date-newest") tasks.sort((a, b) => new Date(b.created) - new Date(a.created));
    else if (sortBy === "date-oldest") tasks.sort((a, b) => new Date(a.created) - new Date(b.created));
    else if (sortBy === "a-z") tasks.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === "z-a") tasks.sort((a, b) => b.title.localeCompare(a.title));
    return tasks;
  }, [activeTasks, filterPriority, sortBy]);

  function handleClick(task_id) {
    setSelectedTaskId(task_id);
  }

  const fetchTask = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      const active = data.filter(task => task.status !== 'completed');
      const completed = data.filter(task => task.status === 'completed');
      setActiveTasks(active);
      setCompletedTasks(completed);
    } catch (e) {
      console.log("Error fetching task from the Database" + e);
      setError("Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (completedTasks) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/tasks/completed`, { 
        method: "PUT",
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const taskStatus = await response.json();
      console.log(taskStatus);
    } catch (e) {
      console.log("Error updating task status " + e);
    }
  }

  const deleteTask = async (task_id) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/tasks/${task_id}`, { 
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
      const toErase = await response.json();
      console.log(toErase);
      setActiveTasks((prev) => prev.filter((task) => task.task_id !== task_id));
      setCompletedTasks((prev) => prev.filter((task) => task.task_id !== task_id));
    } catch (e) {
      console.log("Error deleting task", e.message);
    }
  };

  const completeTask = async (task, event) => {
    event.stopPropagation();
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/tasks/edit/${task.task_id}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...task, status: 'completed' }),
      });
      if (response.ok) {
        setActiveTasks((prevTasks) => prevTasks.filter((item) => item.task_id !== task.task_id));
        setCompletedTasks((prev) => [task, ...prev]);
      }
    } catch (e) {
      console.log("Error completing task", e);
    }
  };

  const uncompleteTask = async (task, event) => {
    event.stopPropagation();
    try {
      const response = await fetch(`${BASE_URL}/tasks/edit/${task.task_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, status: 'active' }),
      });
      if (response.ok) {
        setCompletedTasks((prev) => prev.filter((item) => item.task_id !== task.task_id));
        setActiveTasks((prev) => [task, ...prev]);
      }
    } catch (e) {
      console.log("Error uncompleting task", e);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [refreshTrigger]);

  const getPriorityColor = (priority) => {
    const p = priority?.toLowerCase();
    if (p === "high") return "var(--danger)";
    if (p === "medium") return "var(--accent)";
    return "rgb(224 226 219 / 0.45)";
  };

  const formatDate = (value) =>
    new Date(value ? value : Date.now()).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (isLoading) {
    return <div className="flex items-center justify-center text-6xl text-[var(--text-muted)] h-screen">Loading Tasks....</div>;
  }

  return (
    <div className="task-list">
      {error && <p className="text-[var(--danger)]">{error}</p>}

      {displayedTasks.length === 0 && completedTasks.length === 0 ? (
        <p className="text-lg text-[var(--text-muted)] mt-6 ml-4">
          {filterPriority !== "All" ? `No "${filterPriority}" priority tasks found.` : "No active tasks found."}
        </p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-auto max-w-[1070px] mx-4 md:mx-16 flex flex-col"
        >
          {displayedTasks.map((p) => (
            <motion.div 
              variants={itemVariants}
              className={`task-row ${selectedTaskId === p.task_id ? "selected" : ""}`} 
              key={p.task_id} 
              onClick={() => handleClick(p.task_id)}
            >
              {/* Priority bar */}
              <div
                className="priority-bar"
                style={{ backgroundColor: getPriorityColor(p.priority) }}
              />

              {/* Checkbox */}
              <input
                type="checkbox"
                onClick={(e) => completeTask(p, e)}
                onChange={() => {}}
                className="task-checkbox z-10"
              />
              
              {/* Title - expands to fill space */}
              <div className="flex-1 min-w-0 ml-3">
                <p className="text-[15px] text-[var(--text-strong)] font-medium truncate">
                  {p.title}
                </p>
              </div>

              {/* Info section - stays on the right */}
              <div className="hidden sm:flex items-center gap-4 shrink-0">
                <p className="text-[13px] font-mono tabular-nums text-[var(--text-muted)]">
                  {formatDate(p.created)}
                </p>
                <p className="text-[13px] text-[var(--text-muted)] min-w-[60px] text-right">
                  {p.priority}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {completedTasks.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 w-auto max-w-[1070px] mx-4 md:mx-16"
        >
          <hr className="border-[var(--line)] mb-6" />
          <div className="mb-4 ml-6">
            <h2 className="text-2xl font-normal text-[var(--text-strong)] font-heading">Completed</h2>
            <p className="text-sm text-[var(--text-muted)]">Completed tasks move here after checking the box.</p>
          </div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="w-auto max-w-[1070px] mx-4 md:mx-16 flex flex-col"
          >
            {completedTasks.map((p) => (
              <motion.div
                key={p.task_id}
                variants={itemVariants}
                className="task-row w-full relative flex items-center h-[48px] px-4 md:px-6 bg-transparent border-b border-[var(--line)] hover:bg-[var(--hover)] cursor-pointer"
                onClick={() => deleteTask(p.task_id)}
              >
                {/* Priority bar at left edge (50% strength) */}
                <div
                  className="priority-bar"
                  style={{ backgroundColor: getPriorityColor(p.priority), opacity: 0.5 }}
                />

                <input
                  type="checkbox"
                  checked
                  onChange={() => {}} // Controlled input
                  onClick={(e) => uncompleteTask(p, e)}
                  className="task-checkbox z-10"
                />

                {/* Title */}
                <div className="flex-1 min-w-0 ml-3">
                  <p className="text-[15px] line-through text-[var(--text-subtle)] truncate">{p.title}</p>
                </div>

                {/* Info */}
                <div className="hidden sm:flex items-center gap-4 shrink-0">
                  <p className="text-[13px] font-mono tabular-nums text-[var(--text-subtle)]">{formatDate(p.created)}</p>
                  <p className="text-[13px] text-[var(--text-subtle)] min-w-[60px] text-right">{p.priority}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}


      {/* Edit Modal */}
      <AnimatePresence>
        {selectedTaskId && (
          <EditModal
            taskId={selectedTaskId}
            onClose={() => setSelectedTaskId(null)}
            onTaskUpdated={fetchTask}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Task;
