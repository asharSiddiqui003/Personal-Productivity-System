import React, { useState, useEffect } from 'react';
import { IoSearch, IoClose } from 'react-icons/io5';
import { FiFilter, FiCalendar, FiCheckSquare, FiActivity } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Search({ isOpen, onClose }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [activeSort, setActiveSort] = useState('Newest');

    // ==========================================
    // EVENT HANDLERS SKELETON
    // You can connect these to your database fetching logic
    // ==========================================

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        // TODO: Add your database search logic here using the 'value'
    };

    const handleFilterClick = (filter) => {
        setActiveFilter(filter);
        // TODO: Add your database filtering logic here using the 'filter'
    };

    const handleSortChange = (e) => {
        const sort = e.target.value;
        setActiveSort(sort);
        // TODO: Add your database sorting logic here using the 'sort'
    };

    const handleResultClick = (resultId) => {
        // TODO: Handle navigation or opening the specific item
        console.log(`Navigating to item ${resultId}`);
        onClose();
    };

    // Close modal when pressing the Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Placeholder mock data to demonstrate styling
    const mockResults = [
        { id: 1, type: 'Task', title: 'Complete project proposal', date: 'Today' },
        { id: 2, type: 'Habit', title: 'Drink 8 glasses of water', date: 'Daily' },
        { id: 3, type: 'Event', title: 'Team Meeting', date: 'Tomorrow, 10:00 AM' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex justify-center items-start pt-[10vh] px-4">

                    {/* Backdrop overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, y: -40, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="relative w-full max-w-3xl bg-[#15173D] border border-[#2a2c5b] shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[80vh]"
                    >
                        {/* Search Input Header */}
                        <div className="relative border-b border-[#2a2c5b] bg-[#1D1F49] p-4 flex items-center">
                            <IoSearch size={28} className="text-[#982598] ml-2 mr-4 flex-shrink-0" />
                            <input
                                type="text"
                                autoFocus
                                placeholder="Search tasks, habits, events..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="flex-1 bg-transparent border-none outline-none text-2xl text-[#F1E9E9] placeholder-[#B8AED4]/50"
                            />
                            <button
                                onClick={onClose}
                                className="p-2 ml-4 rounded-xl hover:bg-[#2a2c5b] text-[#B8AED4] hover:text-white transition-colors flex-shrink-0"
                            >
                                <IoClose size={24} />
                            </button>
                        </div>

                        {/* Filters and Sorting Bar */}
                        <div className="flex flex-wrap items-center justify-between p-4 bg-[#15173D] border-b border-[#2a2c5b]/50 gap-4">
                            {/* Category Pills */}
                            <div className="flex space-x-2">
                                {['All', 'Tasks', 'Habits', 'Calendar'].map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => handleFilterClick(filter)}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeFilter === filter
                                            ? 'bg-[#982598] text-white shadow-lg shadow-[#982598]/20 ring-2 ring-[#982598]/50'
                                            : 'bg-[#2a2c5b] text-[#B8AED4] hover:bg-[#2a2c5b]/80 hover:text-white'
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>

                            {/* Sorting Dropdown */}
                            <div className="flex items-center space-x-3 text-sm">
                                <span className="text-[#B8AED4] flex items-center space-x-1">
                                    <FiFilter size={14} />
                                    <span>Sort by:</span>
                                </span>
                                <select
                                    value={activeSort}
                                    onChange={handleSortChange}
                                    className="bg-[#2a2c5b] text-white border border-[#2a2c5b] rounded-lg px-3 py-1.5 outline-none focus:border-[#982598] cursor-pointer hover:bg-[#2a2c5b]/80 transition-colors"
                                >
                                    <option value="Newest">Newest</option>
                                    <option value="Oldest">Oldest</option>
                                    <option value="Relevance">Relevance</option>
                                    <option value="A-Z">A-Z</option>
                                </select>
                            </div>
                        </div>

                        {/* Results Area */}
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#15173D]">
                            {searchTerm && mockResults.length > 0 ? (
                                <div className="space-y-3 pb-4">
                                    <h3 className="text-xs font-bold text-[#B8AED4] uppercase tracking-widest mb-4 px-2">
                                        Found {mockResults.length} results
                                    </h3>

                                    {mockResults.map((result) => (
                                        <div
                                            key={result.id}
                                            onClick={() => handleResultClick(result.id)}
                                            className="group flex items-center justify-between p-4 rounded-2xl bg-[#1D1F49]/50 hover:bg-[#2a2c5b] border border-transparent hover:border-[#982598]/30 transition-all cursor-pointer shadow-sm hover:shadow-md"
                                        >
                                            <div className="flex items-center space-x-4">
                                                {/* Dynamic Icon based on type */}
                                                <div className={`p-3 rounded-xl ${result.type === 'Task' ? 'bg-blue-500/20 text-blue-400' :
                                                    result.type === 'Habit' ? 'bg-pink-500/20 text-pink-400' :
                                                        'bg-purple-500/20 text-purple-400'
                                                    }`}>
                                                    {result.type === 'Task' && <FiCheckSquare size={20} />}
                                                    {result.type === 'Habit' && <FiActivity size={20} />}
                                                    {result.type === 'Event' && <FiCalendar size={20} />}
                                                </div>

                                                <div>
                                                    <h4 className="text-lg font-semibold text-white group-hover:text-[#982598] transition-colors">{result.title}</h4>
                                                    <span className="text-sm text-[#B8AED4]">{result.type} &bull; {result.date}</span>
                                                </div>
                                            </div>

                                            {/* Hover Arrow indicator */}
                                            <div className="w-8 h-8 rounded-full bg-[#15173D] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                <span className="text-[#982598] font-bold">&rarr;</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : searchTerm ? (
                                // Empty state when typing but no results
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-20 h-20 rounded-full bg-[#2a2c5b]/50 flex items-center justify-center mb-6">
                                        <IoSearch size={36} className="text-[#B8AED4]/40" />
                                    </div>
                                    <p className="text-xl font-semibold text-[#F1E9E9]">No results found for "{searchTerm}"</p>
                                    <p className="text-md text-[#B8AED4] mt-2 max-w-sm">We couldn't find what you're looking for. Try adjusting your filters or search terms.</p>
                                </div>
                            ) : (
                                // Initial empty state
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <p className="text-[#B8AED4] text-lg">Start typing to search your workspace...</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
