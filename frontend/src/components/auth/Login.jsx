import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { Mail, Lock, AlertCircle, User, BookOpen, Shield, Users, Eye, EyeOff } from 'lucide-react';
import { login as authLogin } from '../../utils/auth';

const Login = () => {
    const navigate = useNavigate();

    const [activeRole, setActiveRole] = useState('Admin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const roles = [
        { name: 'Admin', icon: Shield },
        { name: 'Teacher', icon: BookOpen },
        { name: 'Parent', icon: Users },
        { name: 'Student', icon: User },
    ];

    useEffect(() => {
        if (!error) return;
        const timer = setTimeout(() => setError(''), 5000);
        return () => clearTimeout(timer);
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { authApi } = await import('../../services/api');
            const response = await authApi.login({ email, password, role: activeRole.toLowerCase() });

            const { token, user } = response.data.data;
            
            // Use the auth utility to handle login
            authLogin(token, user);

            // Redirect based on role
            const roleRoutes = {
                student: '/dashboard/student',
                teacher: '/teacher/dashboard',
                admin: '/admin/dashboard',
                parent: '/parent/dashboard'
            };

            const redirectPath = roleRoutes[user.role.toLowerCase()] || '/dashboard/student';

            setTimeout(() => {
                navigate(redirectPath);
            }, 800);
        } catch (error) {
            console.error('Login error', error);
            setError(error.response?.data?.message || error.message || 'Invalid email or password');
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Sign in to your account"
            subtitle={`Login as ${activeRole}`}
        >
            {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            )}

            <div className="mb-6 border-b">
                <div className="flex justify-center gap-6">
                    {roles.map(({ name, icon: Icon }) => (
                        <button
                            key={name}
                            onClick={() => setActiveRole(name)}
                            className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition
                ${activeRole === name
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }
              `}
                        >
                            <Icon className="w-4 h-4" />
                            {name}
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium mb-1">Email address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full pl-10 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                <div className="flex justify-end items-center">
                    {email !== 'admin@sece.ac.in' && (
                        <Link to="/forgot-password" className="text-sm text-blue-600">
                            Forgot your password?
                        </Link>
                    )}
                </div>

                <button
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition"
                >
                    {loading ? 'Signing in...' : 'Sign in'}
                </button>
            </form>

        </AuthLayout>
    );
};

export default Login;
