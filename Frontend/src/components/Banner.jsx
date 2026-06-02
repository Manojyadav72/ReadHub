import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Banner() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) navigate(`/books?search=${encodeURIComponent(search.trim())}`);
    };

    return (
        <section className="hero-gradient min-h-[85vh] flex items-center relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full animate-float"></div>
                <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full animate-float" style={{ animationDelay: "1s" }}></div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 relative z-10 w-full">
                <div className="text-white text-center animate-fadeInUp">
                    <div className="inline-block px-4 py-1.5 bg-white/15 rounded-full text-sm font-medium mb-6">📚 Welcome to ReadHub</div>
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 font-display">
                        Discover Your Next <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">Favorite Book</span>
                    </h1>
                    <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">Explore our vast collection of books spanning programming, science, novels, history, and more.</p>
                    <form onSubmit={handleSearch} className="flex max-w-lg mx-auto">
                        <input type="text" placeholder="Search by title, author..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 px-5 py-3 rounded-l-full bg-white/15 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none" />
                        <button type="submit" className="px-6 py-3 bg-white text-primary font-semibold rounded-r-full hover:bg-gray-100 transition-colors">Search</button>
                    </form>
                    <div className="flex gap-8 mt-10 justify-center">
                        {[{ n: "1000+", l: "Books" }, { n: "500+", l: "Authors" }, { n: "8", l: "Categories" }].map((s) => (
                            <div key={s.l}><div className="text-2xl font-bold">{s.n}</div><div className="text-sm text-white/70">{s.l}</div></div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
export default Banner;
