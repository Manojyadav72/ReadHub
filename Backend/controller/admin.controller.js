import User from "../model/user.model.js";
import Book from "../model/book.model.js";
import Category from "../model/category.model.js";

// Dashboard stats
export const getDashboardStats = async (req, res) => {
    try {
        const [totalBooks, totalUsers, totalCategories, freeBooks, trendingBooks, recentBooks] =
            await Promise.all([
                Book.countDocuments(),
                User.countDocuments(),
                Category.countDocuments(),
                Book.countDocuments({ isFree: true }),
                Book.countDocuments({ isTrending: true }),
                Book.find({}).sort({ createdAt: -1 }).limit(5).select("name author category createdAt"),
            ]);

        res.status(200).json({
            totalBooks,
            totalUsers,
            totalCategories,
            freeBooks,
            trendingBooks,
            recentBooks,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password").sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Toggle user role (admin only)
export const toggleUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.role = user.role === "admin" ? "user" : "admin";
        await user.save();

        res.status(200).json({
            message: `User role changed to ${user.role}`,
            user: { _id: user._id, fullname: user.fullname, email: user.email, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
