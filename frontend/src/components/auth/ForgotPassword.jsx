import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { authApi } from '../../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!error && !message) return;
        const timer = setTimeout(() => {
            setError('');
            setMessage('');
        }, 5000);
        return () => clearTimeout(timer);
    }, [error, message]);

    async function handleSubmit(e) {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const response = await authApi.forgotPassword(email);
            setMessage(response.data?.message || 'Check your inbox for further instructions');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to reset password');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout title="Reset your password">
            {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded animate-fadeIn">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {message && (
                <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded animate-fadeIn">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-700">{message}</p>
                        </div>
                    </div>
                </div>
            )}

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {loading ? 'Sending reset link...' : 'Reset Password'}
                    </button>
                </div>
            </form>

            <div className="mt-6 text-center">
                <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                    Back to Login
                </Link>
            </div>
        </AuthLayout>
    );
};

export default ForgotPassword;
