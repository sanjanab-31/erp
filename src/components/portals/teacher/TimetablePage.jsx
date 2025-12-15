import React, { useState } from 'react';
import {
    Calendar,
    Clock,
    MapPin,
    BookOpen,
    Filter,
    Download,
    ChevronLeft,
    ChevronRight,
    Video,
    Users
} from 'lucide-react';

const TimetablePage = ({ darkMode }) => {
    const [selectedWeek, setSelectedWeek] = useState(0);
    const [selectedView, setSelectedView] = useState('week');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeSlots = [
        '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
        '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
    ];

    const schedule = {
        Monday: [
            { time: '09:00 AM', subject: 'Mathematics', class: 'Grade 10-A', room: 'Room 201', duration: 1, type: 'lecture' },
            { time: '11:00 AM', subject: 'Physics', class: 'Grade 11-B', room: 'Lab 3', duration: 2, type: 'lab' },
            { time: '02:00 PM', subject: 'Mathematics', class: 'Grade 10-B', room: 'Room 201', duration: 1, type: 'lecture' }
        ],
        Tuesday: [
            { time: '10:00 AM', subject: 'Computer Science', class: 'Grade 11-A', room: 'Lab 1', duration: 2, type: 'lab' },
            { time: '02:00 PM', subject: 'Mathematics', class: 'Grade 10-A', room: 'Room 201', duration: 1, type: 'tutorial' }
        ],
        Wednesday: [
            { time: '09:00 AM', subject: 'Mathematics', class: 'Grade 10-A', room: 'Room 201', duration: 1, type: 'lecture' },
            { time: '11:00 AM', subject: 'Physics', class: 'Grade 11-B', room: 'Room 305', duration: 1, type: 'lecture' },
            { time: '01:00 PM', subject: 'Mathematics', class: 'Grade 10-B', room: 'Room 201', duration: 1, type: 'lecture' }
        ],
        Thursday: [
            { time: '10:00 AM', subject: 'Physics', class: 'Grade 11-B', room: 'Room 305', duration: 1, type: 'lecture' },
            { time: '02:00 PM', subject: 'Computer Science', class: 'Grade 11-A', room: 'Lab 1', duration: 1, type: 'tutorial' }
        ],
        Friday: [
            { time: '09:00 AM', subject: 'Mathematics', class: 'Grade 10-A', room: 'Room 201', duration: 1, type: 'lecture' },
            { time: '11:00 AM', subject: 'Computer Science', class: 'Grade 11-A', room: 'Lab 1', duration: 1, type: 'lecture' },
            { time: '02:00 PM', subject: 'Mathematics', class: 'Grade 10-B', room: 'Room 201', duration: 1, type: 'lecture' }
        ],
        Saturday: [
            { time: '10:00 AM', subject: 'Faculty Meeting', class: 'All Staff', room: 'Conference Room', duration: 2, type: 'meeting' }
        ]
    };

    const getClassColor = (type) => {
        switch (type) {
            case 'lecture':
                return 'bg-blue-100 border-blue-500 text-blue-700';
            case 'lab':
                return 'bg-purple-100 border-purple-500 text-purple-700';
            case 'tutorial':
                return 'bg-green-100 border-green-500 text-green-700';
            case 'meeting':
                return 'bg-yellow-100 border-yellow-500 text-yellow-700';
            default:
                return 'bg-gray-100 border-gray-500 text-gray-700';
        }
    };

    const getTimeSlotIndex = (time) => {
        return timeSlots.indexOf(time);
    };

    const totalClasses = Object.values(schedule).flat().length;
    const totalHours = Object.values(schedule).flat().reduce((acc, cls) => acc + cls.duration, 0);

    return (
        <div className="flex-1 overflow-y-auto p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    My Timetable
                </h1>
                <p className="text-sm text-gray-500">View your weekly teaching schedule</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Classes</h3>
                        <BookOpen className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{totalClasses}</p>
                    <p className="text-sm text-gray-500 mt-1">This week</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Teaching Hours</h3>
                        <Clock className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{totalHours}</p>
                    <p className="text-sm text-gray-500 mt-1">Hours per week</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Today's Classes</h3>
                        <Calendar className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {schedule[days[new Date().getDay() - 1]]?.length || 0}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Scheduled today</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Different Classes</h3>
                        <Users className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>5</p>
                    <p className="text-sm text-gray-500 mt-1">Unique classes</p>
                </div>
            </div>

            {/* Controls */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6`}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <ChevronLeft className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                        </button>
                        <div className="text-center">
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Current Week
                            </h3>
                            <p className="text-sm text-gray-500">Dec 15 - Dec 21, 2025</p>
                        </div>
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            Week View
                        </button>
                        <button className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                            Day View
                        </button>
                        <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2">
                            <Download className="w-4 h-4" />
                            <span>Export</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Timetable Grid */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                <div className="overflow-x-auto">
                    <div className="min-w-[1000px]">
                        {/* Header */}
                        <div className={`grid grid-cols-7 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                            <div className="p-4 font-semibold text-sm text-gray-500">Time</div>
                            {days.map((day) => (
                                <div key={day} className={`p-4 text-center font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Time Slots */}
                        {timeSlots.map((time, timeIndex) => (
                            <div
                                key={time}
                                className={`grid grid-cols-7 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} min-h-[80px]`}
                            >
                                <div className={`p-4 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                    {time}
                                </div>
                                {days.map((day) => {
                                    const dayClasses = schedule[day] || [];
                                    const classAtTime = dayClasses.find(cls => getTimeSlotIndex(cls.time) === timeIndex);

                                    return (
                                        <div
                                            key={day}
                                            className={`p-2 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} relative`}
                                        >
                                            {classAtTime && (
                                                <div
                                                    className={`${getClassColor(classAtTime.type)} rounded-lg p-3 border-l-4 h-full flex flex-col justify-between`}
                                                    style={{ minHeight: `${classAtTime.duration * 80}px` }}
                                                >
                                                    <div>
                                                        <h4 className="font-semibold text-sm mb-1">{classAtTime.subject}</h4>
                                                        <p className="text-xs opacity-80">{classAtTime.class}</p>
                                                    </div>
                                                    <div className="flex items-center space-x-1 text-xs opacity-80">
                                                        <MapPin className="w-3 h-3" />
                                                        <span>{classAtTime.room}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mt-6`}>
                <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>Legend</h3>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-100 border-l-4 border-blue-500 rounded"></div>
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Lecture</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-purple-100 border-l-4 border-purple-500 rounded"></div>
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Lab</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-100 border-l-4 border-green-500 rounded"></div>
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tutorial</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-yellow-100 border-l-4 border-yellow-500 rounded"></div>
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Meeting</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimetablePage;
