import React from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Public Pages
import Home from "./home/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import BooksPage from "./pages/BooksPage";
import BookDetails from "./pages/BookDetails";

// Protected Pages
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ProfilePage from "./pages/ProfilePage";
import WishlistPage from "./pages/WishlistPage";

// Admin Pages
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminBooks from "./admin/AdminBooks";
import AdminAddBook from "./admin/AdminAddBook";
import AdminEditBook from "./admin/AdminEditBook";
import AdminUsers from "./admin/AdminUsers";
import AdminCategories from "./admin/AdminCategories";

function App() {
    return (
        <div className="dark:bg-slate-900 dark:text-white min-h-screen transition-colors duration-300">
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/books" element={<BooksPage />} />
                <Route path="/books/:id" element={<BookDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes */}
                <Route 
                    path="/profile" 
                    element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} 
                />
                <Route 
                    path="/wishlist" 
                    element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} 
                />

                {/* Admin Routes */}
                <Route 
                    path="/admin" 
                    element={<AdminRoute><AdminLayout /></AdminRoute>}
                >
                    <Route index element={<AdminDashboard />} />
                    <Route path="books" element={<AdminBooks />} />
                    <Route path="books/add" element={<AdminAddBook />} />
                    <Route path="books/edit/:id" element={<AdminEditBook />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="categories" element={<AdminCategories />} />
                </Route>
            </Routes>
            <Toaster position="top-center" reverseOrder={false} />
        </div>
    );
}

export default App;
