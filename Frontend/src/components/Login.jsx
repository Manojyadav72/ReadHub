import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import API from "../utils/api";
import { useAuth } from "../context/AuthProvider";
import toast from "react-hot-toast";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isAdminLogin, setIsAdminLogin] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const toggleLoginType = (type) => {
        setIsAdminLogin(type === 'admin');
        if (type === 'admin') {
            setValue("email", "admin@readhub.com");
        } else {
            setValue("email", "");
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await API.post("/user/login", data);
            login(response.data);
            toast.success("Login Successful!");
            navigate("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-4000"></div>

            <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-card p-10 rounded-3xl shadow-xl relative z-10 border border-gray-100 dark:border-gray-800">
                <div className="text-center">
                    <Link to="/" className="inline-block p-3 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </Link>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {isAdminLogin ? "Admin Login" : "Welcome Back"}
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {isAdminLogin ? "Sign in to access the admin dashboard" : "Please sign in to your ReadHub account"}
                    </p>
                </div>

                <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mt-6">
                    <button
                        type="button"
                        onClick={() => toggleLoginType('user')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${!isAdminLogin ? 'bg-white dark:bg-dark-card shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 dark:text-gray-400'}`}
                    >
                        User Login
                    </button>
                    <button
                        type="button"
                        onClick={() => toggleLoginType('admin')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${isAdminLogin ? 'bg-white dark:bg-dark-card shadow-sm text-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 dark:text-gray-400'}`}
                    >
                        Admin Login
                    </button>
                </div>

                <form className="mt-6 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-dark-hover focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="you@example.com"
                                {...register("email", { required: "Email is required" })}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-dark-hover focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                                {...register("password", { required: "Password is required" })}
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-primary to-accent hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                    <div className="text-center text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Don't have an account? </span>
                        <Link to="/signup" className="font-medium text-primary hover:text-primary-dark transition-colors">
                            Sign up now
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
