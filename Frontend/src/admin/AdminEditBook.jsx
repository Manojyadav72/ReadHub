import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';

function AdminEditBook() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        author: '',
        description: '',
        price: '0',
        category: '',
        isTrending: false,
        isFree: false,
    });
    const [imageFile, setImageFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [catRes, bookRes] = await Promise.all([
                    API.get('/category'),
                    API.get(`/book/${id}`)
                ]);
                
                setCategories(catRes.data);
                
                const book = bookRes.data;
                setFormData({
                    name: book.name || '',
                    author: book.author || '',
                    description: book.description || '',
                    price: book.price || 0,
                    category: book.category || '',
                    isTrending: book.isTrending || false,
                    isFree: book.isFree || false,
                });
                
                if (book.image) {
                    const fullUrl = book.image.startsWith('http') ? book.image : `http://localhost:4001${book.image}`;
                    setImagePreview(fullUrl);
                    setImageUrl(book.image);
                }
            } catch (error) {
                toast.error("Failed to fetch book data");
                navigate('/admin/books');
            } finally {
                setInitialLoading(false);
            }
        };
        fetchInitialData();
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImageUrl('');
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                submitData.append(key, formData[key]);
            });

            if (imageFile) submitData.append('image', imageFile);
            else if (imageUrl) submitData.append('image', imageUrl);
            
            if (pdfFile) submitData.append('pdf', pdfFile);

            await API.put(`/book/${id}`, submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success("Book updated successfully");
            navigate('/admin/books');
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update book");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Edit Book</h1>
                    <p className="text-gray-500">Update book details</p>
                </div>
                <button onClick={() => navigate('/admin/books')} className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-dark-hover">
                    Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Left Column - Same as AddBook */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Book Title *</label>
                            <input 
                                type="text" name="name" required value={formData.name} onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Author *</label>
                            <input 
                                type="text" name="author" required value={formData.author} onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Category *</label>
                                <select 
                                    name="category" required value={formData.category} onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Price (₹)</label>
                                <input 
                                    type="number" name="price" min="0" value={formData.price} onChange={handleInputChange}
                                    disabled={formData.isFree}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea 
                                name="description" rows="4" value={formData.description} onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-primary"
                            ></textarea>
                        </div>

                        <div className="flex gap-6 p-4 bg-gray-50 dark:bg-dark-hover rounded-xl border border-gray-200 dark:border-gray-700">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" name="isFree" checked={formData.isFree} onChange={handleInputChange}
                                    className="w-4 h-4 text-primary focus:ring-primary rounded"
                                />
                                <span className="text-sm font-medium">Mark as Free</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" name="isTrending" checked={formData.isTrending} onChange={handleInputChange}
                                    className="w-4 h-4 text-primary focus:ring-primary rounded"
                                />
                                <span className="text-sm font-medium">Trending</span>
                            </label>
                        </div>
                    </div>

                    {/* Right Column - Files */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Book Cover Image</label>
                            <div className="flex flex-col items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-dark-hover hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative overflow-hidden">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-contain p-2" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                                            <svg className="w-8 h-8 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            <p className="mb-2 text-sm"><span className="font-semibold">Click to update</span></p>
                                        </div>
                                    )}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>
                            
                            <div className="mt-4 flex items-center gap-2">
                                <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                                <span className="text-xs text-gray-500 font-medium uppercase">OR</span>
                                <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1"></div>
                            </div>
                            
                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-1">Image URL</label>
                                <input 
                                    type="text" value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setImageFile(null); setImagePreview(e.target.value); }}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">PDF File (Optional)</label>
                            <label className="flex items-center justify-between w-full p-4 border border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer bg-gray-50 dark:bg-dark-hover hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <div className="flex items-center gap-3">
                                    <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                                    <div className="truncate max-w-[200px]">
                                        <p className="font-medium text-sm truncate">{pdfFile ? pdfFile.name : "Update PDF Document"}</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm font-medium">Browse</span>
                                <input type="file" className="hidden" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files[0])} />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-6 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <span className="loading loading-spinner loading-sm"></span>}
                        {loading ? "Updating..." : "Update Book"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AdminEditBook;
