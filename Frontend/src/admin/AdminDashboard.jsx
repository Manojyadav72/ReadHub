import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get('/admin/dashboard');
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    const statCards = [
        { title: "Total Books", value: stats?.totalBooks || 0, icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
        { title: "Total Users", value: stats?.totalUsers || 0, icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" },
        { title: "Categories", value: stats?.totalCategories || 0, icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z", color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
        { title: "Free Books", value: stats?.freeBooks || 0, icon: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7", color: "text-pink-500", bg: "bg-pink-100 dark:bg-pink-900/30" }
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-gray-500">Overview of your bookstore platform</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Books */}
                <div className="lg:col-span-2 bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold">Recently Added Books</h2>
                        <Link to="/admin/books" className="text-sm text-primary font-medium hover:underline">View All</Link>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800">
                                    <th className="pb-3 text-sm font-semibold text-gray-500 uppercase">Book</th>
                                    <th className="pb-3 text-sm font-semibold text-gray-500 uppercase">Category</th>
                                    <th className="pb-3 text-sm font-semibold text-gray-500 uppercase">Date Added</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.recentBooks?.map(book => (
                                    <tr key={book._id} className="border-b border-gray-50 dark:border-gray-800 last:border-0">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="font-semibold text-sm line-clamp-1">{book.name}</div>
                                            </div>
                                            <div className="text-xs text-gray-500">{book.author}</div>
                                        </td>
                                        <td className="py-4">
                                            <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs font-medium">
                                                {book.category}
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm text-gray-500">
                                            {new Date(book.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                    <h2 className="text-lg font-bold mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link to="/admin/books/add" className="w-full flex items-center justify-between p-4 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl transition-colors font-medium">
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Add New Book
                            </span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </Link>
                        <Link to="/admin/categories" className="w-full flex items-center justify-between p-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-xl transition-colors font-medium">
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                                Manage Categories
                            </span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </Link>
                        <Link to="/admin/users" className="w-full flex items-center justify-between p-4 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 rounded-xl transition-colors font-medium">
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                View Users
                            </span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
