import React, { useState } from 'react';
import {
    Clock,
    Calendar,
    BookOpen,
    Download
} from 'lucide-react';

const TimetablePage = ({ darkMode }) => {
    const [selectedDay, setSelectedDay] = useState('Monday');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const timetable = {
        Monday: [
            { time: '8:00 AM - 9:00 AM', subject: 'Mathematics', teacher: 'Dr. Sarah Johnson', room: 'Room 101' },
            { time: '9:00 AM - 10:00 AM', subject: 'Physics', teacher: 'Prof. Michael Chen', room: 'Lab 201' },
            { time: '10:00 AM - 11:00 AM', subject: 'Chemistry', teacher: 'Dr. Emily Davis', room: 'Lab 202' },
            { time: '11:00 AM - 12:00 PM', subject: 'English', teacher: 'Prof. James Wilson', room: 'Room 105' },
            { time: '12:00 PM - 1:00 PM', subject: 'Lunch Break', teacher: '-', room: 'Cafeteria' },
            { time: '1:00 PM - 2:00 PM', subject: 'Computer Science', teacher: 'Dr. Lisa Anderson', room: 'Lab 301' },
            { time: '2:00 PM - 3:00 PM', subject: 'Physical Education', teacher: 'Coach Robert', room: 'Sports Ground' }
        ],
        Tuesday: [
            { time: '8:00 AM - 9:00 AM', subject: 'Chemistry', teacher: 'Dr. Emily Davis', room: 'Lab 202' },
            { time: '9:00 AM - 10:00 AM', subject: 'Mathematics', teacher: 'Dr. Sarah Johnson', room: 'Room 101' },
            { time: '10:00 AM - 11:00 AM', subject: 'English', teacher: 'Prof. James Wilson', room: 'Room 105' },
            { time: '11:00 AM - 12:00 PM', subject: 'Physics', teacher: 'Prof. Michael Chen', room: 'Lab 201' },
            { time: '12:00 PM - 1:00 PM', subject: 'Lunch Break', teacher: '-', room: 'Cafeteria' },
            { time: '1:00 PM - 2:00 PM', subject: 'History', teacher: 'Prof. David Brown', room: 'Room 103' },
            { time: '2:00 PM - 3:00 PM', subject: 'Art', teacher: 'Ms. Jennifer Lee', room: 'Art Room' }
        ],
        Wednesday: [
            { time: '8:00 AM - 9:00 AM', subject: 'Physics', teacher: 'Prof. Michael Chen', room: 'Lab 201' },
            { time: '9:00 AM - 10:00 AM', subject: 'Computer Science', teacher: 'Dr. Lisa Anderson', room: 'Lab 301' },
            { time: '10:00 AM - 11:00 AM', subject: 'Mathematics', teacher: 'Dr. Sarah Johnson', room: 'Room 101' },
            { time: '11:00 AM - 12:00 PM', subject: 'Chemistry', teacher: 'Dr. Emily Davis', room: 'Lab 202' },
            { time: '12:00 PM - 1:00 PM', subject: 'Lunch Break', teacher: '-', room: 'Cafeteria' },
            { time: '1:00 PM - 2:00 PM', subject: 'English', teacher: 'Prof. James Wilson', room: 'Room 105' },
            { time: '2:00 PM - 3:00 PM', subject: 'Music', teacher: 'Mr. Thomas White', room: 'Music Room' }
        ],
        Thursday: [
            { time: '8:00 AM - 9:00 AM', subject: 'English', teacher: 'Prof. James Wilson', room: 'Room 105' },
            { time: '9:00 AM - 10:00 AM', subject: 'Chemistry', teacher: 'Dr. Emily Davis', room: 'Lab 202' },
            { time: '10:00 AM - 11:00 AM', subject: 'Physics', teacher: 'Prof. Michael Chen', room: 'Lab 201' },
            { time: '11:00 AM - 12:00 PM', subject: 'Mathematics', teacher: 'Dr. Sarah Johnson', room: 'Room 101' },
            { time: '12:00 PM - 1:00 PM', subject: 'Lunch Break', teacher: '-', room: 'Cafeteria' },
            { time: '1:00 PM - 2:00 PM', subject: 'Geography', teacher: 'Dr. Mark Taylor', room: 'Room 104' },
            { time: '2:00 PM - 3:00 PM', subject: 'Computer Science', teacher: 'Dr. Lisa Anderson', room: 'Lab 301' }
        ],
        Friday: [
            { time: '8:00 AM - 9:00 AM', subject: 'Mathematics', teacher: 'Dr. Sarah Johnson', room: 'Room 101' },
            { time: '9:00 AM - 10:00 AM', subject: 'English', teacher: 'Prof. James Wilson', room: 'Room 105' },
            { time: '10:00 AM - 11:00 AM', subject: 'Computer Science', teacher: 'Dr. Lisa Anderson', room: 'Lab 301' },
            { time: '11:00 AM - 12:00 PM', subject: 'Physics', teacher: 'Prof. Michael Chen', room: 'Lab 201' },
            { time: '12:00 PM - 1:00 PM', subject: 'Lunch Break', teacher: '-', room: 'Cafeteria' },
            { time: '1:00 PM - 2:00 PM', subject: 'Chemistry', teacher: 'Dr. Emily Davis', room: 'Lab 202' },
            { time: '2:00 PM - 3:00 PM', subject: 'Library Period', teacher: '-', room: 'Library' }
        ]
    };

    const getSubjectColor = (subject) => {
        const colors = {
            'Mathematics': 'bg-blue-100 text-blue-600 border-blue-200',
            'Physics': 'bg-purple-100 text-purple-600 border-purple-200',
            'Chemistry': 'bg-green-100 text-green-600 border-green-200',
            'English': 'bg-yellow-100 text-yellow-600 border-yellow-200',
            'Computer Science': 'bg-indigo-100 text-indigo-600 border-indigo-200',
            'Lunch Break': 'bg-gray-100 text-gray-600 border-gray-200'
        };
        return colors[subject] || 'bg-orange-100 text-orange-600 border-orange-200';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        Timetable
                    </h1>
                    <p className="text-sm text-gray-500">View your child's class schedule</p>
                </div>
                <button className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                </button>
            </div>

            {/* Day Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {days.map((day) => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${selectedDay === day
                            ? 'bg-orange-600 text-white'
                            : `${darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`
                            }`}
                    >
                        {day}
                    </button>
                ))}
            </div>

            {/* Timetable */}
            <div className="space-y-3">
                {timetable[selectedDay].map((period, index) => (
                    <div
                        key={index}
                        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border-l-4 ${getSubjectColor(period.subject).split(' ')[2]} ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getSubjectColor(period.subject)}`}>
                                        {period.subject}
                                    </span>
                                    {period.subject === 'Lunch Break' && (
                                        <span className="text-xs text-gray-500">Break Time</span>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                    <div className="flex items-center space-x-2">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {period.time}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <BookOpen className="w-4 h-4 text-gray-400" />
                                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {period.teacher}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {period.room}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimetablePage;
