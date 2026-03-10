import { GoStack } from "react-icons/go";
import Add from "./Add";
import Task from "./Task";
import { useState } from "react";

const All = () => {
  const [tasks, setTasks] = useState([]);

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  function addTask(taskFromServer) {
    setTasks((prev) => [taskFromServer, ...prev]);
  }

  return (
    <div className="relative left-80 top-0 h-screen w-[1120px] ">
      <div className="flex items-center gap-2 my-2 font-bold">
        <GoStack size={36} />
        <h1 className="text-3xl">All</h1>
      </div>
      <div className="add-task">
        <Add onAdd={addTask} />
      </div>
      <div>
        {tasks.map((t) => (
          <Task key={t.id} id={t.id} text={t.task} created={t.createdAt} priority={t.priority}/>
        ))}
      </div>
    </div>
  );
};

export default All;
