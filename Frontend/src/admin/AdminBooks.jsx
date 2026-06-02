import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';

function AdminBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

    const fetchBooks = async (page = 1) => {
        setLoading(true);
        try {
            let query = `?page=${page}&limit=10`;
            if (search) query += `&search=${encodeURIComponent(search)}`;
            
            const res = await API.get(`/book${query}`);
            setBooks(res.data.books);
            setPagination(res.data.pagination);
        } catch (error) {
            toast.error("Failed to fetch books");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [search]); // Re-fetch when search changes

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            try {
                await API.delete(`/book/${id}`);
                toast.success("Book deleted successfully");
                fetchBooks(pagination.page);
            } catch (error) {
                toast.error("Failed to delete book");
            }
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchBooks(1);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Manage Books</h1>
                    <p className="text-gray-500">View, edit, or delete books in your library</p>
                </div>
                <Link to="/admin/books/add" className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 w-fit">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Book
                </Link>
            </div>

            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                {/* Search Bar */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <form onSubmit={handleSearchSubmit} className="relative max-w-md">
                        <input 
                            type="text" 
                            placeholder="Search by title or author..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </form>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-gray-50 dark:bg-dark-hover text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-sm">Book</th>
                                <th className="px-6 py-3 font-semibold text-sm">Category</th>
                                <th className="px-6 py-3 font-semibold text-sm">Price</th>
                                <th className="px-6 py-3 font-semibold text-sm">Status</th>
                                <th className="px-6 py-3 font-semibold text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center">
                                        <span className="loading loading-spinner text-primary"></span>
                                    </td>
                                </tr>
                            ) : books.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                        No books found.
                                    </td>
                                </tr>
                            ) : books.map(book => (
                                <tr key={book._id} className="hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-14 rounded bg-gray-200 dark:bg-gray-800 flex-shrink-0 overflow-hidden">
                                                <img 
                                                    src={book.image ? (book.image.startsWith('http') ? book.image : `http://localhost:4001${book.image}`) : "https://via.placeholder.com/40x60?text=NA"} 
                                                    alt={book.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => e.target.src = "https://via.placeholder.com/40x60?text=NA"}
                                                />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-gray-900 dark:text-white max-w-xs truncate">{book.name}</p>
                                                <p className="text-xs text-gray-500">{book.author}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                            {book.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {book.isFree || book.price === 0 ? (
                                            <span className="text-green-600 font-semibold">Free</span>
                                        ) : (
                                            `₹${book.price}`
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {book.isTrending && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                                    Trending
                                                </span>
                                            )}
                                            {book.pdf && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                    PDF
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link to={`/admin/books/edit/${book._id}`} className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </Link>
                                            <button onClick={() => handleDelete(book._id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Page {pagination.page} of {pagination.totalPages}
                        </p>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => fetchBooks(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-dark-hover"
                            >
                                Prev
                            </button>
                            <button 
                                onClick={() => fetchBooks(pagination.page + 1)}
                                disabled={pagination.page === pagination.totalPages}
                                className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-dark-hover"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminBooks;
