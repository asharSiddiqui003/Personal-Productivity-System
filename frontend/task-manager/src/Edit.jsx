import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

const BASE_URL = "http://localhost:3000";

const Edit = () => {
  const { task_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "High",
    status: "active",
    created: "",
    dueDate: "",
  });
  const [taskDate, setTaskDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");

  const from = location.state?.from || (window.history.length>1 ? -1 : "/");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`${BASE_URL}/tasks/${task_id}`);
        if (!response.ok) throw new Error("Failed to load task");
        const data = await response.json();
        const createdDate = data.created ? new Date(data.created) : new Date();
        setTaskData({
          title: data.title || "",
          description: data.description || "",
          priority: data.priority || "High",
          status: data.status || "active",
          created: data.created || new Date().toISOString(),
          dueDate: data.dueDate || "",
        });
        setTaskDate(createdDate.toISOString().split("T")[0]);
        setDueDate(data.dueDate ? data.dueDate.split("T")[0] : "");
      } catch (e) {
        console.error("Error fetching data for the Edit tab", e);
        setStatus("Unable to load task. Please try again.");
      }
    };

    if (task_id) fetchTask();
  }, [task_id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "taskDate") {
      setTaskDate(value);
    } else if (name === "dueDate") {
      setDueDate(value);
      setTaskData((prev) => ({
        ...prev,
        dueDate: value,
      }));
    } else {
      setTaskData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setStatus("Saving...");

    try {
      const isoDateTime = new Date(taskDate).toISOString();

      const response = await fetch(`${BASE_URL}/tasks/edit/${task_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...taskData,
          created: isoDateTime,
          dueDate,
        }),
      });

      if (!response.ok) throw new Error("Update failed");
      await response.json();
      setStatus("Task updated successfully.");
      if(from === -1){
        navigate(-1);
      } else {
        navigate(from);
      }
    } catch (e) {
      console.error("Error updating data", e);
      setStatus("Unable to save task. Please try again.");
    }
  };

  return (
    <div className="edit-page">
      <div className="flex items-center gap-3 mb-6">
        <FaEdit className="text-[#982598]" size={32} />
        <h1 className="text-4xl font-semibold tracking-tight">Edit Task</h1>
      </div>

      <div className="edit-card-wrapper">
        <div className="edit-card">
          <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="edit-label">
              Title
            </label>
            <input
              id="title"
              name="title"
              value={taskData.title}
              onChange={handleChange}
              placeholder="Task title"
              className="edit-input text-lg"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="edit-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={taskData.description}
              onChange={handleChange}
              rows={6}
              placeholder="Write the task details here"
              className="edit-textarea"
            />
          </div>

          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="w-full sm:max-w-xs space-y-2">
              <label htmlFor="taskDate" className="edit-label">
                Date
              </label>
              <input
                id="taskDate"
                name="taskDate"
                type="date"
                value={taskDate}
                onChange={handleChange}
                className="edit-input"
              />
            </div>

            <div className="w-full sm:max-w-xs space-y-2">
              <label htmlFor="dueDate" className="edit-label">
                Due Date
              </label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                value={dueDate}
                onChange={handleChange}
                className="edit-input"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="w-full sm:max-w-xs space-y-2">
              <label htmlFor="priority" className="edit-label">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
                className="edit-input"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <button type="submit" className="edit-button">
              Save Changes
            </button>
          </div>
          </form>

          {status && <p className="edit-status">{status}</p>}
        </div>
      </div>
    </div>
  );
};

export default Edit;