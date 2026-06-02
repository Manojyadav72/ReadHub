import express from "express";
import {
    getBooks,
    getBookById,
    getTrendingBooks,
    getRecentBooks,
    getBooksByCategory,
    createBook,
    updateBook,
    deleteBook,
    rateBook,
} from "../controller/book.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";
import { uploadBookFiles } from "../middleware/upload.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getBooks);
router.get("/trending", getTrendingBooks);
router.get("/recent", getRecentBooks);
router.get("/category/:category", getBooksByCategory);
router.get("/:id", getBookById);

// Protected routes
router.post("/:id/rate", verifyToken, rateBook);

// Admin routes
router.post("/", verifyToken, isAdmin, uploadBookFiles, createBook);
router.put("/:id", verifyToken, isAdmin, uploadBookFiles, updateBook);
router.delete("/:id", verifyToken, isAdmin, deleteBook);

export default router;