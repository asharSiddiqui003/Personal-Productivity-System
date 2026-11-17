import { useState, useEffect } from "react";
import { FiInbox } from "react-icons/fi";
import { AnimatePresence } from "framer-motion";
import Add from "./Add";
import EditModal from "./EditModal";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Inbox = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTasks, setActiveTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const refreshTasks = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      const active = data.filter((task) => task.status !== "completed");
      setActiveTasks(active);
    } catch (e) {
      console.log("Error fetching inbox tasks", e);
      setError("Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (task, event) => {
    event.stopPropagation();
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/tasks/edit/${task.task_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...task, status: "completed" }),
      });
      if (response.ok) {
        setActiveTasks((prevTasks) => prevTasks.filter((item) => item.task_id !== task.task_id));
      }
    } catch (e) {
      console.log("Error completing inbox task", e);
    }
  };

  const handleClick = (task_id) => {
    setSelectedTaskId(task_id);
  };

  useEffect(() => {
    fetchTasks();
  }, [refreshKey]);

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

  // Extract the common layout into a wrapper component or fragment
const InboxLayout = ({ children }) => (
  <div className="relative md:left-[336px] top-0 min-h-screen w-full md:w-[calc(100%-336px)] px-4 md:px-0 md:pr-8">
    <div className="flex items-center gap-3 my-4">
      <FiInbox size={32} className="text-[var(--accent)]" />
      <h1 className="text-3xl font-normal text-[var(--text-strong)] font-heading tracking-tight">Inbox</h1>
    </div>

    <div className="add-task mb-8">
      <Add onTaskAdded={refreshTasks} />
    </div>

    {children}
  </div>
);

// Then in your component:
if (isLoading) {
  return (
    <InboxLayout>
      <div className="flex items-center justify-center text-4xl text-[var(--text-muted)]">
        Loading tasks...
      </div>
    </InboxLayout>
  );
}

if (error) {
  return (
    <InboxLayout>
      <p className="text-[var(--danger)]">{error}</p>
    </InboxLayout>
  );
}

return (
  <>
    <InboxLayout>
      {activeTasks.length === 0 ? (
        <p className="text-xl text-[var(--text-muted)]">No active tasks found.</p>
      ) : (
        <div className="w-auto max-w-[1120px] mx-4 md:mx-16 flex flex-col">
          {activeTasks.map((task) => (
            <div
              key={task.task_id}
              className={`task-row ${selectedTaskId === task.task_id ? "selected" : ""}`}
              onClick={() => handleClick(task.task_id)}
            >
              {/* Priority bar */}
              <div
                className="priority-bar"
                style={{ backgroundColor: getPriorityColor(task.priority) }}
              />

              {/* Checkbox */}
              <input
                type="checkbox"
                onClick={(e) => completeTask(task, e)}
                onChange={() => {}}
                className="task-checkbox z-10"
              />
              
              {/* Title */}
              <div className="flex-1 min-w-0 ml-3">
                <p className="text-[15px] text-[var(--text-strong)] font-medium truncate">
                  {task.title}
                </p>
              </div>

              {/* Info section */}
              <div className="hidden sm:flex items-center gap-4 shrink-0">
                <p className="text-[13px] font-mono tabular-nums text-[var(--text-muted)]">
                  {formatDate(task.created)}
                </p>
                <p className="text-[13px] text-[var(--text-muted)] min-w-[60px] text-right">
                  {task.priority}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </InboxLayout>

    {/* Edit Modal */}
    <AnimatePresence>
      {selectedTaskId && (
        <EditModal
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
          onTaskUpdated={() => setRefreshKey((k) => k + 1)}
        />
      )}
    </AnimatePresence>
  </>
);
};

export default Inbox;
