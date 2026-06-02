import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../utils/api';
import { useAuth } from '../context/AuthProvider';
import toast from 'react-hot-toast';

function BookDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authUser } = useAuth();
    
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showPdf, setShowPdf] = useState(false);
    const [userRating, setUserRating] = useState(0);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const res = await API.get(`/book/${id}`);
                setBook(res.data);
                
                // Check if wishlisted
                if (authUser && authUser.user && authUser.user.wishlist) {
                    setIsWishlisted(authUser.user.wishlist.includes(id));
                }
            } catch (error) {
                console.error("Error fetching book details", error);
                toast.error("Book not found");
                navigate('/books');
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [id, authUser, navigate]);

    const handleWishlist = async () => {
        if (!authUser) {
            toast.error("Please login to add to wishlist");
            navigate('/login');
            return;
        }

        try {
            if (isWishlisted) {
                await API.delete(`/user/wishlist/${id}`);
                setIsWishlisted(false);
                toast.success("Removed from wishlist");
            } else {
                await API.post(`/user/wishlist/${id}`);
                setIsWishlisted(true);
                toast.success("Added to wishlist");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Action failed");
        }
    };

    const handleRate = async (rating) => {
        if (!authUser) {
            toast.error("Please login to rate books");
            return;
        }

        try {
            const res = await API.post(`/book/${id}/rate`, { rating });
            setBook(prev => ({
                ...prev,
                rating: res.data.rating,
                totalRatings: res.data.totalRatings
            }));
            setUserRating(rating);
            toast.success("Thank you for rating!");
        } catch (error) {
            toast.error("Failed to submit rating");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!book) return null;

    const imageUrl = book.image ? (book.image.startsWith('http') ? book.image : `https://readhub-qkv1.onrender.com${book.image}`) : "https://via.placeholder.com/400x600?text=No+Cover";
    const pdfUrl = book.pdf ? `https://readhub-qkv1.onrender.com${book.pdf}` : null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark text-gray-900 dark:text-gray-100">
            <Navbar />
            
            <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
                {/* Breadcrumbs */}
                <div className="text-sm breadcrumbs mb-8 text-gray-500">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/books">Books</Link></li>
                        <li><Link to={`/books?category=${book.category}`}>{book.category}</Link></li>
                        <li className="font-semibold text-gray-900 dark:text-white truncate max-w-xs">{book.name}</li>
                    </ul>
                </div>

                <div className="bg-white dark:bg-dark-card rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Book Cover */}
                        <div className="w-full md:w-1/3 lg:w-1/4 p-8 bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center border-r border-gray-100 dark:border-gray-800">
                            <div className="w-full max-w-[240px] aspect-[2/3] shadow-2xl rounded-lg overflow-hidden relative group">
                                <img 
                                    src={imageUrl} 
                                    alt={book.name} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {book.isFree && (
                                    <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 font-bold rounded-bl-lg">
                                        FREE
                                    </div>
                                )}
                            </div>
                            
                            <div className="mt-8 w-full flex gap-3">
                                {pdfUrl ? (
                                    <button 
                                        onClick={() => setShowPdf(!showPdf)}
                                        className="flex-1 py-3 px-4 bg-gradient-to-r from-primary to-accent text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                        {showPdf ? "Hide PDF" : "Read Now"}
                                    </button>
                                ) : (
                                    <button disabled className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-800 text-gray-500 font-bold rounded-xl cursor-not-allowed">
                                        No PDF Available
                                    </button>
                                )}
                                <button 
                                    onClick={handleWishlist}
                                    className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 transition-colors ${isWishlisted ? 'border-accent bg-accent/10 text-accent' : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-accent hover:text-accent'}`}
                                    title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                                >
                                    <svg className="w-6 h-6" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Book Info */}
                        <div className="w-full md:w-2/3 lg:w-3/4 p-8 lg:p-12">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider">
                                    {book.category}
                                </span>
                                {book.isTrending && (
                                    <span className="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg>
                                        Trending
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-5xl font-bold font-display mb-2">{book.name}</h1>
                            <p className="text-xl text-gray-500 dark:text-gray-400 mb-6">By <span className="text-gray-900 dark:text-white font-medium">{book.author}</span></p>

                            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center text-yellow-400">
                                        <svg className="w-6 h-6 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    </div>
                                    <span className="text-2xl font-bold">{book.rating?.toFixed(1) || "0.0"}</span>
                                    <span className="text-gray-500">({book.totalRatings || 0} reviews)</span>
                                </div>
                                <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {book.isFree || book.price === 0 ? "Free" : `₹${book.price}`}
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-4">Synopsis</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                    {book.description || "No description available for this book."}
                                </p>
                            </div>

                            {/* Rate Book Area */}
                            {authUser && (
                                <div className="bg-gray-50 dark:bg-dark p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
                                    <h4 className="font-bold mb-2">Rate this book</h4>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button 
                                                key={star}
                                                onClick={() => handleRate(star)}
                                                className="focus:outline-none transition-transform hover:scale-125"
                                            >
                                                <svg className={`w-8 h-8 ${star <= userRating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* PDF Viewer */}
                {showPdf && pdfUrl && (
                    <div className="mt-8 bg-white dark:bg-dark-card rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-4 h-[80vh]">
                        <div className="flex justify-between items-center mb-4 px-4">
                            <h3 className="text-xl font-bold">PDF Reader</h3>
                            <div className="flex gap-2">
                                <a href={pdfUrl} download target="_blank" rel="noreferrer" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700">Download PDF</a>
                                <button onClick={() => setShowPdf(false)} className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-200">Close</button>
                            </div>
                        </div>
                        <iframe 
                            src={`${pdfUrl}#toolbar=0`} 
                            className="w-full h-[calc(100%-60px)] rounded-xl border border-gray-200 dark:border-gray-800"
                            title="PDF Viewer"
                        ></iframe>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default BookDetails;
