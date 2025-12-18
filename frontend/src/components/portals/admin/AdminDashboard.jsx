import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
    Home,
    Users,
    GraduationCap,
    UserCheck,
    IndianRupee,
    Calendar,
    BookMarked,
    BarChart3,
    Settings,
    Bell,
    Search,
    Moon,
    Sun,
    Megaphone,
    X,
    CheckCircle,
    AlertCircle,
    Info,
    LogOut
} from 'lucide-react';
import { initializeActivityLog } from '../../../utils/activityLogger';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const userName = localStorage.getItem('userName') || 'John Admin';

    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [showNotificationPanel, setShowNotificationPanel] = useState(false);
    const [recentActivities, setRecentActivities] = useState([]);

    const menuItems = [
        { icon: Home, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Users, label: 'Students', path: '/admin/students' },
        { icon: GraduationCap, label: 'Teachers', path: '/admin/teachers' },
        { icon: UserCheck, label: 'Attendance', path: '/admin/attendance' },
        { icon: BookMarked, label: 'Courses', path: '/admin/courses' },
        { icon: IndianRupee, label: 'Fees & Finance', path: '/admin/fees' },
        { icon: Calendar, label: 'Timetable', path: '/admin/timetable' },
        { icon: Calendar, label: 'Exam Schedules', path: '/admin/exams' },
        { icon: BookMarked, label: 'Library', path: '/admin/library' },
        { icon: Megaphone, label: 'Announcements', path: '/admin/announcements' },
        { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' }
    ];

    useEffect(() => {
        initializeActivityLog();

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

        const handleNewActivity = () => {
            fetchRecentActivities();
        };

        window.addEventListener('adminActivityAdded', handleNewActivity);
        const interval = setInterval(fetchRecentActivities, 30000);

        return () => {
            window.removeEventListener('adminActivityAdded', handleNewActivity);
            clearInterval(interval);
        };
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'success':
                return 'text-green-500 bg-green-50';
            case 'warning':
                return 'text-yellow-500 bg-yellow-50';
            case 'info':
                return 'text-blue-500 bg-blue-50';
            default:
                return 'text-gray-500 bg-gray-50';
        }
    };

    const Modal = ({ type, onClose }) => {
        const [formData, setFormData] = useState({});

        const handleSubmit = (e) => {
            e.preventDefault();
            console.log('Form submitted:', type, formData);
            // Simulate adding activity
            const newActivity = {
                id: Date.now(),
                type: 'success',
                title: `${type === 'addStudent' ? 'Student' : type === 'addTeacher' ? 'Teacher' : type === 'scheduleEvent' ? 'Event' : 'Report'} ${type === 'generateReport' ? 'generated' : 'added'}`,
                description: formData.name || 'Successfully completed',
                time: 'Just now',
                icon: CheckCircle
            };

            // In a real app, this would be an API call which then triggers a notification
            const existingLog = JSON.parse(localStorage.getItem('adminActivityLog') || '[]');
            localStorage.setItem('adminActivityLog', JSON.stringify([newActivity, ...existingLog]));
            window.dispatchEvent(new Event('adminActivityAdded')); // Custom event to update listeners

            onClose();
        };

        // ... Keeping the renderFormFields logic same as before but simplified for Layout context if needed.
        // For brevity in this refactor, I'm assuming the modal logic is primarily 'Demo' logic.
        // If specific pages need modals, they should implement them.
        // However, if the sidebar "Quick Actions" (if any) trigger this, it stays here.
        // The original code passed `showModal` but I don't see buttons triggering it in the MENU items anymore.
        // Ah, the original dashboard had no "Quick Action" buttons in the sidebar, only navigation.
        // So this Modal might be dead code unless triggered from Overview. 
        // But let's leave a basic version to not break anything if I missed a trigger.

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400"><X /></button>
                    <h2 className="text-2xl font-bold mb-4">Quick Action</h2>
                    <p className="text-gray-600 mb-4">This is a demo modal for {type}. Functionality moved to respective pages.</p>
                    <button onClick={onClose} className="w-full py-2 bg-purple-600 text-white rounded-lg">Close</button>
                </div>
            </div>
        );
    };

    const getActiveTabLabel = () => {
        const currentPath = location.pathname;
        const item = menuItems.find(item => currentPath.startsWith(item.path));
        return item ? item.label : 'Dashboard';
    };

    const activeTab = getActiveTabLabel();

    return (
        <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Sidebar */}
            <aside className={`w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
                <div className={`px-6 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>School ERP</h1>
                            <p className="text-xs text-gray-500">Admin Portal</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-1">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => navigate(item.path)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === item.label
                                        ? 'bg-purple-50 text-purple-600'
                                        : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-red-50 hover:text-red-600'}`}
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-8 py-4`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Home className="w-4 h-4" />
                                <span>/</span>
                                <span className={darkMode ? 'text-white' : 'text-gray-900'}>{activeTab}</span>
                                <span>/</span>
                                <span className="text-purple-600">Admin</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`pl-10 pr-4 py-2 rounded-lg border ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-gray-50 border-gray-300 text-gray-900'
                                        } focus:outline-none focus:ring-2 focus:ring-purple-500 w-64`}
                                />
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                                    className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <Bell className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                                    {notifications > 0 && (
                                        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                                            {notifications}
                                        </span>
                                    )}
                                </button>

                                {showNotificationPanel && (
                                    <div className={`absolute top-full right-0 mt-2 w-80 rounded-xl shadow-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} z-50 overflow-hidden`}>
                                        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                                            <div className="flex justify-between items-center">
                                                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activities</h3>
                                                <button onClick={() => setShowNotificationPanel(false)} className="text-gray-400 hover:text-gray-500">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {recentActivities.length === 0 ? (
                                                <div className="p-4 text-center text-gray-500 text-sm">No recent activities</div>
                                            ) : (
                                                recentActivities.map((activity) => (
                                                    <div key={activity.id} className={`p-3 border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-50 hover:bg-gray-50'} transition-colors flex items-start space-x-3`}>
                                                        <div className={`p-2 rounded-full ${getActivityColor(activity.type)} bg-opacity-20`}>
                                                            <activity.icon className="w-4 h-4" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'} truncate`}>{activity.title}</p>
                                                            <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
                                                            <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <div className={`p-2 text-center border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}>
                                            <button onClick={() => { navigate('/admin/reports'); setShowNotificationPanel(false); }} className="text-xs text-purple-600 hover:text-purple-700 font-medium">
                                                View All Activity
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                            >
                                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
                            </button>

                            <button
                                onClick={() => navigate('/admin/settings')}
                                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                            >
                                <Settings className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    {/* Pass darkMode to children via context or prop cloning if possible, but Outlet doesn't support props directly easily without context. 
                         For simplicity, child pages should manage their own dark mode or we should use a global context. 
                         The existing code passed `darkMode={darkMode}` prop. 
                         I'll use React.cloneElement if possible, otherwise I should use a Context. 
                         Given the scope, I will create a simple Context or pass it via Outlet context. 
                         Outlet has a `context` prop! */}
                    <Outlet context={{ darkMode }} />
                </div>
            </main>

            {showModal && <Modal type={modalType} onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default AdminDashboard;
