import { useNavigate } from "react-router-dom";
import Add from "./Add";
import EditModal from "./EditModal";
import { useState, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";

const BASE_URL = "http://localhost:3000";

const Next7D = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const navigate = useNavigate();

  const refreshTasks = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/tasks`);
      const data = await response.json();
      setAllTasks(data);
    } catch (e) {
      console.log("Error fetching tasks for Next7D: " + e);
      setError("Error fetching data for Next7D");
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
        setAllTasks((prevTasks) =>
          prevTasks.filter((item) => item.task_id !== task.task_id),
        );
      }
    } catch (e) {
      console.log("Error completing task", e);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [refreshKey]);

  // Group tasks by date using useMemo for performance
  const groupedTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const groups = {
      today: [],
      tomorrow: [],
      nextWeek: []
    };

    allTasks.forEach(task => {
      // Skip completed tasks
      if (task.status === "completed") return;
      
      const taskDate = new Date(task.created);
      taskDate.setHours(0, 0, 0, 0);
      
      if (taskDate.getTime() === today.getTime()) {
        groups.today.push(task);
      } else if (taskDate.getTime() === tomorrow.getTime()) {
        groups.tomorrow.push(task);
      } else if (taskDate > tomorrow && taskDate <= nextWeek) {
        groups.nextWeek.push(task);
      }
    });

    return groups;
  }, [allTasks]);

  const formatDate = (value) =>
    new Date(value ? value : Date.now()).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const handleClick = (task_id) => {
    setSelectedTaskId(task_id);
  };

  // Task Item Component
  const TaskItem = ({ task }) => (
    <div
      key={task.task_id}
      className="task-bar w-full max-w-[1120px] relative cursor-pointer mb-4"
      onClick={() => handleClick(task.task_id)}
    >
      <input
        type="checkbox"
        onClick={(e) => completeTask(task, e)}
        className="w-[24px] h-[24px] absolute top-[36px] left-[70px]"
      />
      <p className="absolute left-[128px] top-[26px] text-3xl text-[#F1E9E9] font-medium">
        {task.title}
      </p>
      <p className="absolute left-[820px] top-[32px] text-2xl text-[#B8AED4]">
        {formatDate(task.created)}
      </p>
      <div className="w-[2px] h-[60px] bg-[#982598] rounded-full absolute left-[966px] top-[18px]"></div>
      <p className="absolute top-[32px] text-2xl left-[980px] text-[#F1E9E9]">
        {task.priority}
      </p>
    </div>
  );

  // Section Component for rendering grouped tasks
  const TaskSection = ({ title, icon, tasks }) => {
    if (tasks.length === 0) return null;
    
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{icon}</span>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <span className="bg-[#982598]/20 border border-[#982598]/30 rounded-full px-2.5 py-0.5 text-sm font-semibold text-[#982598]">
            {tasks.length}
          </span>
        </div>
        {tasks.map((task) => (
          <TaskItem key={task.task_id} task={task} />
        ))}
      </div>
    );
  };

  // Layout wrapper
  const NextLayout = ({ children }) => (
    <div className="relative md:left-[336px] top-0 min-h-screen w-full md:w-[calc(100%-336px)] px-4 md:px-0 md:pr-8">
      <div className="flex items-center gap-3 my-4">
        <svg
          viewBox="0 0 35 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-[#982598]"
        >
          <path
            d="M25.8159 7.81367L23.1909 16.5637C23.1503 16.6988 23.0673 16.8173 22.9541 16.9015C22.8409 16.9857 22.7036 17.0312 22.5625 17.0312C22.4986 17.0313 22.435 17.0219 22.3738 17.0034C22.2076 16.9528 22.0682 16.8384 21.9862 16.6853C21.9042 16.5321 21.8863 16.3527 21.9363 16.1863L24.3054 8.28125H20.8125C20.6385 8.28125 20.4715 8.21211 20.3485 8.08904C20.2254 7.96597 20.1562 7.79905 20.1562 7.625C20.1562 7.45095 20.2254 7.28403 20.3485 7.16096C20.4715 7.03789 20.6385 6.96875 20.8125 6.96875H25.1875C25.2898 6.96878 25.3907 6.99272 25.4821 7.03867C25.5735 7.08462 25.6529 7.15129 25.7139 7.23338C25.775 7.31547 25.816 7.41069 25.8337 7.51144C25.8514 7.6122 25.8453 7.71569 25.8159 7.81367Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.4188 8.4187C16.5066 8.33092 16.6258 8.28162 16.75 8.28162C16.8742 8.28162 16.9934 8.33092 17.0812 8.4187L20.8313 12.1687C20.919 12.2566 20.9683 12.3757 20.9683 12.5C20.9683 12.6242 20.919 12.7433 20.8313 12.8312L17.0812 16.5812C17.0383 16.6273 16.9866 16.6642 16.9291 16.6898C16.8716 16.7154 16.8095 16.7292 16.7466 16.7303C16.6836 16.7314 16.6211 16.7199 16.5628 16.6963C16.5044 16.6727 16.4514 16.6376 16.4069 16.5931C16.3623 16.5486 16.3272 16.4956 16.3037 16.4372C16.2801 16.3788 16.2685 16.3163 16.2696 16.2534C16.2707 16.1904 16.2845 16.1284 16.3101 16.0709C16.3358 16.0134 16.3727 15.9616 16.4188 15.9187L19.3688 12.9687H10.5C10.3757 12.9687 10.2565 12.9193 10.1685 12.8314C10.0806 12.7435 10.0312 12.6243 10.0312 12.5C10.0312 12.3756 10.0806 12.2564 10.1685 12.1685C10.2565 12.0806 10.3757 12.0312 10.5 12.0312H19.3688L16.4188 9.0812C16.331 8.99331 16.2817 8.87417 16.2817 8.74995C16.2817 8.62573 16.331 8.50659 16.4188 8.4187Z"
            fill="currentColor"
          />
          <path
            d="M9 9.4C9 7.16 9 6.04 9.436 5.184C9.81949 4.43139 10.4314 3.81949 11.184 3.436C12.04 3 13.16 3 15.4 3H20.6C22.84 3 23.96 3 24.816 3.436C25.5686 3.81949 26.1805 4.43139 26.564 5.184C27 6.04 27 7.16 27 9.4V14.6C27 16.84 27 17.96 26.564 18.816C26.1805 19.5686 25.5686 20.1805 24.816 20.564C23.96 21 22.84 21 20.6 21H15.4C13.16 21 12.04 21 11.184 20.564C10.4314 20.1805 9.81949 19.5686 9.436 18.816C9 17.96 9 16.84 9 14.6V9.4Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h1 className="text-3xl font-bold text-white tracking-tight">Next 7 Days</h1>
      </div>

      <div className="add-task mb-8">
        <Add onTaskAdded={refreshTasks} />
      </div>

      {children}
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <NextLayout>
        <div className="flex items-center justify-center text-4xl text-gray-500">
          Loading tasks...
        </div>
      </NextLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <NextLayout>
        <p className="text-red-500">{error}</p>
      </NextLayout>
    );
  }

  // Check if there are any tasks
  const hasNoTasks = groupedTasks.today.length === 0 && 
                     groupedTasks.tomorrow.length === 0 && 
                     groupedTasks.nextWeek.length === 0;

  if (hasNoTasks) {
    return (
      <NextLayout>
        <p className="text-xl text-gray-600">No active tasks found for the next 7 days.</p>
      </NextLayout>
    );
  }

  // Main render with grouped sections
  return (
    <>
      <NextLayout>
        <TaskSection title="Today" icon="📅" tasks={groupedTasks.today} />
        <TaskSection title="Tomorrow" icon="🌅" tasks={groupedTasks.tomorrow} />
        <TaskSection title="Next 7 Days" icon="📆" tasks={groupedTasks.nextWeek} />
      </NextLayout>

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

export default Next7D;