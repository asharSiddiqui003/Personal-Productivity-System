import { useState, useEffect } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import All from './All'
import Inbox from './Inbox'
import Next7D from './Next7D'
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
import GlobalBackground from './GlobalBackground'

function App() {
  const [activeNav, setActiveNav] = useState("Tasks");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  if (!isAuthenticated) {
    return (
      <>
        <GlobalBackground />
        <Routes>
          <Route path="/" element={<Introduction />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <GlobalBackground />
      <div className="pb-16 md:pb-0">
        <Navbar
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          onHamburgerClick={() => setMobileSidebarOpen(o => !o)}
        />
        <AnimatePresence>
          {activeNav === "Tasks" && (
            <Sidebar
              key="sidebar"
              mobileOpen={mobileSidebarOpen}
              onMobileClose={() => setMobileSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
        <Search isOpen={activeNav === "Search"} onClose={updateNavFromPath} />
        <Routes>
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/" element={<All />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/next-7d" element={<Next7D />} />
          <Route path="/habits" element={<Habit />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
        </Routes>
      </div>
    </>
  )
}

export default App
