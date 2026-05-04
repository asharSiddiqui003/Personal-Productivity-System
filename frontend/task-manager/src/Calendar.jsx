import { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO 
} from 'date-fns';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Google Login Hook
    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            setIsConnected(true);
            fetchEvents(tokenResponse.access_token);
        },
        onError: (err) => {
            console.error('Google Login Failed', err);
            setError('Failed to connect to Google Calendar. Check your Client ID.');
        },
        scope: 'https://www.googleapis.com/auth/calendar.readonly',
    });

    const fetchEvents = async (token) => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch events from the start of the previous month to the end of the next month
            const timeMin = startOfMonth(subMonths(currentDate, 1)).toISOString();
            const timeMax = endOfMonth(addMonths(currentDate, 1)).toISOString();
            
            const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&maxResults=250&singleEvents=true&orderBy=startTime`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            
            const data = await response.json();
            setEvents(data.items || []);
        } catch (err) {
            console.error(err);
            setError('Error fetching calendar events.');
        } finally {
            setIsLoading(false);
        }
    };

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

    // Get events for a specific day
    const getEventsForDay = (date) => {
        return events.filter(event => {
            if (event.start.date) {
                // All day event
                return isSameDay(parseISO(event.start.date), date);
            } else if (event.start.dateTime) {
                // Timed event
                return isSameDay(parseISO(event.start.dateTime), date);
            }
            return false;
        });
    };

    return (
        <div className="min-h-screen pl-24 pr-8 pt-8 pb-12 bg-[#15173D] text-[#F1E9E9] transition-all duration-300">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Calendar</h1>
                        <p className="text-[#B8AED4]">Schedule and sync with Google Calendar</p>
                    </div>
                    
                    {!isConnected ? (
                        <button 
                            onClick={() => login()}
                            className="flex items-center space-x-2 bg-white text-[#15173D] px-6 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-colors shadow-lg"
                        >
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google Logo" className="w-5 h-5" />
                            <span>Connect Google Calendar</span>
                        </button>
                    ) : (
                        <div className="flex items-center space-x-3 text-green-400 bg-green-400/10 px-4 py-2 rounded-xl">
                            <FiCalendar size={20} />
                            <span className="font-semibold">Synced with Google</span>
                        </div>
                    )}
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
                            <button onClick={prevMonth} className="p-3 bg-[#15173D] rounded-xl hover:bg-[#982598] transition-colors">
                                <FiChevronLeft size={24} />
                            </button>
                            <button onClick={nextMonth} className="p-3 bg-[#15173D] rounded-xl hover:bg-[#982598] transition-colors">
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
                            const dayEvents = getEventsForDay(day);
                            const isCurrentMonth = isSameMonth(day, monthStart);
                            const isToday = isSameDay(day, new Date());

                            return (
                                <div 
                                    key={i} 
                                    className={`
                                        min-h-[120px] rounded-2xl p-3 border border-transparent transition-all
                                        ${!isCurrentMonth ? 'opacity-30 bg-[#1D1F49]/30' : 'bg-[#15173D]/60 hover:border-[#982598]/50'}
                                        ${isToday ? 'ring-2 ring-[#982598] bg-[#982598]/10' : ''}
                                    `}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-lg font-bold ${isToday ? 'text-[#982598]' : 'text-[#F1E9E9]'}`}>
                                            {format(day, dateFormat)}
                                        </span>
                                        {dayEvents.length > 0 && (
                                            <span className="text-xs bg-[#982598] text-white px-2 py-1 rounded-full">
                                                {dayEvents.length}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                                        {isLoading && <div className="text-xs text-[#B8AED4] animate-pulse">Loading...</div>}
                                        {!isLoading && dayEvents.map(event => (
                                            <div 
                                                key={event.id} 
                                                className="text-xs bg-[#2a2c5b] text-[#B8AED4] truncate px-2 py-1.5 rounded-lg border border-[#B8AED4]/10"
                                                title={event.summary}
                                            >
                                                {event.start.dateTime && (
                                                    <span className="font-semibold text-white mr-1">
                                                        {format(parseISO(event.start.dateTime), 'HH:mm')}
                                                    </span>
                                                )}
                                                {event.summary}
                                            </div>
                                        ))}
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
