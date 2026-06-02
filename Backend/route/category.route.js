import express from "express";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../controller/category.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public
router.get("/", getCategories);

// Admin only
router.post("/", verifyToken, isAdmin, createCategory);
router.put("/:id", verifyToken, isAdmin, updateCategory);
router.delete("/:id", verifyToken, isAdmin, deleteCategory);

export default router;
