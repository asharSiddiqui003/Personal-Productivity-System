import { useState, useEffect } from 'react';
import {
    format, addMonths, subMonths, startOfMonth, endOfMonth,
    startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays
} from 'date-fns';
import { FiChevronLeft, FiChevronRight, FiCheckCircle } from 'react-icons/fi';

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch Tasks from backend
    const fetchTasks = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('accessToken');
            const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await fetch(`${BASE_URL}/tasks`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            const data = await response.json();
            setTasks(Array.isArray(data) ? data : data.rows || []);
        } catch (err) {
            console.error(err);
            setError('Error fetching tasks from the database.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Calendar Grid Logic
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const calendarDays = [];

    let day = startDate;
    while (day <= endDate) {
        calendarDays.push(day);
        day = addDays(day, 1);
    }

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    // Get tasks for a specific day
    const getTasksForDay = (date) => {
        return tasks.filter(task => {
            // Use dueDate if it exists, otherwise fallback to created
            const targetDateStr = task.dueDate || task.created;
            if (!targetDateStr) return false;

            try {
                // Handle different date string formats
                return isSameDay(new Date(targetDateStr), date);
            } catch (e) {
                return false;
            }
        });
    };

    const getPriorityBarColor = (priority) => {
        if (!priority) return 'rgb(224 226 219 / .45)';
        const p = priority.toLowerCase();
        if (p === 'high') return 'var(--danger)';
        if (p === 'medium') return 'var(--accent)';
        return 'rgb(224 226 219 / .45)';
    };

    return (
        <div className="relative md:left-[336px] top-0 min-h-screen w-full md:w-[calc(100%-336px)] text-[var(--text)] p-4 md:p-8 pt-8 pb-12 transition-all duration-300">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-normal font-heading text-[var(--text-strong)] mb-2">Calendar</h1>
                        <p className="text-[var(--text-muted)]">Your tasks mapped to your schedule</p>
                    </div>

                    <div className="flex items-center space-x-3 px-4 py-2 rounded-xl" style={{ background: 'var(--accent-tint)', border: '1px solid rgb(255 149 5 / 0.22)', color: 'var(--accent)' }}>
                        <FiCheckCircle size={20} />
                        <span className="font-semibold">Synced with Tasks</span>
                    </div>
                </div>

                {error && (
                    <div className="bg-[var(--danger)]/15 border border-[var(--danger)]/40 text-[var(--danger)] px-6 py-4 rounded-2xl mb-8 flex items-center justify-between">
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="text-[var(--danger)] hover:text-[var(--text-strong)]">&times;</button>
                    </div>
                )}

                {/* Calendar Card */}
                <div className="rounded-[2rem] p-8" style={{ background: 'var(--surface)', border: '1px solid var(--line-card)' }}>

                    {/* Month Controls */}
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-normal font-heading text-[var(--text-strong)] tracking-wide">
                            {format(currentDate, "MMMM yyyy")}
                        </h2>
                        <div className="flex space-x-2">
                            <button onClick={prevMonth} className="p-3 rounded-xl hover:bg-[var(--raised)] hover:border-[var(--line-control)] transition-colors" style={{ background: 'var(--surface)', border: '1px solid var(--line-control)', color: 'var(--text)' }}>
                                <FiChevronLeft size={24} />
                            </button>
                            <button onClick={nextMonth} className="p-3 rounded-xl hover:bg-[var(--raised)] hover:border-[var(--line-control)] transition-colors" style={{ background: 'var(--surface)', border: '1px solid var(--line-control)', color: 'var(--text)' }}>
                                <FiChevronRight size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Days of week header */}
                    <div className="grid grid-cols-7 mb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center font-semibold text-[var(--text-subtle)] uppercase text-sm tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-7 gap-3">
                        {calendarDays.map((day, i) => {
                            const dayTasks = getTasksForDay(day);
                            const isCurrentMonth = isSameMonth(day, monthStart);
                            const isToday = isSameDay(day, new Date());
                            const isSelected = selectedDay && isSameDay(day, selectedDay);

                            return (
                                <div
                                    key={i}
                                    onClick={() => setSelectedDay(day)}
                                    className={`min-h-[80px] md:min-h-[120px] rounded-2xl p-2 md:p-3 border transition-all cursor-pointer
                                        ${!isCurrentMonth ? 'opacity-30' : 'hover:border-[var(--line-control)]'}
                                        ${isToday ? 'ring-1 ring-[var(--accent)]' : ''}
                                    `}
                                    style={{
                                        background: isSelected
                                            ? 'var(--oxblood-selected)'
                                            : isCurrentMonth
                                                ? 'var(--surface)'
                                                : 'transparent',
                                        borderColor: 'var(--line)',
                                    }}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-lg font-bold font-mono tabular-nums ${isToday ? 'text-[var(--accent)]' : 'text-[var(--text-strong)]'}`}>
                                            {format(day, dateFormat)}
                                        </span>
                                        {dayTasks.length > 0 && (
                                            <span className="text-xs font-bold font-mono tabular-nums bg-[var(--accent)] text-[var(--on-accent)] px-2 py-0.5 rounded-full">
                                                {dayTasks.length}
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-1.5 overflow-y-auto max-h-[80px] custom-scrollbar pr-1">
                                        {isLoading && <div className="text-xs text-[var(--text-muted)] animate-pulse">Loading...</div>}
                                        {!isLoading && dayTasks.map(task => {
                                            const isCompleted = task.status === 'completed';

                                            return (
                                                <div
                                                    key={task.task_id}
                                                    className={`
                                                        text-xs truncate px-2 py-1.5 rounded-r font-medium
                                                        ${isCompleted ? 'text-[var(--text-subtle)] line-through' : 'text-[var(--text)]'}
                                                    `}
                                                    style={{
                                                        background: 'rgb(224 226 219 / .06)',
                                                        borderLeft: `3px solid ${getPriorityBarColor(task.priority)}`,
                                                    }}
                                                    title={task.title}
                                                >
                                                    {task.title}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </div>
    );
}
