import { useState, useEffect } from 'react';
import {
    format, addMonths, subMonths, startOfMonth, endOfMonth,
    startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays
} from 'date-fns';
import { FiChevronLeft, FiChevronRight, FiCheckCircle } from 'react-icons/fi';

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch Tasks from backend
    const fetchTasks = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3000/tasks');
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

    const getPriorityColor = (priority) => {
        if (!priority) return 'bg-[#2a2c5b] text-[#B8AED4] border-[#B8AED4]/10';
        const p = priority.toLowerCase();
        if (p === 'high') return 'bg-red-500/20 text-red-300 border-red-500/30';
        if (p === 'medium') return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
        if (p === 'low') return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
        return 'bg-[#2a2c5b] text-[#B8AED4] border-[#B8AED4]/10';
    };

    return (
        <div className="min-h-screen pl-24 pr-8 pt-8 pb-12 bg-[#15173D] text-[#F1E9E9] transition-all duration-300">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Calendar</h1>
                        <p className="text-[#B8AED4]">Your tasks mapped to your schedule</p>
                    </div>

                    <div className="flex items-center space-x-3 text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl shadow-lg">
                        <FiCheckCircle size={20} />
                        <span className="font-semibold">Synced with Tasks</span>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-2xl mb-8 flex items-center justify-between">
                        <span>{error}</span>
                        <button onClick={() => setError(null)} className="text-red-300 hover:text-white">&times;</button>
                    </div>
                )}

                {/* Calendar Card */}
                <div className="bg-[#2a2c5b] rounded-[2rem] p-8 shadow-2xl border border-[#2a2c5b]/50">

                    {/* Month Controls */}
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-white tracking-wide">
                            {format(currentDate, "MMMM yyyy")}
                        </h2>
                        <div className="flex space-x-2">
                            <button onClick={prevMonth} className="p-3 bg-[#15173D] rounded-xl hover:bg-[#982598] transition-colors shadow-md">
                                <FiChevronLeft size={24} />
                            </button>
                            <button onClick={nextMonth} className="p-3 bg-[#15173D] rounded-xl hover:bg-[#982598] transition-colors shadow-md">
                                <FiChevronRight size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Days of week header */}
                    <div className="grid grid-cols-7 mb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center font-semibold text-[#B8AED4] uppercase text-sm tracking-wider">
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

                            return (
                                <div
                                    key={i}
                                    className={`
                                        min-h-[120px] rounded-2xl p-3 border border-transparent transition-all
                                        ${!isCurrentMonth ? 'opacity-30 bg-[#1D1F49]/30' : 'bg-[#15173D]/60 hover:border-[#982598]/50'}
                                        ${isToday ? 'ring-2 ring-[#982598] bg-[#982598]/10 shadow-inner' : ''}
                                    `}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-lg font-bold ${isToday ? 'text-[#982598]' : 'text-[#F1E9E9]'}`}>
                                            {format(day, dateFormat)}
                                        </span>
                                        {dayTasks.length > 0 && (
                                            <span className="text-xs font-bold bg-[#982598] text-white px-2 py-1 rounded-full shadow-md">
                                                {dayTasks.length}
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-1.5 overflow-y-auto max-h-[80px] custom-scrollbar pr-1">
                                        {isLoading && <div className="text-xs text-[#B8AED4] animate-pulse">Loading...</div>}
                                        {!isLoading && dayTasks.map(task => {
                                            const isCompleted = task.status === 'completed';

                                            return (
                                                <div
                                                    key={task.task_id}
                                                    className={`
                                                        text-xs truncate px-2 py-1.5 rounded-lg border font-medium
                                                        ${isCompleted ? 'bg-[#1D1F49] text-[#B8AED4]/50 border-transparent line-through' : getPriorityColor(task.priority)}
                                                    `}
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
