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
import Landing from './landing/Landing'
import { Routes, Route, useLocation, Navigate } from "react-router-dom"
import { AnimatePresence, MotionConfig } from 'framer-motion'
import GlobalBackground from './GlobalBackground'

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const AUTH_URL = import.meta.env.VITE_AUTH_URL || "http://localhost:4000";

function App() {
  const [activeNav, setActiveNav] = useState("Tasks");
  // null = still checking with server, true/false = known auth state
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // On mount: check localStorage for a token and verify it with the server
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { setIsAuthenticated(false); return; }
    fetch(`${BASE_URL}/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => setIsAuthenticated(res.ok))
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await fetch(`${AUTH_URL}/logout`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: refreshToken })
      });
    } catch (err) {
      console.error('Logout error:', err);
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
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

  // Still checking with server — show a spinner to avoid flash
  if (isAuthenticated === null) {
    return (
      <>
        <GlobalBackground />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        {/* Landing owns its full-bleed bg; GlobalBackground must NOT render here */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<><GlobalBackground /><Login onLogin={handleLogin} /></>} />
        <Route path="/signup" element={<><GlobalBackground /><Signup onLogin={handleLogin} /></>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
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
    </MotionConfig>
  )
}

export default App
