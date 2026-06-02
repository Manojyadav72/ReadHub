import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

function Navbar() {
    const { authUser, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [mobileMenu, setMobileMenu] = useState(false);
    const [userDropdown, setUserDropdown] = useState(false);

    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    useEffect(() => {
        const el = document.documentElement;
        if (theme === "dark") {
            el.classList.add("dark");
            document.body.classList.add("dark");
        } else {
            el.classList.remove("dark");
            document.body.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const [sticky, setSticky] = useState(false);
    useEffect(() => {
        const handleScroll = () => setSticky(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const close = () => setUserDropdown(false);
        if (userDropdown) document.addEventListener("click", close);
        return () => document.removeEventListener("click", close);
    }, [userDropdown]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
            setMobileMenu(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/books", label: "Books" },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${sticky ? "glass shadow-lg" : "bg-white/90 dark:bg-dark/90 backdrop-blur-sm"}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold gradient-text">ReadHub</span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link key={link.to} to={link.to}
                                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light font-medium transition-colors">
                                {link.label}
                            </Link>
                        ))}
                        {authUser?.user?.role === "admin" && (
                            <Link to="/admin" className="text-accent hover:text-accent-dark font-medium transition-colors">
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="hidden md:flex items-center">
                        <div className="relative">
                            <input type="text" placeholder="Search books..."
                                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-56 lg:w-72 pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-primary dark:focus:border-primary text-sm transition-all" />
                            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </form>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {/* Theme toggle */}
                        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
                            aria-label="Toggle theme">
                            {theme === "light" ? (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                            ) : (
                                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" /></svg>
                            )}
                        </button>

                        {/* Auth area */}
                        {authUser ? (
                            <div className="relative">
                                <button onClick={(e) => { e.stopPropagation(); setUserDropdown(!userDropdown); }}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-dark-hover transition-colors">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                                        {authUser.user?.fullname?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                    <span className="hidden lg:block text-sm font-medium max-w-[100px] truncate">{authUser.user?.fullname}</span>
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                {userDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-xl shadow-xl border dark:border-gray-700 py-2 animate-slideDown z-50">
                                        <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-dark-hover">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            Profile
                                        </Link>
                                        <Link to="/wishlist" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-dark-hover">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                            Wishlist
                                        </Link>
                                        <hr className="my-1 dark:border-gray-700" />
                                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-2">
                                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">Login</Link>
                                <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-accent rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all">Sign Up</Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileMenu ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenu && (
                    <div className="md:hidden pb-4 animate-slideDown">
                        <form onSubmit={handleSearch} className="mb-3">
                            <input type="text" placeholder="Search books..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-primary text-sm" />
                        </form>
                        {navLinks.map((link) => (
                            <Link key={link.to} to={link.to} onClick={() => setMobileMenu(false)}
                                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary font-medium">{link.label}</Link>
                        ))}
                        {authUser?.user?.role === "admin" && (
                            <Link to="/admin" onClick={() => setMobileMenu(false)} className="block py-2 text-accent font-medium">Admin Panel</Link>
                        )}
                        {!authUser && (
                            <div className="flex gap-2 mt-3">
                                <Link to="/login" onClick={() => setMobileMenu(false)} className="flex-1 text-center py-2 border rounded-lg font-medium">Login</Link>
                                <Link to="/signup" onClick={() => setMobileMenu(false)} className="flex-1 text-center py-2 bg-primary text-white rounded-lg font-medium">Sign Up</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;