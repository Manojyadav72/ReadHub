import Category from "../model/category.model.js";
import Book from "../model/book.model.js";

// Get all categories with book count
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ name: 1 });

        // Get book count for each category
        const categoriesWithCount = await Promise.all(
            categories.map(async (cat) => {
                const bookCount = await Book.countDocuments({ category: cat.name });
                return { ...cat.toObject(), bookCount };
            })
        );

        res.status(200).json(categoriesWithCount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create category (admin only)
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
        if (existing) {
            return res.status(400).json({ message: "Category already exists" });
        }

        const category = new Category({ name, description });
        await category.save();

        res.status(201).json({ message: "Category created", category });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update category (admin only)
export const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category updated", category });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete category (admin only)
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({ message: "Category deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
