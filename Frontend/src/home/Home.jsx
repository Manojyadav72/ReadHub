import React from 'react';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import CategoryCards from '../components/CategoryCards';
import TrendingBooks from '../components/TrendingBooks';
import RecentBooks from '../components/RecentBooks';
import Freebook from '../components/Freebook';
import Footer from '../components/Footer';

function Home() {
    return (
        <div className="min-h-screen bg-white dark:bg-dark text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Navbar />
            <main>
                <Banner />
                <CategoryCards />
                <TrendingBooks />
                <RecentBooks />
                <Freebook />
                
                {/* Newsletter CTA */}
                <section className="py-20 bg-gradient-to-br from-primary to-accent relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Stay Updated with New Releases</h2>
                        <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">
                            Subscribe to our newsletter to get notified about new books, free resources, and special offers.
                        </p>
                        <form className="flex flex-col sm:flex-row max-w-lg mx-auto gap-2" onSubmit={(e) => e.preventDefault()}>
                            <input type="email" placeholder="Enter your email address" required
                                className="flex-1 px-5 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900" />
                            <button type="submit" className="px-8 py-3 bg-dark hover:bg-black text-white font-semibold rounded-xl transition-colors shadow-lg">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default Home;
