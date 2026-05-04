import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import All from './All'
import Inbox from './Inbox'
import Next7D from './Next7D'
import Summary from './Summary'
import Edit from './Edit'
import Habit from './Habit'
import Calendar from './Calendar'
import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from 'framer-motion'


function App() {
  const [activeNav, setActiveNav] = useState("Tasks");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith('/habits')) {
      setActiveNav("Habit");
    } else if (location.pathname.startsWith('/calendar')) {
      setActiveNav("Calendar");
    } else if (location.pathname === '/' || location.pathname === '/inbox' || location.pathname === '/next-7d' || location.pathname === '/summary' || location.pathname.startsWith('/tasks')) {
      setActiveNav("Tasks");
    }
  }, [location.pathname]);

  return(
    <div>
      <Navbar activeNav={activeNav} setActiveNav={setActiveNav} />
      <AnimatePresence>
        {activeNav === "Tasks" && <Sidebar key="sidebar" />}
      </AnimatePresence>
      <Routes>
        <Route path="/" element = {<All />}/>
        <Route path="/inbox" element = {<Inbox />}/>
        <Route path="/next-7d" element = {<Next7D />}/>
        <Route path="/summary" element= {<Summary />} />
        <Route path='/tasks/edit/:task_id' element= {<Edit />} />
        <Route path="/habits" element={<Habit />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </div>
  
  )
}

export default App
