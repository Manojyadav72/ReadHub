import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import bookRoute from "./route/book.route.js";
import userRoute from "./route/user.route.js";
import categoryRoute from "./route/category.route.js";
import adminRoute from "./route/admin.route.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files as static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 4000;

// Connect to MongoDB
mongoose
    .connect(process.env.MongoDBURI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

// API Routes
app.use("/book", bookRoute);
app.use("/user", userRoute);
app.use("/category", categoryRoute);
app.use("/admin", adminRoute);

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "ReadHub API is running" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!", error: err.message });
});
app.get("/", (req, res) => {
  res.json({
    message: "ReadHub Backend is Running 🚀"
  });
});
app.listen(PORT, () => {
    console.log(`ReadHub API listening on port ${PORT}`);
});