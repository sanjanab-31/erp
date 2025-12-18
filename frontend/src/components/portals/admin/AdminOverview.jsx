import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    GraduationCap,
    IndianRupee,
    TrendingUp,
    CheckCircle,
    AlertCircle,
    Info,
    Megaphone
} from 'lucide-react';
import { studentApi, teacherApi, feeApi, attendanceApi, announcementApi } from '../../../services/api';

const AdminOverview = ({ darkMode }) => {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        revenue: 0,
        attendanceRate: 0,
        studentsChange: 'Loading...',
        teachersChange: 'Loading...',
        revenueChange: 'Loading...',
        attendanceChange: 'Loading...'
    });

    const [recentActivities, setRecentActivities] = useState([]);
    const [recentAnnouncements, setRecentAnnouncements] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            // ... existing fetch logic ...
            try {
                const [studentRes, teacherRes, feeRes, attendanceRes] = await Promise.allSettled([
                    studentApi.getStats(),
                    teacherApi.getStats(),
                    feeApi.getStats(),
                    attendanceApi.getStats()
                ]);

                const studentStats = studentRes.status === 'fulfilled' ? studentRes.value.data?.data : { total: 0, active: 0 };
                const teacherStats = teacherRes.status === 'fulfilled' ? teacherRes.value.data?.data : { total: 0, active: 0 };
                const feeStats = feeRes.status === 'fulfilled' ? feeRes.value.data?.data : { paidAmount: 0, collectionRate: 0 };
                const attendanceStats = attendanceRes.status === 'fulfilled' ? attendanceRes.value.data?.data : { totalRecords: 0, present: 0, late: 0 };

                const attendanceRate = attendanceStats.totalRecords > 0
                    ? Math.round(((attendanceStats.present + attendanceStats.late) / attendanceStats.totalRecords) * 100)
                    : 0;

                setDashboardData({
                    totalStudents: studentStats.total || 0,
                    totalTeachers: teacherStats.total || 0,
                    revenue: feeStats.paidAmount || 0,
                    attendanceRate: attendanceRate,
                    studentsChange: `${studentStats.active || 0} active students`,
                    teachersChange: `${teacherStats.active || 0} active staff members`,
                    revenueChange: `${feeStats.collectionRate || 0}% collection rate`,
                    attendanceChange: 'Overall attendance rate'
                });
            } catch (error) {
                console.error('Error fetching dashboard data', error);
            }
        };

        fetchDashboardData();
    }, []);

    useEffect(() => {
        const fetchRecentActivities = () => {
            try {
                const activityLog = JSON.parse(localStorage.getItem('adminActivityLog') || '[]');
                const recentActivitiesData = activityLog.slice(0, 3).map(activity => ({
                    id: activity.id || Date.now(),
                    type: activity.type || 'info',
                    title: activity.title || 'Activity',
                    description: activity.description || '',
                    time: activity.time || 'Recently',
                    icon: activity.type === 'success' ? CheckCircle :
                        activity.type === 'warning' ? AlertCircle : Info
                }));
                if (recentActivitiesData.length > 0) {
                    setRecentActivities(recentActivitiesData);
                }
            } catch (error) {
                console.error('Error fetching recent activities:', error);
            }
        };

        fetchRecentActivities();
        const interval = setInterval(fetchRecentActivities, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await announcementApi.getAll();
                const announcements = response.data?.data || [];
                setRecentAnnouncements(announcements.slice(0, 3));
            } catch (error) {
                console.error('Failed to fetch announcements', error);
            }
        };
        fetchAnnouncements();
    }, []);

    const getActivityColor = (type) => {
        switch (type) {
            case 'success': return 'text-green-500 bg-green-50';
            case 'warning': return 'text-yellow-500 bg-yellow-50';
            case 'info': return 'text-blue-500 bg-blue-50';
            default: return 'text-gray-500 bg-gray-50';
        }
    };

    const userName = localStorage.getItem('userName') || 'John Admin';

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="animate-fadeIn">
            <div className="mb-8">
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    {getGreeting()}, {userName.split(' ')[0]} Admin!
                </h1>
                <p className="text-sm text-gray-500 flex items-center">
                    <span className="mr-2">Admin Dashboard</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-shadow`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Students</h3>
                        <Users className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        {dashboardData.totalStudents}
                    </p>
                    <p className="text-sm text-gray-500">{dashboardData.studentsChange}</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-shadow`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Teachers</h3>
                        <GraduationCap className="w-5 h-5 text-green-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        {dashboardData.totalTeachers}
                    </p>
                    <p className="text-sm text-gray-500">{dashboardData.teachersChange}</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-shadow`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Revenue</h3>
                        <IndianRupee className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        ₹{dashboardData.revenue.toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-green-500">{dashboardData.revenueChange}</p>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-shadow`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Attendance</h3>
                        <TrendingUp className="w-5 h-5 text-orange-500" />
                    </div>
                    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        {dashboardData.attendanceRate.toFixed(0)}%
                    </p>
                    <p className="text-sm text-gray-500">{dashboardData.attendanceChange}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={`lg:col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                        Recent Activities
                    </h3>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div
                                key={activity.id}
                                className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} hover:shadow-md transition-shadow`}
                            >
                                <div className="flex items-start space-x-4">
                                    <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                                        <activity.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {activity.title}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                                        <p className="text-xs text-gray-400 mt-2">{activity.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Recent Announcements
                        </h3>
                        <button
                            onClick={() => navigate('/admin/announcements')}
                            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                        >
                            View All
                        </button>
                    </div>
                    <div className="space-y-3">
                        {recentAnnouncements.length === 0 ? (
                            <div className="text-center py-8">
                                <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">No announcements yet</p>
                            </div>
                        ) : (
                            recentAnnouncements.map((announcement) => (
                                <div
                                    key={announcement.id}
                                    className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} hover:shadow-md transition-shadow cursor-pointer`}
                                    onClick={() => navigate('/admin/announcements')}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="p-2 rounded-lg bg-orange-100">
                                            <Megaphone className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                                                {announcement.title}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                {announcement.description}
                                            </p>
                                            <div className="flex items-center space-x-3 mt-2">
                                                <span className="text-xs text-gray-400">
                                                    {new Date(announcement.publishDate).toLocaleDateString()}
                                                </span>
                                                <span className={`text-xs px-2 py-1 rounded-full ${announcement.targetAudience === 'All'
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : announcement.targetAudience === 'Teachers'
                                                        ? 'bg-green-100 text-green-600'
                                                        : announcement.targetAudience === 'Students'
                                                            ? 'bg-purple-100 text-purple-600'
                                                            : 'bg-pink-100 text-pink-600'
                                                    }`}>
                                                    {announcement.targetAudience}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
