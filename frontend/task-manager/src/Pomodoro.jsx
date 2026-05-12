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
        const response = await fetch(`${BASE_URL}/pomodoro`);
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
      const response = await fetch(`${BASE_URL}/pomodoro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    <div className="md:ml-20 min-h-screen text-[#F1E9E9] p-4 md:p-8">
      <div className="max-w-5xl mx-auto pb-16">

        <div className="rounded-[2rem] p-6 md:p-12 w-full min-h-[75vh] flex flex-col items-center justify-center relative overflow-hidden" style={{ background: 'rgba(10,9,30,0.84)', border: '1px solid rgba(152,37,152,0.18)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: '0 24px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)' }}>

          <div className="absolute top-6 left-6 md:top-8 md:left-10">
            <h1 className="text-2xl font-bold text-white">Pomodoro</h1>
            <p className="text-[#B8AED4] text-sm">Stay focused and manage your breaks</p>
          </div>

          {/* Save Prompt Modal */}
          {showSavePrompt && (
            <div className="absolute inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-8 " style={{ background: 'rgba(0,0,0,0.72)' }}>
              <div className="p-8 rounded-3xl shadow-2xl max-w-md w-full" style={{ background: 'rgba(10,9,30,0.97)', border: '1px solid rgba(152,37,152,0.3)', backdropFilter: 'blur(24px)' }}>
                <h2 className="text-3xl font-bold text-white mb-6">Save Session?</h2>
                <div className="rounded-xl p-6 mb-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-[#B8AED4] mb-2 text-sm uppercase tracking-wider">Task</p>
                  <p className="text-xl font-semibold text-white mb-4">{taskTitle || "Untitled Task"}</p>
                  <p className="text-[#B8AED4] mb-2 text-sm uppercase tracking-wider">Time Focused</p>
                  <p className="text-3xl font-black text-[#982598]">
                    {Math.floor((currentTotalTime - timeLeft) / 60)}m {(currentTotalTime - timeLeft) % 60}s
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowSavePrompt(false)}
                    className="flex-1 py-4 rounded-xl font-bold text-[#B8AED4] hover:bg-[#15173D] transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSaveSession}
                    className="flex-1 py-4 rounded-xl font-bold bg-[#982598] text-white hover:bg-[#b02eb0] transition-colors shadow-lg"
                  >
                    Save to Log
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 md:gap-4 mb-10 md:mb-16 p-2 rounded-2xl mt-14" style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {["work", "short", "long"].map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`px-4 md:px-8 py-2 md:py-3 rounded-xl font-bold text-sm md:text-lg transition-all shadow-sm ${mode === m
                  ? "bg-[#982598] text-white"
                  : "text-[#B8AED4] hover:bg-[#982598]/30 hover:text-white"
                  }`}
              >
                {m === "work" ? "Focus" : m === "short" ? "Short" : "Long"}
              </button>
            ))}
          </div>

          <div className="w-full max-w-md md:max-w-2xl mb-6 md:mb-10 px-4">
            <input
              type="text"
              placeholder="What are you working on?"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full text-center text-xl md:text-3xl font-bold bg-transparent text-white placeholder-[#B8AED4]/40 focus:outline-none focus:border-b-2 focus:border-[#982598] transition-all pb-2"
            />
          </div>

          <div className="relative flex items-center justify-center mb-10 md:mb-16">
            <svg className="w-[280px] h-[280px] md:w-[440px] md:h-[440px] transform -rotate-90" viewBox="0 0 440 440">
              <circle
                cx="220"
                cy="220"
                r="200"
                className="stroke-[#15173D]"
                strokeWidth="16"
                fill="transparent"
              />
              <motion.circle
                cx="220"
                cy="220"
                r="200"
                className="stroke-[#982598]"
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
                    className="custom-number-input w-32 bg-[#15173D] text-white text-6xl font-black text-center rounded-xl border-2 border-[#982598] focus:outline-none focus:ring-4 focus:ring-[#982598]/30 py-2"
                    min="1"
                    max="999"
                    autoFocus
                  />
                  <button
                    onClick={handleTimeSubmit}
                    className="text-white hover:bg-[#b02eb0] bg-[#982598] p-3 rounded-xl transition-colors"
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
                  <span className={`relative text-8xl font-black tracking-widest drop-shadow-lg transition-colors ${!isActive ? 'group-hover:text-purple-200 text-white' : 'text-white'}`}>
                    {formatTime(timeLeft)}
                    {!isActive && (
                      <div className="absolute top-1/2 -right-5 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <FiEdit2 size={28} className="text-[#B8AED4]" />
                      </div>
                    )}
                  </span>
                </div>
              )}
              <span className="text-[#B8AED4] mt-6 font-bold uppercase tracking-[0.3em] text-xl">
                {mode === "work" ? "Time to Focus" : "Break Time"}
              </span>
            </div>
          </div>

          <div className="flex gap-8">
            <button
              onClick={toggleTimer}
              className="w-24 h-24 rounded-lg transition-all shadow-xl flex items-center justify-center bg-[#982598] hover:bg-[#ab3fb6] text-white hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
            >
              {isActive ? <FiPause size={40} /> : <FiPlay size={40} className="ml-2" />}
            </button>
            <button
              onClick={resetTimer}
              className="w-24 h-24 rounded-lg transition-all shadow-xl flex items-center justify-center hover:bg-[#ab3fb6] hover:text-white hover:scale-105 text-[#B8AED4]"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <FiRefreshCw size={40} />
            </button>
            {/* Show Save Button if they've worked for some time */}
            {(currentTotalTime - timeLeft > 0) && (
              <button
                onClick={() => { setIsActive(false); setShowSavePrompt(true); }}
                className="w-24 h-24 rounded-lg transition-all shadow-xl flex items-center justify-center hover:bg-[#ab3fb6] hover:text-white hover:scale-105 text-[#B8AED4]"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                title="Save Session"
              >
                <FiSave size={40} />
              </button>
            )}
          </div>

          {savedSessions.length > 0 && (
            <div className="mt-16 w-full max-w-2xl pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 className="text-xl font-bold mb-4 text-[#B8AED4]">Today's Logs</h3>
              <div className="space-y-3">
                {savedSessions.map(session => (
                  <div key={session.id} className="flex justify-between items-center p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div>
                      <p className="font-semibold text-white text-lg">{session.title}</p>
                      <p className="text-xs text-[#B8AED4] uppercase tracking-wider">{new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {session.mode}</p>
                    </div>
                    <span className="text-[#982598] font-black text-xl">
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
