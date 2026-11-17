import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiPlay, FiPause, FiRefreshCw, FiEdit2, FiCheck, FiSave } from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Pomodoro = () => {
  const [mode, setMode] = useState("work");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [currentTotalTime, setCurrentTotalTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [inputMinutes, setInputMinutes] = useState("");

  // New States
  const [taskTitle, setTaskTitle] = useState("");
  const [savedSessions, setSavedSessions] = useState([]);
  const [showSavePrompt, setShowSavePrompt] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${BASE_URL}/pomodoro`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setSavedSessions(data);
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };
    fetchSessions();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setShowSavePrompt(true);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Ease page background to --oxblood-ambient while running, back to --bg-canvas when paused
  useEffect(() => {
    const bg = document.getElementById("global-bg");
    if (!bg) return;
    if (isActive) {
      bg.style.backgroundColor = "var(--oxblood-ambient)";
    } else {
      bg.style.backgroundColor = "var(--bg-canvas)";
    }
    return () => {
      if (bg) bg.style.backgroundColor = "var(--bg-canvas)";
    };
  }, [isActive]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setIsEditingTime(false);
    setTimeLeft(currentTotalTime);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setIsEditingTime(false);
    let newTime = 25 * 60;
    if (newMode === "work") newTime = 25 * 60;
    if (newMode === "short") newTime = 5 * 60;
    if (newMode === "long") newTime = 15 * 60;
    setTimeLeft(newTime);
    setCurrentTotalTime(newTime);
  };

  const handleTimeSubmit = () => {
    const mins = parseInt(inputMinutes, 10);
    if (!isNaN(mins) && mins > 0) {
      setTimeLeft(mins * 60);
      setCurrentTotalTime(mins * 60);
    }
    setIsEditingTime(false);
  };

  const handleSaveSession = async () => {
    const duration = currentTotalTime - timeLeft;
    const sessionData = {
      title: taskTitle || "Untitled Task",
      duration: duration,
      mode: mode
    };

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${BASE_URL}/pomodoro`, {
        method: "POST",
        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(sessionData)
      });
      if (response.ok) {
        const newSession = await response.json();
        setSavedSessions([...savedSessions, newSession]);
      }
    } catch (error) {
      console.error("Error saving session:", error);
    }

    setShowSavePrompt(false);
    resetTimer();
    setTaskTitle("");
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progress = ((currentTotalTime - timeLeft) / currentTotalTime) * 100;

  return (
    <div className="relative md:left-[180px] top-0 min-h-screen w-full md:w-[calc(100%-312px)] text-[var(--text)] p-4 md:p-8">
      <div className="max-w-3xl mx-auto pb-16">

        <div className="rounded-[2rem] p-6 md:p-10 w-full min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--line-card)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>

          <div className="absolute top-6 left-6 md:top-8 md:left-10">
            <h1 className="text-2xl font-normal text-[var(--text-strong)] font-heading">Pomodoro</h1>
            <p className="text-[var(--text-muted)] text-sm">Stay focused and manage your breaks</p>
          </div>

          {/* Save Prompt Modal */}
          {showSavePrompt && (
            <div className="absolute inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-8 " style={{ background: 'rgba(0,0,0,0.72)' }}>
              <div className="p-8 rounded-3xl shadow-2xl max-w-md w-full" style={{ background: 'var(--raised)', border: '1px solid var(--line-card)', backdropFilter: 'blur(24px)' }}>
                <h2 className="text-3xl font-bold text-white mb-6">Save Session?</h2>
                <div className="rounded-xl p-6 mb-8" style={{ background: 'var(--hover)', border: '1px solid var(--line)' }}>
                  <p className="text-[var(--text-muted)] mb-2 text-sm uppercase tracking-wider">Task</p>
                  <p className="text-xl font-semibold text-white mb-4">{taskTitle || "Untitled Task"}</p>
                  <p className="text-[var(--text-muted)] mb-2 text-sm uppercase tracking-wider">Time Focused</p>
                  <p className="text-3xl font-black text-[var(--accent)] font-mono tabular-nums">
                    {Math.floor((currentTotalTime - timeLeft) / 60)}m {(currentTotalTime - timeLeft) % 60}s
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowSavePrompt(false)}
                    className="flex-1 py-4 rounded-xl font-bold text-[var(--text-muted)] hover:bg-[var(--hover)] transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSaveSession}
                    className="flex-1 py-4 rounded-xl font-bold bg-[var(--accent)] text-[var(--on-accent)] hover:bg-[var(--accent-hover)] transition-colors shadow-lg"
                  >
                    Save to Log
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 md:gap-4 mb-8 md:mb-12 mt-16">
            {["work", "short", "long"].map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`px-4 md:px-8 py-2 md:py-3 rounded-xl font-semibold text-sm md:text-base transition-all border ${
                  mode === m
                    ? "bg-[var(--oxblood-selected)] border-[var(--line-control)] text-[var(--text-strong)]"
                    : "bg-[var(--surface)] border-[var(--line-control)] text-[var(--text)] hover:bg-[var(--selected)]"
                }`}
              >
                {m === "work" ? "Focus" : m === "short" ? "Short" : "Long"}
              </button>
            ))}
          </div>

          <div className="w-full max-w-lg mb-6 md:mb-8 px-4">
            <input
              type="text"
              placeholder="What are you working on?"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full text-center text-xl md:text-2xl font-bold bg-transparent text-[var(--text-strong)] placeholder-[var(--text-subtle)] focus:outline-none focus:border-b-2 focus:border-[var(--accent)] transition-all pb-2"
            />
          </div>

          <div className="relative flex items-center justify-center mb-6 md:mb-12 scale-75 md:scale-90">
            <svg className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] transform -rotate-90" viewBox="0 0 440 440">
              <circle
                cx="220"
                cy="220"
                r="200"
                stroke="rgb(224 226 219 / 0.10)"
                strokeWidth="16"
                fill="transparent"
              />
              <motion.circle
                cx="220"
                cy="220"
                r="200"
                stroke="var(--accent)"
                strokeWidth="16"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 200}
                strokeDashoffset={2 * Math.PI * 200 * (1 - progress / 100)}
                strokeLinecap="round"
                initial={{ strokeDashoffset: 2 * Math.PI * 200 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 200 * (1 - progress / 100) }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              {isEditingTime ? (
                <div className="flex items-center gap-4 z-20">
                  <input
                    type="number"
                    value={inputMinutes}
                    onChange={(e) => setInputMinutes(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTimeSubmit()}
                    className="custom-number-input w-24 md:w-32 bg-[var(--surface)] text-[var(--text-strong)] text-4xl md:text-6xl font-black text-center rounded-xl border-2 border-[var(--accent)] focus:outline-none focus:ring-4 focus:ring-[var(--accent)]/30 py-2 font-mono tabular-nums"
                    min="1"
                    max="999"
                    autoFocus
                  />
                  <button
                    onClick={handleTimeSubmit}
                    className="text-[var(--on-accent)] hover:bg-[var(--accent-hover)] bg-[var(--accent)] p-3 rounded-xl transition-colors"
                  >
                    <FiCheck size={32} />
                  </button>
                </div>
              ) : (
                <div
                  className={`group flex flex-col items-center justify-center relative ${!isActive ? 'cursor-pointer' : ''}`}
                  onClick={() => {
                    if (!isActive) {
                      setIsEditingTime(true);
                      setInputMinutes(Math.ceil(timeLeft / 60).toString());
                    }
                  }}
                  title={!isActive ? "Click to edit time" : ""}
                >
                  <span className={`relative text-7xl md:text-8xl font-black tracking-widest transition-colors font-mono tabular-nums ${!isActive ? 'group-hover:text-[var(--accent)] text-[var(--text-strong)]' : 'text-[var(--text-strong)]'}`}>
                    {formatTime(timeLeft)}
                    {!isActive && (
                      <div className="absolute top-1/2 -right-5 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <FiEdit2 size={28} className="text-[var(--text-muted)]" />
                      </div>
                    )}
                  </span>
                </div>
              )}
              <span className="text-[var(--text-muted)] mt-4 font-bold uppercase tracking-[0.3em] text-sm md:text-base">
                {mode === "work" ? "Time to Focus" : "Break Time"}
              </span>
            </div>
          </div>

          <div className="flex gap-6">
            <button
              onClick={toggleTimer}
              className="w-20 h-20 md:w-24 md:h-24 rounded-lg transition-all flex items-center justify-center bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--on-accent)] hover:scale-105"
            >
              {isActive ? <FiPause size={36} /> : <FiPlay size={36} className="ml-1" />}
            </button>
            <button
              onClick={resetTimer}
              className="w-20 h-20 md:w-24 md:h-24 rounded-lg transition-all flex items-center justify-center hover:bg-[var(--hover)] hover:text-[var(--text-strong)] hover:scale-105 text-[var(--text-muted)]"
              style={{ background: 'var(--surface)', border: '1px solid var(--line-control)' }}
            >
              <FiRefreshCw size={36} />
            </button>
            {(currentTotalTime - timeLeft > 0) && (
              <button
                onClick={() => { setIsActive(false); setShowSavePrompt(true); }}
                className="w-20 h-20 md:w-24 md:h-24 rounded-lg transition-all flex items-center justify-center hover:bg-[var(--hover)] hover:text-[var(--text-strong)] hover:scale-105 text-[var(--text-muted)]"
                style={{ background: 'var(--surface)', border: '1px solid var(--line-control)' }}
              >
                <FiSave size={36} />
              </button>
            )}
          </div>

          {savedSessions.length > 0 && (
            <div className="mt-12 w-full max-w-2xl pt-6" style={{ borderTop: '1px solid var(--line)' }}>
              <h3 className="text-lg font-bold mb-3 text-[var(--text-muted)]">Today's Logs</h3>
              <div className="space-y-2">
                {savedSessions.slice(-3).map(session => (
                  <div key={session.id} className="flex justify-between items-center p-4 rounded-xl" style={{ background: 'var(--hover)', border: '1px solid var(--line)' }}>
                    <div>
                      <p className="font-semibold text-white text-base">{session.title}</p>
                      <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {session.mode}</p>
                    </div>
                    <span className="text-[var(--accent)] font-black text-lg font-mono tabular-nums">
                      {Math.floor(session.duration / 60)}m {session.duration % 60}s
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
