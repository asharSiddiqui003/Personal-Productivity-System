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
      const response = await fetch(`${BASE_URL}/tasks`);
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
      const response = await fetch(`${BASE_URL}/tasks/edit/${task.task_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
      <FiInbox size={32} className="text-[#982598]" />
      <h1 className="text-3xl font-bold text-white tracking-tight">Inbox</h1>
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
      <div className="flex items-center justify-center text-4xl text-gray-500">
        Loading tasks...
      </div>
    </InboxLayout>
  );
}

if (error) {
  return (
    <InboxLayout>
      <p className="text-red-500">{error}</p>
    </InboxLayout>
  );
}

return (
  <>
    <InboxLayout>
      {activeTasks.length === 0 ? (
        <p className="text-xl text-[#B8AED4]">No active tasks found.</p>
      ) : (
        <div className="space-y-6">
          {activeTasks.map((task) => (
            <div
              key={task.task_id}
              className="task-bar w-full max-w-[1120px] relative cursor-pointer"
              onClick={() => handleClick(task.task_id)}
            >
              <input
                type="checkbox"
                onClick={(e) => completeTask(task, e)}
                className="w-[24px] h-[24px] absolute top-[36px] left-[70px]"
              />
              <p className="absolute left-[128px] top-[26px] text-3xl text-[#F1E9E9] font-medium">{task.title}</p>
              <p className="absolute left-[820px] top-[32px] text-2xl text-[#B8AED4]">
                {formatDate(task.created)}
              </p>
              <div className="w-[2px] h-[60px] bg-[#982598] rounded-full absolute left-[966px] top-[18px]"></div>
              <p className="absolute top-[32px] text-2xl left-[980px] text-[#F1E9E9]">{task.priority}</p>
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
