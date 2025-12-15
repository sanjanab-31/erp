import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { Mail, Lock, AlertCircle, User, BookOpen, Shield, Users } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();

    const [activeRole, setActiveRole] = useState('Student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const users = {
        Student: { email: 'student@eshwar.com', password: 'student123' },
        Teacher: { email: 'teacher@eshwar.com', password: 'teacher123' },
        Admin: { email: 'admin@eshwar.com', password: 'admin123' },
        Parent: { email: 'parent@eshwar.com', password: 'parent123' },
    };

    const roles = [
        { name: 'Student', icon: User },
        { name: 'Teacher', icon: BookOpen },
        { name: 'Admin', icon: Shield },
        { name: 'Parent', icon: Users },
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

        const validUser = users[activeRole];

        if (
            email !== validUser.email ||
            password !== validUser.password
        ) {
            setError('Invalid email or password');
            setLoading(false);
            return;
        }


        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', activeRole);
        localStorage.setItem('userEmail', email);

        // Set user name based on role
        const userNames = {
            Student: 'Mike Wilson',
            Teacher: 'Sarah Johnson',
            Admin: 'Admin User',
            Parent: 'Parent User'
        };
        localStorage.setItem('userName', userNames[activeRole]);

        setTimeout(() => {
            navigate(`/dashboard/${activeRole.toLowerCase()}`);
        }, 800);
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

            {/* Role Tabs */}
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
                {/* Email */}
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
                            className="w-full pl-10 py-2.5 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 py-2.5 border rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Remember + Forgot */}
                <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        Remember me
                    </label>
                    <Link to="/forgot-password" className="text-sm text-blue-600">
                        Forgot your password?
                    </Link>
                </div>

                {/* Submit */}
                <button
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition"
                >
                    {loading ? 'Signing in...' : 'Sign in'}
                </button>
            </form>

            {/* Create Account */}
            <div className="mt-6 text-center text-sm text-gray-600">
                Don&apos;t have an account?
            </div>

            <Link
                to="/signup"
                className="mt-3 block text-center border border-blue-600 text-blue-600 py-2.5 rounded-md hover:bg-blue-50"
            >
                Create an account
            </Link>

        </AuthLayout>
    );
};

export default Login;
