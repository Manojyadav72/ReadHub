import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';

function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCat, setEditingCat] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    const fetchCategories = async () => {
        try {
            const res = await API.get('/category');
            setCategories(res.data);
        } catch (error) {
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenModal = (cat = null) => {
        if (cat) {
            setEditingCat(cat);
            setFormData({ name: cat.name, description: cat.description || '' });
        } else {
            setEditingCat(null);
            setFormData({ name: '', description: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCat) {
                await API.put(`/category/${editingCat._id}`, formData);
                toast.success("Category updated");
            } else {
                await API.post('/category', formData);
                toast.success("Category created");
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save category");
        }
    };

    const handleDelete = async (id, count) => {
        if (count > 0) {
            toast.error(`Cannot delete category with ${count} existing books`);
            return;
        }

        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await API.delete(`/category/${id}`);
                toast.success("Category deleted");
                fetchCategories();
            } catch (error) {
                toast.error("Failed to delete category");
            }
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Manage Categories</h1>
                    <p className="text-gray-500">Organize your books into categories</p>
                </div>
                <button 
                    onClick={() => handleOpenModal()} 
                    className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 w-fit"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    New Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full flex justify-center py-10">
                        <span className="loading loading-spinner text-primary"></span>
                    </div>
                ) : categories.map(cat => (
                    <div key={cat._id} className="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{cat.name}</h3>
                            <div className="flex gap-1">
                                <button onClick={() => handleOpenModal(cat)} className="p-1.5 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                                <button onClick={() => handleDelete(cat._id, cat.bookCount)} className={`p-1.5 rounded-lg transition-colors ${cat.bookCount > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-dark-hover'}`} title={cat.bookCount > 0 ? "Cannot delete category containing books" : "Delete category"}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-4 h-10 line-clamp-2">{cat.description || "No description provided."}</p>
                        <div className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 w-fit px-3 py-1 rounded-full">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            {cat.bookCount || 0} Books
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-dark-card w-full max-w-md rounded-2xl shadow-xl animate-slideDown overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <h2 className="text-lg font-bold">{editingCat ? 'Edit Category' : 'New Category'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Category Name *</label>
                                    <input 
                                        type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-dark-hover focus:ring-2 focus:ring-purple-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea 
                                        rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-dark-hover focus:ring-2 focus:ring-purple-500 outline-none"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="mt-6 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-dark-hover font-medium">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminCategories;
