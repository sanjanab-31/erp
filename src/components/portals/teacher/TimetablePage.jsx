import React, { useState, useEffect, useCallback } from 'react';
import {
    Calendar,
    Clock,
    MapPin,
    BookOpen,
    Users,
    AlertCircle
} from 'lucide-react';
import { getAllTeacherTimetables, subscribeToUpdates } from '../../../utils/timetableStore';
import { getAllTeachers } from '../../../utils/teacherStore';

const TimetablePage = ({ darkMode }) => {
    const [timetable, setTimetable] = useState(null);
    const [loading, setLoading] = useState(true);

    // Get logged-in teacher info
    const teacherEmail = localStorage.getItem('userEmail');
    const teacherName = localStorage.getItem('userName');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = [
        '09:00-10:00',
        '10:00-11:00',
        '11:00-12:00',
        '12:00-13:00',
        '13:00-14:00',
        '14:00-15:00',
        '15:00-16:00'
    ];

    // Load timetable
    useEffect(() => {
        loadTimetable();
        const unsubscribe = subscribeToUpdates(loadTimetable);
        return unsubscribe;
    }, []);

    const loadTimetable = useCallback(() => {
        setLoading(true);
        console.log('Loading teacher timetable for:', { teacherEmail, teacherName });

        // Get all teachers to find current teacher's ID
        const teachers = getAllTeachers();
        console.log('All teachers:', teachers);

        // Find teacher by email or name
        const currentTeacher = teachers.find(t =>
            t.email === teacherEmail || t.name === teacherName
        );

        console.log('Current teacher found:', currentTeacher);

        if (currentTeacher) {
            // Get all teacher timetables
            const allTimetables = getAllTeacherTimetables();
            console.log('All teacher timetables:', allTimetables);

            // Find timetable for this teacher
            const teacherTT = allTimetables.find(tt =>
                tt.teacherId === currentTeacher.id.toString() ||
                tt.teacherId === currentTeacher.id
            );

            console.log('Teacher timetable found:', teacherTT);
            setTimetable(teacherTT);
        } else {
            console.log('Teacher not found in teacher list');
        }

        setLoading(false);
    }, [teacherEmail, teacherName]);

    // Organize schedule by day
    const scheduleByDay = {};
    days.forEach(day => {
        scheduleByDay[day] = [];
    });

    if (timetable && timetable.schedule) {
        timetable.schedule.forEach(entry => {
            if (scheduleByDay[entry.day]) {
                scheduleByDay[entry.day].push(entry);
            }
        });
    }

    // Calculate stats
    const totalClasses = timetable?.schedule?.length || 0;
    const todayIndex = new Date().getDay() - 1; // 0 = Monday
    const todayClasses = todayIndex >= 0 && todayIndex < 5 ? scheduleByDay[days[todayIndex]]?.length || 0 : 0;

    const formatTime = (time) => {
        const [start] = time.split('-');
        const [hours, minutes] = start.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    if (loading) {
        return (
            <div className="flex-1 overflow-y-auto p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
                        <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Loading timetable...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    My Timetable
                </h1>
                <p className="text-sm text-gray-500">View your weekly teaching schedule (Real-time sync with Admin)</p>
            </div>

            {!timetable ? (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        No Timetable Assigned
                    </h3>
                    <p className="text-gray-500 mb-2">
                        Your timetable hasn't been created yet. Please contact the admin to set up your schedule.
                    </p>
                    <p className="text-xs text-gray-400">
                        Logged in as: {teacherName} ({teacherEmail})
                    </p>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Periods</h3>
                                <BookOpen className="w-5 h-5 text-blue-500" />
                            </div>
                            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{totalClasses}</p>
                            <p className="text-sm text-gray-500 mt-1">This week</p>
                        </div>

                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Today's Classes</h3>
                                <Calendar className="w-5 h-5 text-purple-500" />
                            </div>
                            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{todayClasses}</p>
                            <p className="text-sm text-gray-500 mt-1">Scheduled today</p>
                        </div>

                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Working Days</h3>
                                <Users className="w-5 h-5 text-green-500" />
                            </div>
                            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>5</p>
                            <p className="text-sm text-gray-500 mt-1">Monday - Friday</p>
                        </div>
                    </div>

                    {/* Timetable Grid */}
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                        <div className="p-6 border-b border-gray-200">
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Weekly Schedule
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className={`w-full border-collapse ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                                <thead>
                                    <tr>
                                        <th className={`border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-gray-100 text-gray-700'} p-3 text-left font-semibold`}>
                                            Time
                                        </th>
                                        {days.map(day => (
                                            <th key={day} className={`border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-gray-100 text-gray-700'} p-3 text-center font-semibold`}>
                                                {day}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {timeSlots.map(slot => (
                                        <tr key={slot}>
                                            <td className={`border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-gray-50 text-gray-700'} p-3 font-medium whitespace-nowrap`}>
                                                {formatTime(slot)}
                                            </td>
                                            {days.map(day => {
                                                const daySchedule = scheduleByDay[day] || [];
                                                const classAtTime = daySchedule.find(entry => entry.time === slot);

                                                return (
                                                    <td key={day} className={`border ${darkMode ? 'border-gray-600' : 'border-gray-300'} p-2`}>
                                                        {classAtTime ? (
                                                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-purple-900 border-l-4 border-purple-500' : 'bg-purple-50 border-l-4 border-purple-500'}`}>
                                                                <h4 className={`font-semibold text-sm mb-1 ${darkMode ? 'text-white' : 'text-purple-900'}`}>
                                                                    {classAtTime.subject}
                                                                </h4>
                                                                {classAtTime.room && (
                                                                    <div className="flex items-center space-x-1 text-xs text-purple-600">
                                                                        <MapPin className="w-3 h-3" />
                                                                        <span>Room {classAtTime.room}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center text-gray-400 text-xs">-</div>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Info Note */}
                    <div className={`${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-xl p-4 mt-6`}>
                        <div className="flex items-start space-x-3">
                            <AlertCircle className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mt-0.5`} />
                            <div>
                                <h4 className={`font-semibold text-sm ${darkMode ? 'text-blue-300' : 'text-blue-900'} mb-1`}>
                                    Real-time Sync
                                </h4>
                                <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                                    Your timetable is managed by the admin. Any changes made by the admin will appear here automatically without needing to refresh the page.
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TimetablePage;
