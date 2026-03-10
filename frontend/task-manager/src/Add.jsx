import { IoMdAdd } from "react-icons/io";
import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:3000";

const Add = ({ onAdd }) => {
  const [notes, setNotes] = useState({ task: "", priority: "High" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error,setError] = useState();

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

    try{
      const response = await fetch(`${BASE_URL}/addTasks`,{
        method: 'POST',
        header:{
          'Content-Type' : 'application/json,'
        },
        body: JSON.stringify({
          task: notes.task,
          priority: notes.priority,
          createdAt: new Date().toISOString
        })
      });

      if(!response.ok){
        throw new Error(`HTTP response status ${response.status}`);
      }

      const newTask = await response.json();

      onAdd(newTask);

      setNotes({
      task: "",
      priority: "",
     });
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
      <form className="relative flex-1">
        <input
          type="text"
          id="task"
          value={notes.task}
          placeholder="Add task here"
          onChange={handleChange}
          className="w-full border pr-10 py-2 pl-3"
        />

        <button type="submit" onClick={submitTask} className="task-submit">
          <IoMdAdd size={24} />
        </button>
      </form>

      {/* DROPDOWN */}
      <select
        className="priority border py-2 px-3"
        value={notes.priority}
        onChange={handlePriorityChange}
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default Add;
