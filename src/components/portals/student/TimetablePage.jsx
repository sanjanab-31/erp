import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Grid,
    Download,
    MapPin,
    User
} from 'lucide-react';

const TimetablePage = ({ darkMode }) => {
    const [viewMode, setViewMode] = useState('Week View');

    // Real-time timetable data
    const [timetableData, setTimetableData] = useState({
        periods: [
            {
                id: 1,
                name: 'Period 1',
                time: '08:00 - 08:45'
            },
            {
                id: 2,
                name: 'Period 2',
                time: '08:45 - 09:30'
            },
            {
                id: 3,
                name: 'Period 3',
                time: '09:45 - 10:30'
            },
            {
                id: 4,
                name: 'Period 4',
                time: '10:30 - 11:15'
            },
            {
                id: 5,
                name: 'Period 5',
                time: '11:30 - 12:15'
            },
            {
                id: 6,
                name: 'Period 6',
                time: '12:15 - 01:00'
            }
        ],
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        schedule: {
            Monday: [
                { subject: 'Mathematics', teacher: 'Sarah Johnson', room: 'Room 101', color: 'bg-blue-100 text-blue-800 border-blue-200' },
                { subject: 'Physics', teacher: 'David Brown', room: 'Room 102', color: 'bg-purple-100 text-purple-800 border-purple-200' },
                { subject: 'Chemistry', teacher: 'Robert Lee', room: 'Room 103', color: 'bg-green-100 text-green-800 border-green-200' },
                { subject: 'English', teacher: 'Lisa Anderson', room: 'Room 201', color: 'bg-orange-100 text-orange-800 border-orange-200' },
                { subject: 'History', teacher: 'Mark Wilson', room: 'Room 202', color: 'bg-pink-100 text-pink-800 border-pink-200' },
                { subject: 'Lunch Break', teacher: '', room: '', color: 'bg-yellow-50 text-yellow-800 border-yellow-200' }
            ],
            Tuesday: [
                { subject: 'Mathematics', teacher: 'Sarah Johnson', room: 'Room 101', color: 'bg-blue-100 text-blue-800 border-blue-200' },
                { subject: 'Physics', teacher: 'David Brown', room: 'Room 102', color: 'bg-purple-100 text-purple-800 border-purple-200' },
                { subject: 'Chemistry', teacher: 'Robert Lee', room: 'Room 103', color: 'bg-green-100 text-green-800 border-green-200' },
                { subject: 'English', teacher: 'Lisa Anderson', room: 'Room 201', color: 'bg-orange-100 text-orange-800 border-orange-200' },
                { subject: 'History', teacher: 'Mark Wilson', room: 'Room 202', color: 'bg-pink-100 text-pink-800 border-pink-200' },
                { subject: 'Lunch Break', teacher: '', room: '', color: 'bg-yellow-50 text-yellow-800 border-yellow-200' }
            ],
            Wednesday: [
                { subject: 'Mathematics', teacher: 'Sarah Johnson', room: 'Room 101', color: 'bg-blue-100 text-blue-800 border-blue-200' },
                { subject: 'Physics', teacher: 'David Brown', room: 'Room 102', color: 'bg-purple-100 text-purple-800 border-purple-200' },
                { subject: 'Chemistry', teacher: 'Robert Lee', room: 'Room 103', color: 'bg-green-100 text-green-800 border-green-200' },
                { subject: 'English', teacher: 'Lisa Anderson', room: 'Room 201', color: 'bg-orange-100 text-orange-800 border-orange-200' },
                { subject: 'History', teacher: 'Mark Wilson', room: 'Room 202', color: 'bg-pink-100 text-pink-800 border-pink-200' },
                { subject: 'Lunch Break', teacher: '', room: '', color: 'bg-yellow-50 text-yellow-800 border-yellow-200' }
            ],
            Thursday: [
                { subject: 'Mathematics', teacher: 'Sarah Johnson', room: 'Room 101', color: 'bg-blue-100 text-blue-800 border-blue-200' },
                { subject: 'Physics', teacher: 'David Brown', room: 'Room 102', color: 'bg-purple-100 text-purple-800 border-purple-200' },
                { subject: 'Chemistry', teacher: 'Robert Lee', room: 'Room 103', color: 'bg-green-100 text-green-800 border-green-200' },
                { subject: 'English', teacher: 'Lisa Anderson', room: 'Room 201', color: 'bg-orange-100 text-orange-800 border-orange-200' },
                { subject: 'History', teacher: 'Mark Wilson', room: 'Room 202', color: 'bg-pink-100 text-pink-800 border-pink-200' },
                { subject: 'Lunch Break', teacher: '', room: '', color: 'bg-yellow-50 text-yellow-800 border-yellow-200' }
            ],
            Friday: [
                { subject: 'Mathematics', teacher: 'Sarah Johnson', room: 'Room 101', color: 'bg-blue-100 text-blue-800 border-blue-200' },
                { subject: 'Physics', teacher: 'David Brown', room: 'Room 102', color: 'bg-purple-100 text-purple-800 border-purple-200' },
                { subject: 'Chemistry', teacher: 'Robert Lee', room: 'Room 103', color: 'bg-green-100 text-green-800 border-green-200' },
                { subject: 'English', teacher: 'Lisa Anderson', room: 'Room 201', color: 'bg-orange-100 text-orange-800 border-orange-200' },
                { subject: 'History', teacher: 'Mark Wilson', room: 'Room 202', color: 'bg-pink-100 text-pink-800 border-pink-200' },
                { subject: 'Lunch Break', teacher: '', room: '', color: 'bg-yellow-50 text-yellow-800 border-yellow-200' }
            ],
            Saturday: [
                { subject: 'Mathematics', teacher: 'Sarah Johnson', room: 'Room 101', color: 'bg-blue-100 text-blue-800 border-blue-200' },
                { subject: 'Physics', teacher: 'David Brown', room: 'Room 102', color: 'bg-purple-100 text-purple-800 border-purple-200' },
                { subject: 'Chemistry', teacher: 'Robert Lee', room: 'Room 103', color: 'bg-green-100 text-green-800 border-green-200' },
                { subject: 'English', teacher: 'Lisa Anderson', room: 'Room 201', color: 'bg-orange-100 text-orange-800 border-orange-200' },
                { subject: 'History', teacher: 'Mark Wilson', room: 'Room 202', color: 'bg-pink-100 text-pink-800 border-pink-200' },
                { subject: 'Lunch Break', teacher: '', room: '', color: 'bg-yellow-50 text-yellow-800 border-yellow-200' }
            ]
        },
        legend: [
            { subject: 'Mathematics', color: 'bg-blue-100 border-blue-200' },
            { subject: 'Physics', color: 'bg-purple-100 border-purple-200' },
            { subject: 'Chemistry', color: 'bg-green-100 border-green-200' },
            { subject: 'English', color: 'bg-orange-100 border-orange-200' },
            { subject: 'History', color: 'bg-pink-100 border-pink-200' },
            { subject: 'Biology', color: 'bg-teal-100 border-teal-200' },
            { subject: 'Computer Science', color: 'bg-cyan-100 border-cyan-200' },
            { subject: 'Physical Education', color: 'bg-amber-100 border-amber-200' }
        ]
    });

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setTimetableData(prev => ({
                ...prev,
                // Update any real-time fields
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Get current day highlight
    const getCurrentDay = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date().getDay();
        return days[today];
    };

    const currentDay = getCurrentDay();

    return (
        <div className="flex-1 overflow-y-auto p-8">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Timetable
                </h1>
                <p className="text-sm text-gray-500">View your class schedule</p>
            </div>

            {/* View Toggle and Export */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setViewMode('Day View')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${viewMode === 'Day View'
                                ? 'bg-gray-900 text-white border-gray-900'
                                : `${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-300 text-gray-700'} hover:bg-gray-50`
                            }`}
                    >
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">Day View</span>
                    </button>
                    <button
                        onClick={() => setViewMode('Week View')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${viewMode === 'Week View'
                                ? 'bg-gray-900 text-white border-gray-900'
                                : `${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-300 text-gray-700'} hover:bg-gray-50`
                            }`}
                    >
                        <Grid className="w-4 h-4" />
                        <span className="text-sm font-medium">Week View</span>
                    </button>
                </div>
            </div>

            {/* Timetable Card */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border mb-6`}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Weekly Timetable
                            </h3>
                            <p className="text-sm text-gray-500">Class schedule for the week</p>
                        </div>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Download className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">Export</span>
                        </button>
                    </div>

                    {/* Timetable Grid */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className={`sticky left-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-3 text-left`}>
                                        <div className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            Time
                                        </div>
                                    </th>
                                    {timetableData.days.map((day) => (
                                        <th
                                            key={day}
                                            className={`border-b-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-3 text-center min-w-[150px] ${day === currentDay ? 'bg-gray-900 text-white' : ''
                                                }`}
                                        >
                                            <div className={`text-sm font-semibold ${day === currentDay ? 'text-white' : darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                {day}
                                            </div>
                                            {day === currentDay && (
                                                <div className="text-xs text-gray-300 mt-1">Today</div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {timetableData.periods.map((period, periodIndex) => (
                                    <tr key={period.id}>
                                        <td className={`sticky left-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'} p-3`}>
                                            <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {period.name}
                                            </div>
                                            <div className="text-xs text-gray-500">{period.time}</div>
                                        </td>
                                        {timetableData.days.map((day) => {
                                            const classData = timetableData.schedule[day][periodIndex];
                                            const isLunchBreak = classData.subject === 'Lunch Break';

                                            return (
                                                <td
                                                    key={day}
                                                    className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'} p-2`}
                                                >
                                                    <div
                                                        className={`${classData.color} border rounded-lg p-3 h-full ${isLunchBreak ? 'flex items-center justify-center' : ''
                                                            }`}
                                                    >
                                                        {isLunchBreak ? (
                                                            <span className="text-sm font-semibold">{classData.subject}</span>
                                                        ) : (
                                                            <>
                                                                <div className="text-sm font-semibold mb-2">
                                                                    {classData.subject}
                                                                </div>
                                                                <div className="flex items-center space-x-1 text-xs mb-1">
                                                                    <User className="w-3 h-3" />
                                                                    <span>{classData.teacher}</span>
                                                                </div>
                                                                <div className="flex items-center space-x-1 text-xs">
                                                                    <MapPin className="w-3 h-3" />
                                                                    <span>{classData.room}</span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Subject Legend */}
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-6`}>
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                    Subject Legend
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {timetableData.legend.map((item) => (
                        <div key={item.subject} className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded border ${item.color}`}></div>
                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {item.subject}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimetablePage;
