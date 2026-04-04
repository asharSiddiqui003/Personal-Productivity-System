import { useState, useEffect } from "react";

//Add a way to store and retrieve formattedDate from DB


const BASE_URL = "http://localhost:3000";

const Task = (refreshTrigger) => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [post, setPost] = useState([]);
  const [toErase, eraseData] = useState();

  const fetchTask = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/tasks`);
      const post = await response.json();
      setPost(post);
    } catch (e) {
      console.log("Error fetching task from the Database" + e);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (task_id) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${task_id}`, { method: 'DELETE'});
      if(!response.ok){
        throw new Error(`HTTP error status: ${response.status}`);
      }
      const toErase = await response.json();
      console.log(toErase); 
      eraseData(toErase);
      window.location.reload();
    } catch (e) {
      console.log("Error deleting task", e.message);
    }
  };

  // Fetch tasks on mount AND whenever refreshTrigger changes
  useEffect(() => {
    fetchTask();
  }, [refreshTrigger]);

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  if (isLoading) {
    return <div className="text-6xl items-center justify-center text-gray-500">Loading Tasks....</div>;
  }

  return post.map((p) => {
    return (
      <div className="task-bar w-[1070px] relative">
        <input
          type="checkbox"
          onClick={() => deleteTask(p.task_id)}
          className="w-[24px] h-[24px] absolute top-[36px] left-[70px]"
        />
        <p className="absolute left-[128px] top-[26px] text-4xl ">{p.title}</p>
        <p className="absolute left-[820px] top-[32px] text-2xl">
          {formattedDate}
        </p>
        <div className="w-[2px] h-[60px] bg-[#982598] rounded-full absolute left-[966px] top-[18px]"></div>
        <p className="absolute top-[32px] text-2xl left-[980px]">
          {p.priority}
        </p>
      </div>
    );
  });
};

export default Task;
