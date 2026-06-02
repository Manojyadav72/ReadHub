import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../utils/api';
import Cards from '../components/Cards';
import { Link } from 'react-router-dom';

function WishlistPage() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const res = await API.get('/user/wishlist');
                setWishlist(res.data);
            } catch (error) {
                console.error("Failed to fetch wishlist", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark flex flex-col">
            <Navbar />
            
            <div className="flex-1 pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 w-full">
                <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        My Wishlist
                    </h1>
                    <p className="text-gray-500 mt-2">Books you've saved for later ({wishlist.length})</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlist.map(book => (
                            <Cards key={book._id} item={book} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            You haven't added any books to your wishlist yet. Explore our collection and save your favorites!
                        </p>
                        <Link to="/books" className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
                            Explore Books
                        </Link>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default WishlistPage;
