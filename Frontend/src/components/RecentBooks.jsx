import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import Cards from "./Cards";

function RecentBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getRecentBooks = async () => {
            try {
                const response = await API.get('/book/recent');
                setBooks(response.data || []);
            } catch (error) {
                console.error('Error fetching recent books:', error);
            } finally {
                setLoading(false);
            }
        };
        getRecentBooks();
    }, []);

    if (loading || books.length === 0) return null;

    return (
        <section className="py-16 bg-white dark:bg-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-2">Recently Added</h2>
                        <p className="text-gray-500 dark:text-gray-400">
                            Discover the newest additions to our growing library.
                        </p>
                    </div>
                    <Link to="/books?sort=newest" className="text-primary font-medium hover:underline flex items-center gap-1">
                        View All <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {books.slice(0, 8).map((item) => (
                        <Cards key={item._id} item={item} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default RecentBooks;
