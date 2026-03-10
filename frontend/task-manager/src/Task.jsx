import { useState } from "react";

const Task = (props) => {
    return (
        <div className="task-bar w-[1070px] relative">
            <input type="checkbox" className="w-[24px] h-[24px] absolute top-[36px] left-[70px]"/>
           <p className="absolute left-[128px] top-[26px] text-4xl ">{props.text}</p> 
           <p className="absolute left-[820px] top-[32px] text-2xl">{props.created}</p>
           <div className="w-[2px] h-[60px] bg-[#982598] rounded-full absolute left-[966px] top-[18px]"></div>
           <p className="absolute top-[32px] text-2xl left-[980px]" >{props.priority}</p>
        </div>  
    )
}

export default Task;