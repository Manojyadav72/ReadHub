import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import API from "../utils/api";
import toast from "react-hot-toast";

function Cards({ item }) {
    const { authUser } = useAuth();
    const [isWishlisted, setIsWishlisted] = React.useState(false);

    React.useEffect(() => {
        if (authUser && authUser.user && authUser.user.wishlist) {
            setIsWishlisted(authUser.user.wishlist.includes(item._id));
        }
    }, [authUser, item._id]);

    const handleWishlist = async (e) => {
        e.preventDefault(); // Prevent navigating to book details if clicking wishlist icon
        e.stopPropagation();

        if (!authUser) {
            toast.error("Please login to add to wishlist");
            return;
        }

        try {
            if (isWishlisted) {
                await API.delete(`/user/wishlist/${item._id}`);
                setIsWishlisted(false);
                toast.success("Removed from wishlist");
            } else {
                await API.post(`/user/wishlist/${item._id}`);
                setIsWishlisted(true);
                toast.success("Added to wishlist");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update wishlist");
        }
    };

    return (
        <div className="mt-6 my-3 p-3 group">
            <Link to={`/books/${item._id}`} className="block h-full">
                <div className="card bg-white dark:bg-dark-card w-full shadow-lg hover:shadow-xl dark:border dark:border-gray-800 transition-all duration-300 card-glow overflow-hidden h-full flex flex-col">
                    {/* Image Area */}
                    <figure className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img 
                            src={item.image ? `https://readhub-qkv1.onrender.com${item.image}` : "https://via.placeholder.com/400x600?text=No+Cover"} 
                            alt={item.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                                e.target.onerror = null;
                                // If local file fails, try as absolute URL
                                if (item.image && !item.image.startsWith('http')) {
                                   e.target.src = `https://readhub-qkv1.onrender.com${item.image}`;
                                } else if(item.image) {
                                   e.target.src = item.image;
                                } else {
                                   e.target.src = "https://via.placeholder.com/400x600?text=No+Cover";
                                }
                            }}
                        />
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {item.isTrending && (
                                <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" /></svg>
                                    Trending
                                </span>
                            )}
                            {item.isFree && (
                                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                                    Free
                                </span>
                            )}
                        </div>

                        {/* Wishlist Button Overlay */}
                        <button 
                            onClick={handleWishlist}
                            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${isWishlisted ? 'bg-accent/90 text-white shadow-lg' : 'bg-white/50 text-gray-700 hover:bg-white hover:text-accent shadow-sm'} opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0`}
                        >
                            <svg className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isWishlisted ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </figure>

                    {/* Content Area */}
                    <div className="card-body p-5 flex-grow flex flex-col">
                        <div className="flex justify-between items-start gap-2 mb-1">
                            <span className="text-xs font-medium text-primary dark:text-primary-light uppercase tracking-wider">{item.category}</span>
                            <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs font-medium text-yellow-500">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                {item.rating?.toFixed(1) || "0.0"}
                            </div>
                        </div>
                        
                        <h2 className="card-title text-lg font-bold line-clamp-1 mb-1 text-gray-900 dark:text-white" title={item.name}>
                            {item.name}
                        </h2>
                        
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-1">By {item.author}</p>
                        
                        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {item.isFree || item.price === 0 ? "Free" : `₹${item.price}`}
                            </div>
                            <span className="text-sm font-medium text-primary group-hover:underline">View Details →</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default Cards;
