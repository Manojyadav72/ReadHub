import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// Signup
export const signup = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            fullname,
            email,
            password: hashedPassword,
        });

        await user.save();

        const token = generateToken(user);

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.log("Error: " + error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.log("Error: " + error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password").populate("wishlist");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email } = req.body;
        const updateData = {};
        if (fullname) updateData.fullname = fullname;
        if (email) updateData.email = email;

        const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true }).select("-password");
        res.status(200).json({ message: "Profile updated", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get wishlist
export const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("wishlist");
        res.status(200).json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const bookId = req.params.bookId;

        if (user.wishlist.includes(bookId)) {
            return res.status(400).json({ message: "Book already in wishlist" });
        }

        user.wishlist.push(bookId);
        await user.save();

        res.status(200).json({ message: "Added to wishlist", wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const bookId = req.params.bookId;

        user.wishlist = user.wishlist.filter((id) => id.toString() !== bookId);
        await user.save();

        res.status(200).json({ message: "Removed from wishlist", wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
