import React, { useState } from 'react';
import { Search, Filter, Plus, MoreVertical, Mail, Phone, Edit, Trash2, BookOpen } from 'lucide-react';

const Teachers = ({ darkMode }) => {
    const [teachers] = useState([
        { id: 1, name: 'Sarah Johnson', subject: 'Mathematics', id_no: 'T-101', email: 'sarah@school.com', phone: '+1 234-567-8901', status: 'Active' },
        { id: 2, name: 'Michael Chen', subject: 'Physics', id_no: 'T-102', email: 'michael@school.com', phone: '+1 234-567-8902', status: 'Active' },
        { id: 3, name: 'Emily Brown', subject: 'English', id_no: 'T-103', email: 'emily@school.com', phone: '+1 234-567-8903', status: 'On Leave' },
        { id: 4, name: 'David Wilson', subject: 'History', id_no: 'T-104', email: 'david@school.com', phone: '+1 234-567-8904', status: 'Active' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    const filteredTeachers = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Teachers Management
                </h2>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search teachers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border ${darkMode
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900'
                                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        />
                    </div>
                    <button className={`p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-gray-700'
                        } hover:bg-gray-100 dark:hover:bg-gray-600`}>
                        <Filter className="w-5 h-5" />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">Add Teacher</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeachers.map((teacher) => (
                    <div key={teacher.id} className={`rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 transition-shadow hover:shadow-lg`}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                                    {teacher.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{teacher.name}</h3>
                                    <p className="text-sm text-gray-500">{teacher.id_no}</p>
                                </div>
                            </div>
                            <div className="relative group">
                                <button className={`p-1 rounded hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700' : ''}`}>
                                    <MoreVertical className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <BookOpen className="w-4 h-4 text-purple-500" />
                                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{teacher.subject}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{teacher.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{teacher.phone}</span>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${teacher.status === 'Active'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}>
                                {teacher.status}
                            </span>
                            <div className="flex gap-2">
                                <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-blue-400' : 'hover:bg-gray-50 text-blue-600'}`}>
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-red-400' : 'hover:bg-gray-50 text-red-600'}`}>
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Teachers;
