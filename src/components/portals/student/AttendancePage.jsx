import React, { useState, useEffect } from 'react';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Download,
    Users,
    CheckCircle,
    XCircle,
    Clock,
    Filter
} from 'lucide-react';

const AttendancePage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date(2025, 11, 15)); // December 15, 2025
    const [selectedClass, setSelectedClass] = useState('Class 10/');
    const [selectedSubject, setSelectedSubject] = useState('All Subjects');
    const [activeTab, setActiveTab] = useState('View Attendance');

    // Real-time attendance data
    const [attendanceData, setAttendanceData] = useState({
        totalStudents: 3,
        present: 3,
        absent: 0,
        late: 0,
        attendanceRecords: [
            {
                id: 1,
                studentName: 'Mike Wilson',
                studentId: 'STU001',
                class: '10A',
                date: '12/30/2024',
                status: 'present'
            },
            {
                id: 2,
                studentName: 'Emma Davis',
                studentId: 'STU002',
                class: '10A',
                date: '12/30/2024',
                status: 'present'
            },
            {
                id: 3,
                studentName: 'Alex Johnson',
                studentId: 'STU003',
                class: '10B',
                date: '12/30/2024',
                status: 'absent'
            }
        ]
    });

    // Calendar state
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 11, 1)); // December 2025

    // Update attendance counts in real-time
    useEffect(() => {
        const interval = setInterval(() => {
            // Recalculate counts based on records
            const present = attendanceData.attendanceRecords.filter(r => r.status === 'present').length;
            const absent = attendanceData.attendanceRecords.filter(r => r.status === 'absent').length;
            const late = attendanceData.attendanceRecords.filter(r => r.status === 'late').length;

            setAttendanceData(prev => ({
                ...prev,
                present,
                absent,
                late
            }));
        }, 1000);

        return () => clearInterval(interval);
    }, [attendanceData.attendanceRecords]);

    // Calendar functions
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Previous month days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            days.push({
                day: prevMonthLastDay - i,
                isCurrentMonth: false,
                date: new Date(year, month - 1, prevMonthLastDay - i)
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                isCurrentMonth: true,
                date: new Date(year, month, i)
            });
        }

        // Next month days
        const remainingDays = 42 - days.length; // 6 rows * 7 days
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                day: i,
                isCurrentMonth: false,
                date: new Date(year, month + 1, i)
            });
        }

        return days;
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isSelected = (date) => {
        if (!selectedDate) return false;
        return date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();
    };

    const handleDownloadReport = () => {
        // Create CSV content
        const headers = ['Student Name', 'Student ID', 'Class', 'Date', 'Status'];
        const rows = attendanceData.attendanceRecords.map(record => [
            record.studentName,
            record.studentId,
            record.class,
            record.date,
            record.status
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'present':
                return 'bg-green-100 text-green-700';
            case 'absent':
                return 'bg-red-100 text-red-700';
            case 'late':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const days = getDaysInMonth(currentMonth);

    return (
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Management</h1>
                <p className="text-sm text-gray-500">Track and manage student attendance</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Students */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600">Total Students</h3>
                        <Users className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="mb-2">
                        <p className="text-3xl font-bold text-gray-900">{attendanceData.totalStudents}</p>
                    </div>
                    <p className="text-sm text-gray-500">In selected class</p>
                </div>

                {/* Present */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600">Present</h3>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="mb-2">
                        <p className="text-3xl font-bold text-gray-900">{attendanceData.present}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                        {attendanceData.totalStudents > 0
                            ? `${Math.round((attendanceData.present / attendanceData.totalStudents) * 100)}% attendance`
                            : '0% attendance'}
                    </p>
                </div>

                {/* Absent */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600">Absent</h3>
                        <XCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="mb-2">
                        <p className="text-3xl font-bold text-gray-900">{attendanceData.absent}</p>
                    </div>
                    <p className="text-sm text-gray-500">Students absent</p>
                </div>

                {/* Late */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-600">Late</h3>
                        <Clock className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="mb-2">
                        <p className="text-3xl font-bold text-gray-900">{attendanceData.late}</p>
                    </div>
                    <p className="text-sm text-gray-500">Students late</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
                <div className="flex gap-4 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('View Attendance')}
                        className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'View Attendance'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        View Attendance
                    </button>
                    <button
                        onClick={() => setActiveTab('Reports')}
                        className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'Reports'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Reports
                    </button>
                </div>
            </div>

            {/* Attendance History Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Attendance History</h3>
                <p className="text-sm text-gray-500 mb-6">View attendance records for different dates and classes</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Calendar Section */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-4">Select Date</h4>

                        {/* Calendar Header */}
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={handlePrevMonth}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <span className="text-sm font-semibold text-gray-900">
                                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </span>
                            <button
                                onClick={handleNextMonth}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {/* Week day headers */}
                            {weekDays.map(day => (
                                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                                    {day}
                                </div>
                            ))}

                            {/* Calendar days */}
                            {days.map((dayObj, index) => (
                                <button
                                    key={index}
                                    onClick={() => dayObj.isCurrentMonth && handleDateClick(dayObj.date)}
                                    disabled={!dayObj.isCurrentMonth}
                                    className={`
                    aspect-square flex items-center justify-center text-sm rounded-lg transition-all
                    ${!dayObj.isCurrentMonth ? 'text-gray-300 cursor-not-allowed' : 'text-gray-900 hover:bg-gray-100'}
                    ${isToday(dayObj.date) && dayObj.isCurrentMonth ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                    ${isSelected(dayObj.date) && !isToday(dayObj.date) && dayObj.isCurrentMonth ? 'bg-gray-900 text-white' : ''}
                  `}
                                >
                                    {dayObj.day}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-4">Filters</h4>

                        {/* Class Filter */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="Class 10/">Class 10/</option>
                                <option value="Class 9/">Class 9/</option>
                                <option value="Class 11/">Class 11/</option>
                                <option value="Class 12/">Class 12/</option>
                            </select>
                        </div>

                        {/* Subject Filter */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                <option value="All Subjects">All Subjects</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="Physics">Physics</option>
                                <option value="Chemistry">Chemistry</option>
                                <option value="Biology">Biology</option>
                                <option value="English">English</option>
                            </select>
                        </div>

                        {/* Download Report Button */}
                        <button
                            onClick={handleDownloadReport}
                            className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            Download Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Attendance Records Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Student Name
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Student ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Class
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {attendanceData.attendanceRecords.map((record) => (
                                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900">{record.studentName}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-600">{record.studentId}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-600">{record.class}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-600">{record.date}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(record.status)}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;
