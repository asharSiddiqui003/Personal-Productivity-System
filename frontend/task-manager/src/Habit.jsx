import { useState, useEffect } from 'react';
import { FiBook, FiSun, FiCode, FiActivity, FiHeart, FiStar, FiTarget, FiCoffee, FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import windowImage from './assets/habit_window.png';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ICONS = {
    sun: { component: FiSun, color: 'text-yellow-400' },
    book: { component: FiBook, color: 'text-blue-400' },
    code: { component: FiCode, color: 'text-green-400' },
    activity: { component: FiActivity, color: 'text-pink-400' },
    heart: { component: FiHeart, color: 'text-red-400' },
    star: { component: FiStar, color: 'text-yellow-300' },
    target: { component: FiTarget, color: 'text-purple-400' },
    coffee: { component: FiCoffee, color: 'text-orange-400' },
};

const mapHabit = (dbHabit) => ({
    id: dbHabit.id,
    title: dbHabit.habit_name,
    subtitle: dbHabit.subtitle,
    streak: dbHabit.count,
    done: dbHabit.status,
    icon: dbHabit.icon
});

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Habit() {
    const Navigate = useNavigate();
    // Habits state
    const [habits, setHabits] = useState([]);

    useEffect(() => {
        const fetchHabits = async () => {
            try {
                const res = await fetch(`${BASE_URL}/habits`);
                const data = await res.json();
                const rawHabits = data.rows || data || [];
                setHabits(rawHabits.map(mapHabit));
            } catch (e) {
                console.error("Failed to fetch habits", e);
            }
        };
        fetchHabits();
    }, []);

    const [selectedHabit, setSelectedHabit] = useState(null);
    const [isCompleting, setIsCompleting] = useState(false); // drives slider animation
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);

    // Reset animation every time a different habit is opened
    useEffect(() => {
        setIsCompleting(false);
    }, [selectedHabit]);

    const [formData, setFormData] = useState({ title: '', subtitle: '', icon: 'sun' });

    const handleComplete = async (id) => {
        if (isCompleting) return; // block double-click

        const habit = habits.find(h => h.id === id);
        if (!habit) return;

        const newStreak = habit.streak + 1;
        setIsCompleting(true);
        setHabits(prev => prev.map(h => h.id === id ? { ...h, streak: newStreak } : h));
        try {
            await fetch(`http://localhost:3000/habits/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: habit.title,
                    subtitle: habit.subtitle,
                    streak: newStreak,
                    done: true,
                    icon: habit.icon
                })
            });
        } catch (e) {
            console.error("Error completing habit", e);
        }
        setTimeout(() => {
            setSelectedHabit(null);
        }, 1000);
    };

    const handleOpenModal = (habit = null) => {
        if (habit) {
            setEditingHabit(habit);
            setFormData({ title: habit.title, subtitle: habit.subtitle, icon: habit.icon });
        } else {
            setEditingHabit(null);
            setFormData({ title: '', subtitle: '', icon: 'sun' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.title.trim()) return;

        if (editingHabit) {
            try {
                const res = await fetch(`${BASE_URL}/habits/${editingHabit.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: formData.title,
                        subtitle: formData.subtitle,
                        streak: editingHabit.streak,
                        done: editingHabit.done,
                        icon: formData.icon
                    })
                });
                const updatedHabit = await res.json();
                setHabits(habits.map(h => h.id === editingHabit.id ? mapHabit(updatedHabit) : h));
            } catch (e) {
                console.error("Error updating habit", e);
            }
        } else {
            try {
                const res = await fetch(`${BASE_URL}/habits`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: formData.title,
                        subtitle: formData.subtitle,
                        streak: 0,
                        done: false,
                        icon: formData.icon
                    })
                });
                const newHabit = await res.json();
                setHabits([...habits, mapHabit(newHabit)]);
            } catch (e) {
                console.error("Error adding habit", e);
            }
        }
        setIsModalOpen(false);
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`${BASE_URL}/habits/${id}`, { method: 'DELETE' });
            setHabits(habits.filter(h => h.id !== id));
            if (selectedHabit === id) setSelectedHabit(null);
        } catch (e) {
            console.error("Error deleting habit", e);
        }
    };

    return (
        <div className="min-h-screen px-4 md:pl-28 md:pr-8 pt-8 pb-8 text-[#F1E9E9] transition-all duration-300">
            <div className="rounded-[2rem] p-8 w-full relative" style={{ background: 'rgba(10,9,30,0.84)', border: '1px solid rgba(152,37,152,0.18)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: '0 24px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)' }}>

                {/* Heading */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white">Habits</h1>
                    <p className="text-[#B8AED4] text-sm">Track your daily habits and build streaks</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {habits.map((habit) => {
                        const IconComponent = ICONS[habit.icon]?.component || FiStar;
                        const iconColor = ICONS[habit.icon]?.color || 'text-white';
                        const GOAL = 30;
                        const progress = Math.min((habit.streak / GOAL) * 100, 100);
                        const daysLeft = GOAL - habit.streak;

                        return (
                            <div
                                key={habit.id}
                                onClick={() => setSelectedHabit(habit.id)}
                                className="rounded-2xl p-5 flex flex-col gap-4 cursor-pointer transition-all duration-200 group relative overflow-hidden"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(152,37,152,0.4)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                            >
                                {/* Edit / Delete — appear on hover */}
                                <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleOpenModal(habit); }}
                                        className="p-1.5 rounded-lg text-[#B8AED4] hover:text-white transition-colors"
                                        style={{ background: 'rgba(255,255,255,0.08)' }}
                                    >
                                        <FiEdit2 size={13} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(habit.id); }}
                                        className="p-1.5 rounded-lg text-[#B8AED4] hover:text-red-400 transition-colors"
                                        style={{ background: 'rgba(255,255,255,0.08)' }}
                                    >
                                        <FiTrash2 size={13} />
                                    </button>
                                </div>

                                {/* Icon */}
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                                >
                                    <IconComponent size={22} className={iconColor} />
                                </div>

                                {/* Title + subtitle */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-base text-white truncate leading-tight">{habit.title}</h3>
                                    <p className="text-sm text-[#7a7aac] truncate mt-0.5">{habit.subtitle || 'Daily habit'}</p>
                                </div>

                                {/* Streak + progress bar */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-[#7a7aac]">Streak</span>
                                        <span className="text-sm font-bold" style={{ color: '#c060c0' }}>
                                            🔥 {habit.streak} {habit.streak === 1 ? 'day' : 'days'}
                                        </span>
                                    </div>
                                    {/* Progress bar */}
                                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                        <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #982598, #c060c0)' }}
                                        />
                                    </div>
                                    <p className="text-[10px] text-white/25 mt-1.5">
                                        {daysLeft > 0 ? `${daysLeft} days to 30-day goal` : '🎉 30-day goal reached!'}
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    {/* Add New Habit Card */}
                    <div
                        onClick={() => handleOpenModal()}
                        className="rounded-2xl p-5 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 group"
                        style={{ border: '2px dashed rgba(184,174,212,0.2)', minHeight: '180px' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(152,37,152,0.5)'; e.currentTarget.style.background = 'rgba(152,37,152,0.04)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(184,174,212,0.2)'; e.currentTarget.style.background = 'transparent'; }}
                    >
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors" style={{ background: 'rgba(184,174,212,0.08)' }}>
                            <FiPlus size={22} className="text-[#B8AED4] group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-sm font-semibold text-[#B8AED4] group-hover:text-white transition-colors">Add Habit</span>
                    </div>
                </div>
            </div>

            {/* Completion Modal */}
            <AnimatePresence>
                {selectedHabit && (() => {
                    const habit = habits.find(h => h.id === selectedHabit);
                    if (!habit) return null;
                    const IconComponent = ICONS[habit.icon]?.component || FiStar;
                    const iconColor = ICONS[habit.icon]?.color || 'text-white';

                    return (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="w-full max-w-md p-8 relative" 
                                style={{ background: 'rgba(10,9,30,0.97)', border: '1px solid rgba(152,37,152,0.25)', borderRadius: '2.5rem', backdropFilter: 'blur(24px)', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}
                            >
                                <button
                                    onClick={() => setSelectedHabit(null)}
                                    className="absolute top-6 right-6 text-[#B8AED4] hover:text-white transition-colors"
                                >
                                    <FiX size={24} />
                                </button>

                                <div className="flex flex-col items-center">
                                    <div className="w-full max-w-[240px] aspect-square rounded-[2rem] overflow-hidden mb-6 shadow-2xl shadow-[#982598]/10 border-2 border-[#2a2c5b] relative group">
                                        <img src={windowImage} alt="Habit illustration" className="w-full h-full object-cover" />
                                        <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-[#15173D]/80 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/10">
                                            <IconComponent size={20} className={iconColor} />
                                        </div>
                                    </div>
                                    <h2 className="text-3xl font-bold mb-1 text-center text-white">{habit.title}</h2>
                                    <p className="text-[#B8AED4] mb-10 text-center">{habit.subtitle}</p>

                                    <div
                                        className={`w-[280px] rounded-full h-14 p-1.5 relative flex items-center shadow-lg overflow-hidden mx-auto transition-opacity duration-300 ${isCompleting ? 'cursor-default opacity-90' : 'cursor-pointer'}`}
                                        style={{ background: 'rgba(10,9,30,0.85)', border: '1px solid rgba(152,37,152,0.25)' }}
                                        onClick={() => handleComplete(habit.id)}
                                    >
                                        {/* Background text */}
                                        <div className={`absolute inset-0 flex items-center justify-center text-sm font-bold uppercase tracking-widest pointer-events-none select-none z-10 transition-colors duration-300 ${isCompleting ? 'text-white' : 'text-[#B8AED4]'}`}>
                                            {isCompleting ? 'Completed! 🎉' : 'Click to complete'}
                                        </div>

                                        {/* Fill background on completion */}
                                        <div className={`absolute left-0 top-0 bottom-0 bg-[#982598] rounded-full transition-all duration-500 ease-out z-0 ${isCompleting ? 'w-full' : 'w-0'}`}></div>

                                        {/* Slider thumb */}
                                        <div
                                            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 ease-out z-20 shadow-md bg-white text-[#982598] ${isCompleting ? 'translate-x-[220px]' : 'translate-x-0'}`}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    );
                })()}
            </AnimatePresence>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md p-8 relative animate-slide-down" style={{ background: 'rgba(10,9,30,0.97)', border: '1px solid rgba(152,37,152,0.25)', borderRadius: '2rem', backdropFilter: 'blur(24px)', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}>
                        <h2 className="text-3xl font-bold mb-6">{editingHabit ? 'Edit Habit' : 'New Habit'}</h2>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-[#B8AED4] mb-2 uppercase tracking-wider">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Drink Water"
                                    className="w-full focus:border-[#982598] rounded-xl px-4 py-3 text-white placeholder-[#B8AED4]/50 focus:outline-none focus:ring-2 focus:ring-[#982598]/30 transition-all"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#B8AED4] mb-2 uppercase tracking-wider">Subtitle</label>
                                <input
                                    type="text"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    placeholder="e.g., 8 glasses a day"
                                    className="w-full focus:border-[#982598] rounded-xl px-4 py-3 text-white placeholder-[#B8AED4]/50 focus:outline-none focus:ring-2 focus:ring-[#982598]/30 transition-all"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#B8AED4] mb-3 uppercase tracking-wider">Icon</label>
                                <div className="flex flex-wrap gap-3">
                                    {Object.entries(ICONS).map(([key, { component: Icon, color }]) => (
                                        <button
                                            key={key}
                                            onClick={() => setFormData({ ...formData, icon: key })}
                                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${formData.icon === key ? 'bg-[#982598] ring-4 ring-[#982598]/30 scale-110' : 'bg-[#2a2c5b] hover:bg-[#2a2c5b]/80'} `}
                                        >
                                            <Icon size={20} className={formData.icon === key ? 'text-white' : color} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-4 mt-10">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-3 rounded-xl bg-transparent border border-[#B8AED4]/30 text-[#B8AED4] font-semibold hover:bg-[#B8AED4]/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 py-3 rounded-xl bg-[#982598] text-white font-semibold hover:bg-indigo-500 shadow-lg hover:shadow-indigo-500/25 transition-all"
                            >
                                Save Habit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
