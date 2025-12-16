import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole') || 'Guest';
    const userEmail = localStorage.getItem('userEmail') || '';

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex justify-between items-center mb-8 p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome to {userRole} Dashboard
                </h1>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 border border-primary-600 rounded-md text-sm font-medium text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                >
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">User Information</h2>
                    <p className="text-gray-600 mb-2">
                        <strong className="text-gray-900 font-semibold">Role:</strong> {userRole}
                    </p>
                    <p className="text-gray-600">
                        <strong className="text-gray-900 font-semibold">Email:</strong> {userEmail}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
                    <p className="text-gray-600 mb-2">
                        This is your personalized {userRole.toLowerCase()} dashboard.
                    </p>
                    <p className="text-gray-600">
                        More features coming soon!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
