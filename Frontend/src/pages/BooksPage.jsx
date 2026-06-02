import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Cards from '../components/Cards';
import API from '../utils/api';

function BooksPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    
    // State
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    
    // Filters state
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        isFree: searchParams.get('isFree') === 'true',
        sort: searchParams.get('sort') || 'newest'
    });

    // Fetch categories for sidebar
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await API.get('/category');
                setCategories(res.data);
            } catch (error) {
                console.error('Failed to fetch categories', error);
            }
        };
        fetchCategories();
    }, []);

    // Fetch books based on filters
    const fetchBooks = async (page = 1) => {
        setLoading(true);
        try {
            let query = `?page=${page}&limit=12`;
            if (filters.search) query += `&search=${encodeURIComponent(filters.search)}`;
            if (filters.category) query += `&category=${encodeURIComponent(filters.category)}`;
            if (filters.isFree) query += `&isFree=true`;
            
            if (filters.sort === 'price_asc') query += `&sort=price_asc`;
            else if (filters.sort === 'price_desc') query += `&sort=price_desc`;
            else if (filters.sort === 'rating') query += `&sort=rating`;
            else query += `&sort=newest`;

            const res = await API.get(`/book${query}`);
            setBooks(res.data.books);
            setPagination(res.data.pagination);
            
            // Update URL
            const params = new URLSearchParams();
            if (filters.search) params.set('search', filters.search);
            if (filters.category) params.set('category', filters.category);
            if (filters.isFree) params.set('isFree', 'true');
            if (filters.sort !== 'newest') params.set('sort', filters.sort);
            setSearchParams(params);
            
        } catch (error) {
            console.error('Failed to fetch books', error);
        } finally {
            setLoading(false);
        }
    };

    // Refetch when filters change
    useEffect(() => {
        fetchBooks(1);
    }, [filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchBooks(newPage);
            window.scrollTo(0, 0);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark text-gray-900 dark:text-gray-100 flex flex-col">
            <Navbar />
            
            {/* Header */}
            <div className="bg-primary pt-24 pb-12 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Explore Our Library</h1>
                    <p className="text-primary-100 max-w-2xl mx-auto">
                        Find your next great read from our extensive collection of books across various categories.
                    </p>
                </div>
            </div>

            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sticky top-24">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                                Filters
                            </h2>

                            <div className="space-y-6">
                                {/* Search */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Search</label>
                                    <input 
                                        type="text" 
                                        placeholder="Title, author..." 
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-dark-hover dark:border-gray-700 outline-none focus:border-primary"
                                    />
                                </div>

                                {/* Sort */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Sort By</label>
                                    <select 
                                        value={filters.sort}
                                        onChange={(e) => handleFilterChange('sort', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-dark-hover dark:border-gray-700 outline-none focus:border-primary"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="rating">Highest Rated</option>
                                        <option value="price_asc">Price: Low to High</option>
                                        <option value="price_desc">Price: High to Low</option>
                                    </select>
                                </div>

                                {/* Categories */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Category</label>
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="category"
                                                checked={filters.category === ''}
                                                onChange={() => handleFilterChange('category', '')}
                                                className="text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm">All Categories</span>
                                        </label>
                                        {categories.map(cat => (
                                            <label key={cat._id} className="flex items-center justify-between cursor-pointer group">
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="radio" 
                                                        name="category"
                                                        checked={filters.category === cat.name}
                                                        onChange={() => handleFilterChange('category', cat.name)}
                                                        className="text-primary focus:ring-primary"
                                                    />
                                                    <span className="text-sm group-hover:text-primary transition-colors">{cat.name}</span>
                                                </div>
                                                <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 rounded">{cat.bookCount}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Free only */}
                                <div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={filters.isFree}
                                            onChange={(e) => handleFilterChange('isFree', e.target.checked)}
                                            className="rounded text-primary focus:ring-primary w-4 h-4"
                                        />
                                        <span className="text-sm font-medium text-green-600 dark:text-green-500">Free Books Only</span>
                                    </label>
                                </div>
                                
                                <button 
                                    onClick={() => setFilters({ search: '', category: '', isFree: false, sort: 'newest' })}
                                    className="w-full py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Book Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <span className="loading loading-spinner loading-lg text-primary"></span>
                            </div>
                        ) : books.length > 0 ? (
                            <>
                                <div className="mb-4 flex justify-between items-center text-sm text-gray-500">
                                    <span>Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} books</span>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {books.map(book => (
                                        <Cards key={book._id} item={book} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="flex justify-center mt-12 gap-2">
                                        <button 
                                            onClick={() => handlePageChange(pagination.page - 1)}
                                            disabled={pagination.page === 1}
                                            className="px-4 py-2 rounded-lg border bg-white dark:bg-dark-card disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-dark-hover"
                                        >
                                            Previous
                                        </button>
                                        
                                        {[...Array(pagination.totalPages)].map((_, i) => (
                                            <button 
                                                key={i}
                                                onClick={() => handlePageChange(i + 1)}
                                                className={`w-10 h-10 rounded-lg border ${pagination.page === i + 1 ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-dark-hover'}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        <button 
                                            onClick={() => handlePageChange(pagination.page + 1)}
                                            disabled={pagination.page === pagination.totalPages}
                                            className="px-4 py-2 rounded-lg border bg-white dark:bg-dark-card disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-dark-hover"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold mb-2">No books found</h3>
                                <p className="text-gray-500 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
                                <button 
                                    onClick={() => setFilters({ search: '', category: '', isFree: false, sort: 'newest' })}
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default BooksPage;
