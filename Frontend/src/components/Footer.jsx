import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-gray-50 dark:bg-dark border-t dark:border-gray-800 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold gradient-text">ReadHub</span>
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mb-6">
                            Your ultimate online bookstore. Explore thousands of books across programming, novels, science, history, and more. Read, learn, and grow with ReadHub.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z", viewBox: "0 0 24 24" },
                                { icon: "M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z", viewBox: "0 0 24 24" },
                                { icon: "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z", viewBox: "0 0 24 24" },
                            ].map((social, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-gray-200 dark:bg-dark-card flex items-center justify-center hover:bg-primary hover:text-white dark:hover:bg-primary transition-all">
                                    <svg className="w-4 h-4 fill-current" viewBox={social.viewBox}><path d={social.icon} /></svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Explore</h3>
                        <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                            <li><Link to="/books" className="hover:text-primary transition-colors">All Books</Link></li>
                            <li><Link to="/books?category=Programming" className="hover:text-primary transition-colors">Programming</Link></li>
                            <li><Link to="/books?category=Novels" className="hover:text-primary transition-colors">Novels</Link></li>
                            <li><Link to="/books?category=Science" className="hover:text-primary transition-colors">Science</Link></li>
                            <li><Link to="/books?isFree=true" className="hover:text-primary transition-colors">Free Books</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t dark:border-gray-800 mt-10 pt-6 text-center text-sm text-gray-400">
                    <p>© {new Date().getFullYear()} ReadHub. Made with 💜 • All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
