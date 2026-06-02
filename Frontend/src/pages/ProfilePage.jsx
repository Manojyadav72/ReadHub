import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import API from '../utils/api';
import { useAuth } from '../context/AuthProvider';
import toast from 'react-hot-toast';

function ProfilePage() {
    const { authUser, login } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    
    const [formData, setFormData] = useState({
        fullname: '',
        email: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get('/user/profile');
                setProfile(res.data);
                setFormData({
                    fullname: res.data.fullname,
                    email: res.data.email
                });
            } catch (error) {
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.put('/user/profile', formData);
            setProfile(res.data.user);
            
            // Update auth context so navbar reflects new name
            const updatedAuth = { ...authUser, user: { ...authUser.user, fullname: res.data.user.fullname } };
            login(updatedAuth);
            
            setEditing(false);
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark flex flex-col">
            <Navbar />
            
            <div className="flex-1 pt-24 pb-12 max-w-3xl mx-auto px-4 sm:px-6 w-full">
                <div className="bg-white dark:bg-dark-card rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    {/* Header Banner */}
                    <div className="h-32 bg-gradient-to-r from-primary to-accent relative"></div>
                    
                    <div className="px-8 pb-8">
                        {/* Avatar */}
                        <div className="relative -mt-16 mb-6 flex justify-between items-end">
                            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-dark-card bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center text-5xl font-bold text-primary">
                                {profile?.fullname?.charAt(0).toUpperCase()}
                            </div>
                            {!editing && (
                                <button 
                                    onClick={() => setEditing(true)}
                                    className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-dark-hover"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-8">
                                <span className="loading loading-spinner text-primary"></span>
                            </div>
                        ) : editing ? (
                            <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.fullname}
                                        onChange={(e) => setFormData({...formData, fullname: e.target.value})}
                                        className="w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-dark-hover dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                    <input 
                                        type="email" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-dark-hover dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none"
                                        required
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setEditing(false)} className="px-6 py-3 border rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-dark-hover flex-1">
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark flex-1">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-8 animate-fadeIn">
                                <div>
                                    <h1 className="text-3xl font-bold font-display">{profile?.fullname}</h1>
                                    <p className="text-gray-500">{profile?.email}</p>
                                    <div className="mt-2 inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        Role: <span className="uppercase">{profile?.role}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-8">
                                    <div className="bg-gray-50 dark:bg-dark-hover p-6 rounded-2xl text-center">
                                        <div className="text-3xl font-bold text-accent mb-1">{profile?.wishlist?.length || 0}</div>
                                        <div className="text-sm font-medium text-gray-500">Wishlisted Books</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-dark-hover p-6 rounded-2xl text-center">
                                        <div className="text-3xl font-bold text-primary mb-1">
                                            {new Date(profile?.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                                        </div>
                                        <div className="text-sm font-medium text-gray-500">Joined Date</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default ProfilePage;
