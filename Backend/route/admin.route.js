import express from "express";
import {
    getDashboardStats,
    getAllUsers,
    deleteUser,
    toggleUserRole,
} from "../controller/admin.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// All admin routes require auth + admin role
router.use(verifyToken, isAdmin);

router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/role", toggleUserRole);

export default router;
