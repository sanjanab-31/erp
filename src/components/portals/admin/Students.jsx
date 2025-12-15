import React, { useState } from 'react';
import { Search, Filter, Plus, MoreVertical, Mail, Phone, Edit, Trash2 } from 'lucide-react';

const Students = ({ darkMode }) => {
    const [students] = useState([
        { id: 1, name: 'Emma Davis', class: '10A', rollNo: '1001', email: 'emma@school.com', parent: 'Robert Davis', status: 'Active' },
        { id: 2, name: 'James Wilson', class: '10B', rollNo: '1002', email: 'james@school.com', parent: 'Sarah Wilson', status: 'Active' },
        { id: 3, name: 'Sophia Miller', class: '11A', rollNo: '1101', email: 'sophia@school.com', parent: 'Michael Miller', status: 'Inactive' },
        { id: 4, name: 'Lucas Taylor', class: '9A', rollNo: '9001', email: 'lucas@school.com', parent: 'Jennifer Taylor', status: 'Active' },
        { id: 5, name: 'Olivia Anderson', class: '12B', rollNo: '1205', email: 'olivia@school.com', parent: 'David Anderson', status: 'Active' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Students Management
                </h2>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search students..."
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
                        <span className="hidden sm:inline">Add Student</span>
                    </button>
                </div>
            </div>

            <div className={`overflow-hidden rounded-xl border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="overflow-x-auto">
                    <table className={`w-full text-left ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <thead className={`text-xs uppercase ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                            <tr>
                                <th className="px-6 py-4 font-medium">Name</th>
                                <th className="px-6 py-4 font-medium">ID / Class</th>
                                <th className="px-6 py-4 font-medium">Parent Info</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className={`${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                                                {student.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{student.name}</p>
                                                <p className="text-sm text-gray-500">{student.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{student.rollNo}</p>
                                        <p className="text-sm text-gray-500">Class {student.class}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{student.parent}</p>
                                        <div className="flex gap-2 mt-1">
                                            <button className="text-gray-400 hover:text-blue-500"><Mail className="w-4 h-4" /></button>
                                            <button className="text-gray-400 hover:text-green-500"><Phone className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === 'Active'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}>
                                                <Edit className="w-4 h-4 text-blue-500" />
                                            </button>
                                            <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}>
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </button>
                                            <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}>
                                                <MoreVertical className="w-4 h-4 text-gray-400" />
                                            </button>
                                        </div>
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

export default Students;
