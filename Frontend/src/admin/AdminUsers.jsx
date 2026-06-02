import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthProvider';

function AdminUsers() {
    const { authUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await API.get('/admin/users');
            setUsers(res.data);
        } catch (error) {
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (id === authUser.user._id) {
            toast.error("You cannot delete your own account");
            return;
        }
        
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await API.delete(`/admin/users/${id}`);
                toast.success("User deleted successfully");
                fetchUsers();
            } catch (error) {
                toast.error("Failed to delete user");
            }
        }
    };

    const handleRoleToggle = async (id) => {
        if (id === authUser.user._id) {
            toast.error("You cannot change your own role");
            return;
        }

        try {
            await API.put(`/admin/users/${id}/role`);
            toast.success("User role updated");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to update role");
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Manage Users</h1>
                <p className="text-gray-500">View and manage platform users</p>
            </div>

            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-gray-50 dark:bg-dark-hover text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-sm">User</th>
                                <th className="px-6 py-4 font-semibold text-sm">Joined</th>
                                <th className="px-6 py-4 font-semibold text-sm">Role</th>
                                <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center">
                                        <span className="loading loading-spinner text-primary"></span>
                                    </td>
                                </tr>
                            ) : users.map(user => (
                                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                                                {user.fullname.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                                                    {user.fullname}
                                                    {user._id === authUser.user._id && <span className="text-[10px] bg-gray-200 dark:bg-gray-700 px-1.5 rounded text-gray-500">YOU</span>}
                                                </p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => handleRoleToggle(user._id)}
                                            disabled={user._id === authUser.user._id}
                                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                                user.role === 'admin' 
                                                ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:border-purple-800/50' 
                                                : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                                            } ${user._id !== authUser.user._id ? 'hover:shadow-md cursor-pointer' : 'opacity-80 cursor-not-allowed'}`}
                                            title="Click to toggle role"
                                        >
                                            {user.role}
                                            {user._id !== authUser.user._id && <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleDelete(user._id)}
                                            disabled={user._id === authUser.user._id}
                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminUsers;
