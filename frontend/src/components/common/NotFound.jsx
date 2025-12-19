import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();
    const darkMode = document.documentElement.classList.contains('dark'); // Fallback check

    return (
        <div className={`min-h-screen flex items-center justify-center p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="max-w-md w-full text-center">
                <div className="relative mb-8">
                    {/* Background Decorative Rings */}
                    <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                        <div className="w-64 h-64 bg-blue-500/10 rounded-full"></div>
                    </div>

                    {/* 404 Text */}
                    <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-purple-600 relative">
                        404
                    </h1>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2 text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                        <AlertCircle className="w-8 h-8 text-blue-500" />
                        <h2>Page Not Found</h2>
                    </div>

                    <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Oops! The page you're looking for has vanished into thin air or moved to a new secret location.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                        <button
                            onClick={() => navigate(-1)}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-xl border-2 transition-all duration-300 ${darkMode
                                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-blue-500/50'
                                    : 'border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-blue-500/50'
                                }`}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Go Back</span>
                        </button>

                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 active:scale-95"
                        >
                            <Home className="w-5 h-5" />
                            <span>Return Home</span>
                        </button>
                    </div>
                </div>

                {/* Technical Details (Subtle) */}
                <div className="mt-12 text-xs text-gray-500 font-mono tracking-widest uppercase">
                    Error Code: ERR_PAGE_UNREACHABLE
                </div>
            </div>
        </div>
    );
};

export default NotFound;
