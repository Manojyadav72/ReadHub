import express from "express";
import {
    signup,
    login,
    getProfile,
    updateProfile,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
} from "../controller/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.get("/wishlist", verifyToken, getWishlist);
router.post("/wishlist/:bookId", verifyToken, addToWishlist);
router.delete("/wishlist/:bookId", verifyToken, removeFromWishlist);

export default router;