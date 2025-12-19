import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    Calendar,
    MapPin,
    AlertCircle,
    Clock,
    BookOpen,
    User
} from 'lucide-react';
import { timetableApi, studentApi, parentApi } from '../../../services/api';

const TimetablePage = () => {
    const { darkMode } = useOutletContext();
    const [timetable, setTimetable] = useState(null);
    const [loading, setLoading] = useState(true);
    const [childClass, setChildClass] = useState('');
    const [childName, setChildName] = useState('');

    const parentEmail = localStorage.getItem('userEmail');

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                // Fetch everything in parallel
                const [parentsRes, studentsRes, ttRes] = await Promise.all([
                    parentApi.getAll(),
                    studentApi.getAll(),
                    timetableApi.getClassTimetables()
                ]);

                const allParents = Array.isArray(parentsRes?.data?.data) ? parentsRes.data.data : [];
                const currentParent = allParents.find(p => p.email?.toLowerCase() === parentEmail?.toLowerCase());

                if (!currentParent) {
                    console.error('Parent record not found for:', parentEmail);
                    setLoading(false);
                    return;
                }

                const allStudents = Array.isArray(studentsRes?.data?.data) ? studentsRes.data.data : [];
                const child = allStudents.find(s =>
                    (s.id?.toString() === currentParent.studentId?.toString()) ||
                    (s.parentEmail?.toLowerCase() === currentParent.email?.toLowerCase())
                );

                if (child) {
                    setChildClass(child.class);
                    setChildName(child.name);

                    const allTimetables = Array.isArray(ttRes?.data?.data) ? ttRes.data.data : [];
                    const classTT = allTimetables.find(t => t.className === child.class);
                    setTimetable(classTT);
                } else {
                    console.error('Student not found for studentId:', currentParent.studentId);
                }
            } catch (error) {
                console.error('Error loading timetable:', error);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [parentEmail]);

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

    const totalClasses = timetable?.schedule?.length || 0;
    const todayIndex = new Date().getDay() - 1;
    const todayClasses = todayIndex >= 0 && todayIndex < 5 ? scheduleByDay[days[todayIndex]]?.length || 0 : 0;

    const uniqueSubjects = timetable?.schedule
        ? [...new Set(timetable.schedule.map(entry => entry.subject).filter(s => s))]
        : [];

    const formatTime = (time) => {
        const [start] = time.split('-');
        const [hours, minutes] = start.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const getSubjectColor = (subject) => {
        const colors = [
            'bg-blue-100 text-blue-800 border-blue-200',
            'bg-purple-100 text-purple-800 border-purple-200',
            'bg-green-100 text-green-800 border-green-200',
            'bg-orange-100 text-orange-800 border-orange-200',
            'bg-pink-100 text-pink-800 border-pink-200',
            'bg-teal-100 text-teal-800 border-teal-200',
            'bg-cyan-100 text-cyan-800 border-cyan-200',
            'bg-amber-100 text-amber-800 border-amber-200'
        ];
        const index = subject ? subject.charCodeAt(0) % colors.length : 0;
        return colors[index];
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
            { }
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    {childName ? `${childName}'s Timetable` : 'Child\'s Timetable'}
                </h1>
                <p className="text-sm text-gray-500">
                    {childClass ? `Class ${childClass} Schedule (Real-time sync with Admin)` : 'View your child\'s class schedule'}
                </p>
            </div>

            {!timetable ? (
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-12 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        No Timetable Available
                    </h3>
                    <p className="text-gray-500">
                        {childClass
                            ? 'The class timetable hasn\'t been created yet. Please contact the admin.'
                            : 'Unable to find your child\'s information. Please contact the admin.'}
                    </p>
                </div>
            ) : (
                <>
                    { }
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
                                <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Subjects</h3>
                                <BookOpen className="w-5 h-5 text-green-500" />
                            </div>
                            <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{uniqueSubjects.length}</p>
                            <p className="text-sm text-gray-500 mt-1">Different subjects</p>
                        </div>
                    </div>

                    { }
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden mb-6`}>
                        <div className="p-6 border-b border-gray-200">
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Weekly Schedule
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className={`w-full border-collapse ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                                <thead>
                                    <tr>
                                        <th className={`border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-gray-100 text-gray-700'} p-3 text-left font-semibold sticky left-0 z-10`}>
                                            Time
                                        </th>
                                        {days.map(day => {
                                            const isToday = new Date().getDay() - 1 === days.indexOf(day);
                                            return (
                                                <th key={day} className={`border ${darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'} p-3 text-center font-semibold ${isToday ? 'bg-purple-600 text-white' : darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                                    {day}
                                                    {isToday && <div className="text-xs mt-1">Today</div>}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {timeSlots.map(slot => (
                                        <tr key={slot}>
                                            <td className={`border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-gray-50 text-gray-700'} p-3 font-medium whitespace-nowrap sticky left-0 z-10`}>
                                                {formatTime(slot)}
                                            </td>
                                            {days.map(day => {
                                                const daySchedule = scheduleByDay[day] || [];
                                                const classAtTime = daySchedule.find(entry => entry.time === slot);

                                                return (
                                                    <td key={day} className={`border ${darkMode ? 'border-gray-600' : 'border-gray-300'} p-2`}>
                                                        {classAtTime ? (
                                                            <div className={`p-3 rounded-lg border ${getSubjectColor(classAtTime.subject)}`}>
                                                                <h4 className="font-semibold text-sm mb-2">
                                                                    {classAtTime.subject}
                                                                </h4>
                                                                {classAtTime.room && (
                                                                    <div className="flex items-center space-x-1 text-xs">
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

                    { }
                    {uniqueSubjects.length > 0 && (
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6`}>
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                                Subject Legend
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {uniqueSubjects.map((subject) => (
                                    <div key={subject} className="flex items-center space-x-3">
                                        <div className={`w-4 h-4 rounded border ${getSubjectColor(subject)}`}></div>
                                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {subject}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    { }
                    <div className={`${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-xl p-4`}>
                        <div className="flex items-start space-x-3">
                            <AlertCircle className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'} mt-0.5`} />
                            <div>
                                <h4 className={`font-semibold text-sm ${darkMode ? 'text-blue-300' : 'text-blue-900'} mb-1`}>
                                    Real-time Sync
                                </h4>
                                <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                                    Your child's timetable is managed by the admin. Any changes made by the admin will appear here automatically without needing to refresh the page.
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
