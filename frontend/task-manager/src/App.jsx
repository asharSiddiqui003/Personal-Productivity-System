import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import All from './All'
import Inbox from './Inbox'
import Next7D from './Next7D'
import Edit from './Edit'
import Habit from './Habit'
import Calendar from './Calendar'
import Pomodoro from './Pomodoro'
import Search from './Search'
import Profile from './Profile'
import Login from './Login'
import Signup from './Signup'
import Introduction from './Introduction'
import { Routes, Route, useLocation, Navigate } from "react-router-dom"
import { AnimatePresence } from 'framer-motion'


function App() {
  const [activeNav, setActiveNav] = useState("Tasks");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const location = useLocation();

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const updateNavFromPath = () => {
    if (location.pathname.startsWith('/habits')) {
      setActiveNav("Habit");
    } else if (location.pathname.startsWith('/pomodoro')) {
      setActiveNav("Pomodoro");
    } else if (location.pathname.startsWith('/profile')) {
      setActiveNav("Profile");
    } else if (location.pathname === '/' || location.pathname === '/inbox' || location.pathname === '/next-7d' || location.pathname.startsWith('/tasks') || location.pathname.startsWith('/calendar')) {
      setActiveNav("Tasks");
    } else {
      setActiveNav("Tasks");
    }
  };

  useEffect(() => {
    updateNavFromPath();
  }, [location.pathname]);

  // if (!isAuthenticated) {
  //   return (
  //     <Routes>
  //       <Route path="/" element={<Introduction />} />
  //       <Route path="/login" element={<Login onLogin={handleLogin} />} />
  //       <Route path="/signup" element={<Signup />} />
  //       <Route path="*" element={<Navigate to="/" replace />} />
  //     </Routes>
  //   );
  // }

  return (
    <div>
      <Navbar activeNav={activeNav} setActiveNav={setActiveNav} />
      <AnimatePresence>
        {activeNav === "Tasks" && <Sidebar key="sidebar" />}
      </AnimatePresence>
      <Search isOpen={activeNav === "Search"} onClose={updateNavFromPath} />
      <Routes>
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/" element={<All />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/next-7d" element={<Next7D />} />
        <Route path='/tasks/edit/:task_id' element={<Edit />} />
        <Route path="/habits" element={<Habit />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/pomodoro" element={<Pomodoro />} />
        <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
      </Routes>
    </div>

  )
}

export default App
