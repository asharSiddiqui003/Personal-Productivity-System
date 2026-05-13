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
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${BASE_URL}/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${BASE_URL}/tasks/completed`, { 
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const taskStatus = await response.json();
      console.log(taskStatus);
    } catch (e) {
      console.log("Error updating task status " + e);
    }
  }

  const deleteTask = async (task_id) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${BASE_URL}/tasks/${task_id}`, { 
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${BASE_URL}/tasks/edit/${task.task_id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
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

  const formatDate = (value) =>
    new Date(value ? value : Date.now()).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (isLoading) {
    return <div className="flex items-center justify-center text-6xl text-gray-500 h-screen">Loading Tasks....</div>;
  }

  return (
    <div className="task-list">
      {error && <p className="text-red-500">{error}</p>}

      {displayedTasks.length === 0 && completedTasks.length === 0 ? (
        <p className="text-lg text-[#7a7aac] mt-6 ml-4">
          {filterPriority !== "All" ? `No "${filterPriority}" priority tasks found.` : "No active tasks found."}
        </p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {displayedTasks.map((p) => (
            <motion.div 
              variants={itemVariants}
              className="task-bar w-full max-w-[1070px] flex items-center px-8 md:px-12 py-4 cursor-pointer mb-4 gap-4" 
              key={p.task_id} 
              onClick={() => handleClick(p.task_id)}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                onClick={(e) => completeTask(p, e)}
                className="w-6 h-6 rounded-lg border-white/20 bg-white/5 cursor-pointer accent-[#982598] shrink-0 z-10"
              />
              
              {/* Title - expands to fill space */}
              <div className="flex-1 min-w-0 ml-4">
                <p className="text-2xl md:text-3xl text-[#F1E9E9] font-medium truncate">
                  {p.title}
                </p>
              </div>

              {/* Info section - stays on the right */}
              <div className="hidden sm:flex items-center gap-6 shrink-0">
                <p className="text-xl md:text-2xl text-[#B8AED4]">
                  {formatDate(p.created)}
                </p>
                <div className="w-[2px] h-10 bg-[#982598] rounded-full"></div>
                <p className="text-xl md:text-2xl text-[#F1E9E9] min-w-[80px] text-center">
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
          className="mt-12 w-full max-w-[1120px]"
        >
          <hr className="border-gray-300 mb-6 opacity-20" />
          <div className="mb-4 ml-6">
            <h2 className="text-2xl text-[#E8D9F7] font-semibold">Completed</h2>
            <p className="text-sm text-gray-400">Completed tasks move here after checking the box.</p>
          </div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {completedTasks.map((p) => (
              <motion.div
                key={p.task_id}
                variants={itemVariants}
                className="task-bar w-[1070px] relative opacity-90"
                onClick={() => deleteTask(p.task_id)}
              >
                <input
                  type="checkbox"
                  checked
                  onChange={() => {}} // Controlled input
                  onClick={(e) => uncompleteTask(p, e)}
                  className="w-[24px] h-[24px] absolute top-[36px] left-[70px] cursor-pointer z-10"
                />
                <p className="absolute left-[128px] top-[26px] text-3xl line-through text-gray-500">{p.title}</p>
                <p className="absolute left-[820px] top-[32px] text-2xl text-gray-500">{formatDate(p.created)}</p>
                <div className="w-[2px] h-[60px] bg-[#982598] rounded-full absolute left-[966px] top-[18px]"></div>
                <p className="absolute top-[32px] text-2xl left-[980px] text-gray-500">{p.priority}</p>
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
