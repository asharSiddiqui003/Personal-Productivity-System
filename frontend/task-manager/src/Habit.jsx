import { useState } from 'react';
import { FiBook, FiSun, FiCode, FiActivity, FiHeart, FiStar, FiTarget, FiCoffee, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import windowImage from './assets/habit_window.png';

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

export default function Habit() {
    // Habits state
    const [habits, setHabits] = useState([
        { id: 1, title: 'Early to Rise', subtitle: 'Get up and be amazing', streak: 0, done: false, icon: 'sun' },
        { id: 2, title: 'Read', subtitle: 'A chapter a day', streak: 0, done: false, icon: 'book' },
        { id: 3, title: 'Learn coding', subtitle: 'Practice makes perfect', streak: 0, done: false, icon: 'code' },
        { id: 4, title: 'Something new', subtitle: 'Expand your horizons', streak: 0, done: false, icon: 'target' },
        { id: 5, title: 'Exercise', subtitle: 'Stay fit and healthy', streak: 0, done: false, icon: 'activity' },
    ]);

    const [selectedHabit, setSelectedHabit] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);

    const [formData, setFormData] = useState({ title: '', subtitle: '', icon: 'sun' });

    const handleToggleDone = (id) => {
        setHabits(habits.map(h => {
            if (h.id === id) {
                const newDone = !h.done;
                return { ...h, done: newDone, streak: newDone ? h.streak + 1 : Math.max(0, h.streak - 1) };
            }
            return h;
        }));
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

    const handleSave = () => {
        if (!formData.title.trim()) return;
        
        if (editingHabit) {
            setHabits(habits.map(h => h.id === editingHabit.id ? { ...h, ...formData } : h));
        } else {
            setHabits([...habits, { 
                id: Date.now(), 
                title: formData.title, 
                subtitle: formData.subtitle, 
                streak: 0, 
                done: false, 
                icon: formData.icon 
            }]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        setHabits(habits.filter(h => h.id !== id));
        if (selectedHabit === id) setSelectedHabit(null);
    };

    if (selectedHabit) {
        const habit = habits.find(h => h.id === selectedHabit);
        if (!habit) return null;
        
        const IconComponent = ICONS[habit.icon]?.component || FiStar;
        const iconColor = ICONS[habit.icon]?.color || 'text-white';

        return (
            <div className="min-h-screen pl-24 pr-8 pt-8 bg-[#15173D] text-[#F1E9E9] transition-all duration-300">
                <div className="flex justify-between items-center mb-6 max-w-md mx-auto w-full">
                    <button 
                        onClick={() => setSelectedHabit(null)}
                        className="hover:text-white text-[#B8AED4] transition-colors flex items-center space-x-2"
                    >
                        <span>&larr;</span> <span>Back to Habits</span>
                    </button>
                    <div className="flex space-x-3">
                        <button onClick={() => { setSelectedHabit(null); handleOpenModal(habit); }} className="p-2 rounded-xl bg-[#2a2c5b] hover:bg-indigo-500 transition-colors text-[#B8AED4] hover:text-white">
                            <FiEdit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(habit.id)} className="p-2 rounded-xl bg-[#2a2c5b] hover:bg-red-500 transition-colors text-[#B8AED4] hover:text-white">
                            <FiTrash2 size={18} />
                        </button>
                    </div>
                </div>
                <div className="max-w-md mx-auto mt-4 flex flex-col items-center">
                    <div className="w-full max-w-[320px] aspect-square rounded-[3rem] overflow-hidden mb-8 shadow-2xl shadow-[#982598]/10 border-4 border-[#2a2c5b] relative group">
                        <img src={windowImage} alt="Habit illustration" className="w-full h-full object-cover" />
                        <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#15173D]/80 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/10">
                            <IconComponent size={24} className={iconColor} />
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold mb-2 text-center">{habit.title}</h2>
                    <p className="text-[#B8AED4] mb-12 text-lg text-center">{habit.subtitle}</p>
                    
                    <div 
                        className="w-[300px] bg-[#2a2c5b] rounded-full h-16 p-2 relative flex items-center shadow-lg border border-[#2a2c5b]/50 cursor-pointer overflow-hidden mx-auto"
                        onClick={() => handleToggleDone(habit.id)}
                    >
                        {/* Background text */}
                        <div className={`absolute inset-0 flex items-center justify-center font-medium pointer-events-none select-none z-10 transition-colors duration-300 ${habit.done ? 'text-white' : 'text-[#B8AED4]'}`}>
                            {habit.done ? 'Completed!' : 'Slide to complete'}
                        </div>
                        
                        {/* Fill background when done */}
                        <div className={`absolute left-0 top-0 bottom-0 bg-[#982598] rounded-full transition-all duration-300 ease-out z-0 ${habit.done ? 'w-full' : 'w-0'}`}></div>

                        {/* Slider thumb */}
                        <div 
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ease-out z-20 shadow-md ${habit.done ? 'bg-white text-[#982598] translate-x-[236px]' : 'bg-white text-[#982598] translate-x-0'}`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pl-24 pr-8 pt-8 pb-20 bg-[#15173D] text-[#F1E9E9] transition-all duration-300 relative">
            <h1 className="text-4xl font-bold mb-8">Habits</h1>
            <div className="bg-[#2a2c5b] rounded-[2rem] p-8 shadow-2xl border border-[#2a2c5b]/50 w-full max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {habits.map((habit) => {
                        const IconComponent = ICONS[habit.icon]?.component || FiStar;
                        const iconColor = ICONS[habit.icon]?.color || 'text-white';
                        
                        return (
                            <div 
                                key={habit.id} 
                                onClick={() => setSelectedHabit(habit.id)}
                                className={`bg-[#15173D]/60 hover:bg-[#15173D] rounded-2xl p-6 flex items-center space-x-6 cursor-pointer transition-all duration-200 border border-transparent hover:border-[#982598]/50 group relative overflow-hidden`}
                            >
                                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleOpenModal(habit); }} 
                                        className="p-1.5 rounded-lg hover:bg-indigo-500/50 text-[#B8AED4] hover:text-white transition-colors"
                                    >
                                        <FiEdit2 size={14} />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDelete(habit.id); }} 
                                        className="p-1.5 rounded-lg hover:bg-red-500/50 text-[#B8AED4] hover:text-white transition-colors"
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                                <div className="w-16 h-16 rounded-full bg-[#2a2c5b] flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0 shadow-inner">
                                    <IconComponent size={28} className={iconColor} />
                                </div>
                                <div className="flex-1 pr-6 min-w-0">
                                    <h3 className="font-bold text-xl truncate">{habit.title}</h3>
                                    <p className="text-md text-[#B8AED4]">{habit.streak} day{habit.streak !== 1 && 's'}</p>
                                </div>
                            </div>
                        );
                    })}
                    
                    {/* Add New Habit Card */}
                    <div 
                        onClick={() => handleOpenModal()}
                        className={`bg-transparent hover:bg-[#15173D]/40 border-2 border-dashed border-[#B8AED4]/30 hover:border-[#982598]/50 rounded-2xl p-6 flex items-center justify-center space-x-4 cursor-pointer transition-all duration-200 group`}
                    >
                        <div className="w-12 h-12 rounded-full bg-[#B8AED4]/10 flex items-center justify-center group-hover:bg-[#982598]/20 transition-colors">
                            <FiPlus size={24} className="text-[#B8AED4] group-hover:text-white" />
                        </div>
                        <h3 className="font-bold text-xl text-[#B8AED4] group-hover:text-white">Add Habit</h3>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[#15173D] border border-[#2a2c5b] rounded-[2rem] w-full max-w-md p-8 shadow-2xl relative animate-slide-down">
                        <h2 className="text-3xl font-bold mb-6">{editingHabit ? 'Edit Habit' : 'New Habit'}</h2>
                        
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-[#B8AED4] mb-2 uppercase tracking-wider">Title</label>
                                <input 
                                    type="text" 
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    placeholder="e.g., Drink Water"
                                    className="w-full bg-[#2a2c5b] border border-[#2a2c5b] focus:border-[#982598] rounded-xl px-4 py-3 text-white placeholder-[#B8AED4]/50 focus:outline-none focus:ring-2 focus:ring-[#982598]/30 transition-all"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-[#B8AED4] mb-2 uppercase tracking-wider">Subtitle</label>
                                <input 
                                    type="text" 
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                                    placeholder="e.g., 8 glasses a day"
                                    className="w-full bg-[#2a2c5b] border border-[#2a2c5b] focus:border-[#982598] rounded-xl px-4 py-3 text-white placeholder-[#B8AED4]/50 focus:outline-none focus:ring-2 focus:ring-[#982598]/30 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#B8AED4] mb-3 uppercase tracking-wider">Icon</label>
                                <div className="flex flex-wrap gap-3">
                                    {Object.entries(ICONS).map(([key, { component: Icon, color }]) => (
                                        <button
                                            key={key}
                                            onClick={() => setFormData({...formData, icon: key})}
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
