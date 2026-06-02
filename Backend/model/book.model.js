import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        category: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: "",
        },
        pdf: {
            type: String,
            default: "",
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        totalRatings: {
            type: Number,
            default: 0,
        },
        ratingSum: {
            type: Number,
            default: 0,
        },
        isTrending: {
            type: Boolean,
            default: false,
        },
        isFree: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Text index for search functionality
bookSchema.index({ name: "text", author: "text", description: "text" });

const Book = mongoose.model("Book", bookSchema);

export default Book;
