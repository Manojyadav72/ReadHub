import Book from "../model/book.model.js";

// GET all books with search, filter, pagination, sort
export const getBooks = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, sort, page = 1, limit = 12, isFree, isTrending } = req.query;

        let query = {};

        // Search by name, author, or description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { author: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Filter by free
        if (isFree === "true") {
            query.isFree = true;
        }

        // Filter by trending
        if (isTrending === "true") {
            query.isTrending = true;
        }

        // Sort options
        let sortOption = { createdAt: -1 }; // default: newest first
        if (sort === "price_asc") sortOption = { price: 1 };
        else if (sort === "price_desc") sortOption = { price: -1 };
        else if (sort === "rating") sortOption = { rating: -1 };
        else if (sort === "name") sortOption = { name: 1 };

        const skip = (Number(page) - 1) * Number(limit);

        const [books, total] = await Promise.all([
            Book.find(query).sort(sortOption).skip(skip).limit(Number(limit)),
            Book.countDocuments(query),
        ]);

        res.status(200).json({
            books,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET single book by ID
export const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET trending books
export const getTrendingBooks = async (req, res) => {
    try {
        const books = await Book.find({ isTrending: true }).sort({ rating: -1 }).limit(10);
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET recently added books
export const getRecentBooks = async (req, res) => {
    try {
        const books = await Book.find({}).sort({ createdAt: -1 }).limit(8);
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET books by category
export const getBooksByCategory = async (req, res) => {
    try {
        const books = await Book.find({ category: req.params.category }).sort({ createdAt: -1 });
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CREATE book (admin only)
export const createBook = async (req, res) => {
    try {
        const { name, author, description, price, category, rating, isTrending, isFree } = req.body;

        const bookData = {
            name,
            author,
            description,
            price: Number(price) || 0,
            category,
            rating: Number(rating) || 0,
            isTrending: isTrending === "true" || isTrending === true,
            isFree: isFree === "true" || isFree === true || Number(price) === 0,
        };

        // Handle file uploads
        if (req.files) {
            if (req.files.image && req.files.image[0]) {
                bookData.image = `/uploads/images/${req.files.image[0].filename}`;
            }
            if (req.files.pdf && req.files.pdf[0]) {
                bookData.pdf = `/uploads/pdfs/${req.files.pdf[0].filename}`;
            }
        }

        // Handle image URL (if no file uploaded but URL provided)
        if (!bookData.image && req.body.image) {
            bookData.image = req.body.image;
        }

        const book = new Book(bookData);
        await book.save();
        res.status(201).json({ message: "Book created successfully", book });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE book (admin only)
export const updateBook = async (req, res) => {
    try {
        const { name, author, description, price, category, rating, isTrending, isFree } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (author) updateData.author = author;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) updateData.price = Number(price);
        if (category) updateData.category = category;
        if (rating !== undefined) updateData.rating = Number(rating);
        if (isTrending !== undefined) updateData.isTrending = isTrending === "true" || isTrending === true;
        if (isFree !== undefined) updateData.isFree = isFree === "true" || isFree === true;

        // Handle file uploads
        if (req.files) {
            if (req.files.image && req.files.image[0]) {
                updateData.image = `/uploads/images/${req.files.image[0].filename}`;
            }
            if (req.files.pdf && req.files.pdf[0]) {
                updateData.pdf = `/uploads/pdfs/${req.files.pdf[0].filename}`;
            }
        }

        // Handle image URL
        if (!updateData.image && req.body.image) {
            updateData.image = req.body.image;
        }

        const book = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book updated successfully", book });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE book (admin only)
export const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// RATE a book
export const rateBook = async (req, res) => {
    try {
        const { rating } = req.body;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        book.ratingSum += Number(rating);
        book.totalRatings += 1;
        book.rating = Math.round((book.ratingSum / book.totalRatings) * 10) / 10;
        await book.save();

        res.status(200).json({ message: "Rating submitted", rating: book.rating, totalRatings: book.totalRatings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};