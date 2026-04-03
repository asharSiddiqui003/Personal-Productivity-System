import { GoStack } from "react-icons/go";
import Add from "./Add";
import Task from "./Task";
import { useState } from "react";

const All = () => {

  const[refreshKey, setRefreshKey] = useState(0);

  const refreshTasks = () => {
    setRefreshKey(prev => prev + 1); // This triggers Task to re-fetch
  };

  return (
    <div className="relative left-80 top-0 h-screen w-[1120px] ">
      <div className="flex items-center gap-2 my-2 font-bold">
        <GoStack size={36} />
        <h1 className="text-3xl">All</h1>
      </div>
      <div className="add-task">
        <Add onTaskAdded={refreshTasks}/>
      </div>
      <div>
        <Task refreshTrigger={refreshKey}/>
      </div>
    </div>
  );
};

export default All;
