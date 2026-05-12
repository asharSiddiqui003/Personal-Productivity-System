import { useState, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import EditModal from "./EditModal";

const BASE_URL = "http://localhost:3000";

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
      const response = await fetch(`${BASE_URL}/tasks`);
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
      const response = await fetch(`${BASE_URL}/tasks/completed`, { method: "PUT" });
      const taskStatus = await response.json();
      console.log(taskStatus);
    } catch (e) {
      console.log("Error updating task status " + e);
    }
  }

  const deleteTask = async (task_id) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${task_id}`, { method: "DELETE" });
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
      const response = await fetch(`${BASE_URL}/tasks/edit/${task.task_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
    return <div className="flex items-center justify-center text-6xl text-gray-500">Loading Tasks....</div>;
  }

  return (
    <div className="task-list">
      {error && <p className="text-red-500">{error}</p>}

      {displayedTasks.length === 0 && completedTasks.length === 0 ? (
        <p className="text-lg text-[#7a7aac] mt-6 ml-4">
          {filterPriority !== "All" ? `No "${filterPriority}" priority tasks found.` : "No active tasks found."}
        </p>
      ) : (
        displayedTasks.map((p) => (
          <div className="task-bar w-[1070px] relative" key={p.task_id} onClick={() => handleClick(p.task_id)}>
            <input
              type="checkbox"
              onClick={(e) => completeTask(p, e)}
              className="w-[24px] h-[24px] absolute top-[36px] left-[70px]"
            />
            <p className="absolute left-[128px] top-[26px] text-3xl text-[#F1E9E9] font-medium">{p.title}</p>
            <p className="absolute left-[820px] top-[32px] text-2xl text-[#B8AED4]">{formatDate(p.created)}</p>
            <div className="w-[2px] h-[60px] bg-[#982598] rounded-full absolute left-[966px] top-[18px]"></div>
            <p className="absolute top-[32px] text-2xl left-[980px] text-[#F1E9E9]">{p.priority}</p>
          </div>
        ))
      )}

      {completedTasks.length > 0 && (
        <div className="mt-12 w-full max-w-[1120px]">
          <hr className="border-gray-300 mb-6" />
          <div className="mb-4 ml-6">
            <h2 className="text-2xl text-[#E8D9F7] font-semibold">Completed</h2>
            <p className="text-sm text-gray-400">Completed tasks move here after checking the box.</p>
          </div>
          <div className="space-y-4">
            {completedTasks.map((p) => (
              <div
                key={p.task_id}
                className="task-bar w-[1070px] relative animate-slide-down opacity-90"
                onClick={() => deleteTask(p.task_id)}
              >
                <input
                  type="checkbox"
                  checked
                  onClick={(e) => uncompleteTask(p, e)}
                  className="w-[24px] h-[24px] absolute top-[36px] left-[70px]"
                />
                <p className="absolute left-[128px] top-[26px] text-3xl line-through text-gray-500">{p.title}</p>
                <p className="absolute left-[820px] top-[32px] text-2xl text-gray-500">{formatDate(p.created)}</p>
                <div className="w-[2px] h-[60px] bg-[#982598] rounded-full absolute left-[966px] top-[18px]"></div>
                <p className="absolute top-[32px] text-2xl left-[980px] text-gray-500">{p.priority}</p>
              </div>
            ))}
          </div>
        </div>
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
