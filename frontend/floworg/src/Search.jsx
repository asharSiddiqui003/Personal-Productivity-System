import React, { useState, useEffect } from 'react';
import { IoSearch, IoClose } from 'react-icons/io5';
import { FiFilter, FiCalendar, FiCheckSquare, FiActivity } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Search({ isOpen, onClose }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [activeSort, setActiveSort] = useState('Newest');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterClick = (filter) => {
        setActiveFilter(filter);
    };

    const handleSortChange = (e) => {
        setActiveSort(e.target.value);
    };

    const handleResultClick = (resultId) => {
        // Handle navigation to the specific item
        console.log(`Navigating to item ${resultId}`);
        onClose();
    };

    // Debounced fetch effect for searching
    useEffect(() => {
        if (!searchTerm.trim()) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('accessToken');
                const res = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(searchTerm)}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();

                const rows = data.rows || data || [];

                // Map tasks from the backend to the generic result structure
                // Note: The current backend query only searches 'tasks'
                const formattedResults = rows.map(item => ({
                    id: item.task_id,
                    type: 'Task',
                    title: item.title,
                    date: item.created ? new Date(item.created).toLocaleDateString() : 'No date',
                    timestamp: item.created ? new Date(item.created).getTime() : 0
                }));

                setResults(formattedResults);
            } catch (error) {
                console.error("Error fetching search results:", error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchResults();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

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

    // Compute displayed results directly
    const displayedResults = results
        .filter(r => activeFilter === 'All' || activeFilter === r.type)
        .sort((a, b) => {
            if (activeSort === 'Newest') return b.timestamp - a.timestamp;
            if (activeSort === 'Oldest') return a.timestamp - b.timestamp;
            if (activeSort === 'A-Z') return a.title.localeCompare(b.title);
            return 0; // Default/Relevance
        });

    // Helper to get color class based on type
    const getResultColorClass = (type) => {
        if (type === 'Task') {
            return 'bg-[var(--accent-tint)] text-[var(--accent)]';
        } else if (type === 'Habit') {
            return 'bg-[rgb(224,226,219,0.08)] text-[var(--text-strong)]';
        } else {
            return 'bg-[rgb(224,226,219,0.08)] text-[var(--text-strong)]';
        }
    };

    // Helper to render the results area without nested ternaries
    const renderResultsArea = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-10 h-10 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-[var(--text-muted)] text-lg">Searching...</p>
                </div>
            );
        } else if (searchTerm && displayedResults.length > 0) {
            return (
                <div className="space-y-3 pb-4">
                    <h3 className="text-xs font-bold font-mono tabular-nums text-[var(--text-subtle)] uppercase tracking-widest mb-4 px-2">
                        Found {displayedResults.length} results
                    </h3>

                    {displayedResults.map((result) => (
                        <div
                            key={result.id}
                            onClick={() => handleResultClick(result.id)}
                            className="group flex items-center justify-between p-4 rounded-2xl bg-[var(--surface)] hover:bg-[var(--oxblood-selected)] border border-[var(--line-card)] transition-all cursor-pointer"
                        >
                            <div className="flex items-center space-x-4">
                                {/* Dynamic Icon based on type */}
                                <div className={`p-3 rounded-xl ${getResultColorClass(result.type)}`}>
                                    {result.type === 'Task' && <FiCheckSquare size={20} />}
                                    {result.type === 'Habit' && <FiActivity size={20} />}
                                    {result.type === 'Event' && <FiCalendar size={20} />}
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold text-[var(--text-strong)] group-hover:text-[var(--text-strong)] transition-colors">{result.title}</h4>
                                    <span className="text-sm text-[var(--text-muted)]">{result.type} &bull; {result.date}</span>
                                </div>
                            </div>

                            {/* Hover Arrow indicator */}
                            <div className="w-8 h-8 rounded-full bg-[var(--raised)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                <span className="text-[var(--accent)] font-bold">&rarr;</span>
                            </div>
                        </div>
                    ))}
                </div>
            );
        } else if (searchTerm) {
            return (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 rounded-full bg-[var(--surface)] border border-[var(--line-card)] flex items-center justify-center mb-6">
                        <IoSearch size={36} className="text-[var(--text-subtle)]" />
                    </div>
                    <p className="text-xl font-semibold text-[var(--text-strong)]">No results found for "{searchTerm}"</p>
                    <p className="text-md text-[var(--text-muted)] mt-2 max-w-sm">We couldn't find what you're looking for. Try adjusting your filters or search terms.</p>
                </div>
            );
        } else {
            return (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <p className="text-[var(--text-muted)] text-lg">Start typing to search your workspace...</p>
                </div>
            );
        }
    };

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
                        className="relative w-full max-w-3xl bg-[var(--raised)] border border-[var(--line-card)] shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[80vh]"
                    >
                        {/* Search Input Header */}
                        <div className="relative border-b border-[var(--line-card)] bg-[var(--surface)] p-4 flex items-center">
                            <IoSearch size={28} className="text-[var(--accent)] ml-2 mr-4 flex-shrink-0" />
                            <input
                                type="text"
                                autoFocus
                                placeholder="Search tasks, habits, events..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="flex-1 bg-transparent border-none outline-none text-2xl text-[var(--text-strong)] placeholder-[var(--text-subtle)]"
                            />
                            <button
                                onClick={onClose}
                                className="p-2 ml-4 rounded-xl hover:bg-[var(--raised)] text-[var(--text-muted)] hover:text-[var(--text-strong)] transition-colors flex-shrink-0"
                            >
                                <IoClose size={24} />
                            </button>
                        </div>

                        {/* Filters and Sorting Bar */}
                        <div className="flex flex-wrap items-center justify-between p-4 bg-[var(--surface)] border-b border-[var(--line-card)] gap-4">
                            {/* Category Pills */}
                            <div className="flex space-x-2">
                                {['All', 'Tasks', 'Habits', 'Calendar'].map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => handleFilterClick(filter)}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeFilter === filter
                                            ? 'bg-[var(--oxblood-selected)] text-[var(--text-strong)] border border-[var(--line-card)] font-semibold'
                                            : 'bg-[var(--raised)] text-[var(--text-muted)] hover:bg-[var(--hover)] hover:text-[var(--text-strong)] border border-[var(--line-control)]'
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>

                            {/* Sorting Dropdown */}
                            <div className="flex items-center space-x-3 text-sm">
                                <span className="text-[var(--text-muted)] flex items-center space-x-1">
                                    <FiFilter size={14} />
                                    <span>Sort by:</span>
                                </span>
                                <select
                                    value={activeSort}
                                    onChange={handleSortChange}
                                    className="bg-[var(--raised)] text-[var(--text-strong)] border border-[var(--line-control)] rounded-lg px-3 py-1.5 outline-none focus:border-[var(--accent)] cursor-pointer hover:bg-[var(--hover)] transition-colors"
                                >
                                    <option value="Newest">Newest</option>
                                    <option value="Oldest">Oldest</option>
                                    <option value="Relevance">Relevance</option>
                                    <option value="A-Z">A-Z</option>
                                </select>
                            </div>
                        </div>

                        {/* Results Area */}
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[var(--raised)]">
                            {renderResultsArea()}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
