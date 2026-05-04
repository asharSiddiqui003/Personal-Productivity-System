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
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const from = location.state?.from || (window.history.length > 1 ? -1 : "/");

  const InputDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateForBackend = (dateString) => {
    if (!dateString) return null;
    return dateString;
  };

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/tasks/${task_id}`);
        if (!response.ok) throw new Error("Failed to load task");
        const data = await response.json();
        console.log("Fetched task data:", data);

        const CreatedDate = InputDate(data.created);
        const DueDate = InputDate(data.dueDate);

        setTaskData({
          title: data.title || "",
          description: data.description || "",
          priority: data.priority || "High",
          status: data.status || "active",
          created: CreatedDate || "",
          dueDate: DueDate || "",
        });

        setStatus("");
      } catch (e) {
        console.error("Error fetching data for the Edit tab", e);
        setStatus("Unable to load task. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (task_id) fetchTask();
  }, [task_id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setStatus("Saving...");

    // Validate dates
    if (taskData.dueDate && taskData.created) {
      const dueDateObj = new Date(taskData.dueDate);
      const createdDateObj = new Date(taskData.created);

      if (dueDateObj < createdDateObj) {
        setStatus("Due date cannot be earlier than created date.");
        return;
      }
    }

    try {
      const updatedTask = {
        title: taskData.title.trim(),
        description: taskData.description.trim(),
        priority: taskData.priority,
        status: taskData.status,
        created: taskData.created || new Date().toISOString().split("T")[0],
        dueDate: taskData.dueDate || null,
      };

      console.log("Sending to backend:", updatedTask);

      const response = await fetch(`${BASE_URL}/tasks/edit/${task_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Update failed");
      }
      const result = await response.json();
      console.log("Update response:", result);
      setStatus("Task updated successfully.");
      if (from === -1) {
        navigate(-1);
      } else {
        navigate(from);
      }
    } catch (e) {
      console.error("Error updating data", e);
      setStatus(`Unable to save task: ${e.message}. Please try again.`);
    }
  };

  if (isLoading) {
    return (
      <div className="edit-page">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading task...</p>
        </div>
      </div>
    );
  }

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
                required
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
                <label htmlFor="created" className="edit-label">
                  Created Date
                </label>
                <input
                  id="created"
                  name="created"
                  type="date"
                  value={taskData.created}
                  onChange={handleChange}
                  className="edit-input"
                  required
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
                  value={taskData.dueDate}
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

          {status && (
            <p
              className={`edit-status mt-4 ${status.includes("successfully") ? "text-green-600" : "text-red-600"}`}
            >
              {status}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Edit;
