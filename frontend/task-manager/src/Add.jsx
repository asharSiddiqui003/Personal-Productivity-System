import { IoMdAdd } from "react-icons/io";
import { useState, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Add = ({ onTaskAdded }) => {
  const [notes, setNotes] = useState({ task: "", priority: "High" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState();

  function handleChange(event) {
    const task = event.target.value;
    setNotes((prevValue) => {
      return {
        ...prevValue,
        task: task,
      };
    });
  }

  function handlePriorityChange(e) {
    setNotes((prev) => ({
      ...prev,
      priority: e.target.value,
    }));
  }

  async function submitTask(event) {
    event.preventDefault();

    // Don't submit empty tasks
    if (!notes.task.trim()) {
      alert("Please enter a task");
      return;
    }

    setIsSubmitted(true);
    setError(null);

    const requestBody = {
      task: notes.task,
      priority: notes.priority,
      createdAt: new Date().toISOString(),
    };

    console.log("Sending to Server: " , requestBody);

    try {
      const response = await fetch(`${BASE_URL}/addTasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
      if (!response.ok) {
        throw new Error(`HTTP response status ${response.status}`);
      }
      const newTask = await response.json();
      console.log("Server Returned with task fields: " + Object.keys(newTask));
      setNotes({
        task: "",
        priority: "High",
      });
      if (onTaskAdded) {
        onTaskAdded();
      }
    } catch (e) {
      console.log("Error adding task" + e);
      setError("Failed to add task, please try again later.");
    } finally {
      setIsSubmitted(false);
    }
  }

  return (
    <div className="flex items-center gap-3 w-full">
      {/* FORM */}
      <form onSubmit={submitTask} className="relative flex-1">
        <input
          type="text"
          id="task"
          value={notes.task}
          placeholder="Add a new task…"
          onChange={handleChange}
          className="w-full bg-[#0a0b16]/60 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-[#982598] focus:ring-1 focus:ring-[#982598]/40 transition-all"
        />
        <button type="submit" className="task-submit">
          <IoMdAdd size={22} />
        </button>
      </form>

      {/* DROPDOWN */}
      <select
        className="priority"
        value={notes.priority}
        onChange={handlePriorityChange}
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
};

export default Add;
