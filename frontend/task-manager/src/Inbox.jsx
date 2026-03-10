import { FiInbox } from "react-icons/fi";
import Add from "./Add";
import Task from "./Task";
import { useState } from "react";


const Inbox = () => {
    const [tasks,setTasks] = useState([]);

    function addTask(text){
        const newTask = {id: Date.now(), text};
        setTasks(prev => [newTask, ...prev]);
    }
    return (
        <div className="relative left-80 top-0 h-screen w-[1120px] ">
            <div className="flex items-center gap-2 my-2 font-bold">
                <FiInbox size={36} />
                <h1 className="text-3xl">Inbox</h1>
            </div>
            <div className="add-task">
                <Add onAdd={addTask}/>
            </div>
            <div>
                {tasks.map(t => <Task key={t.id} id={t.id} text={t.text}/>)}
            </div>
        </div>
        
    );
}




export default Inbox;