import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";

function CategoryCards() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await API.get("/category");
                setCategories(res.data);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Helper for icons and colors
    const getCategoryStyle = (name) => {
        const styles = {
            "Programming": { icon: "💻", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
            "Novels": { icon: "📖", color: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400" },
            "Science": { icon: "🔬", color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
            "History": { icon: "🏺", color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" },
            "Technology": { icon: "🚀", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" },
            "Education": { icon: "🎓", color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" },
            "Comics": { icon: "💥", color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
            "Competitive Exams": { icon: "🎯", color: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400" }
        };
        return styles[name] || { icon: "📚", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" };
    };

    if (loading) return null;

    return (
        <section className="py-16 bg-white dark:bg-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Top Categories</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Find the perfect book tailored to your interests and passions.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 stagger">
                    {categories.slice(0, 8).map((cat, idx) => {
                        const style = getCategoryStyle(cat.name);
                        return (
                            <Link 
                                key={cat._id} 
                                to={`/books?category=${cat.name}`}
                                className="group p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-card hover:shadow-xl dark:hover:shadow-primary/5 transition-all duration-300 card-glow animate-fadeInUp"
                                style={{ animationDelay: `${idx * 0.1}s` }}
                            >
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4 ${style.color} group-hover:scale-110 transition-transform duration-300`}>
                                    {style.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white group-hover:text-primary transition-colors">{cat.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{cat.bookCount || 0} Books</p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default CategoryCards;
