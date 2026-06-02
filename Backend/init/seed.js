import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../model/user.model.js";
import Category from "../model/category.model.js";
import Book from "../model/book.model.js";

dotenv.config();

const categories = [
    { name: "Programming", description: "Books about programming languages and software development" },
    { name: "Novels", description: "Fiction and literary novels" },
    { name: "Science", description: "Books about scientific discoveries and research" },
    { name: "History", description: "Historical books and accounts" },
    { name: "Technology", description: "Books about modern technology and innovation" },
    { name: "Education", description: "Educational and academic textbooks" },
    { name: "Comics", description: "Comic books and graphic novels" },
    { name: "Competitive Exams", description: "Books for competitive exam preparation" },
];

const sampleBooks = [
    {
        name: "JavaScript: The Good Parts",
        author: "Douglas Crockford",
        description: "Most programming languages contain good and bad parts, but JavaScript has more than its share of the bad, having been developed and released in a hurry before it could be refined. This authoritative book scrapes away these bad features to reveal a subset of JavaScript that's more reliable, readable, and maintainable.",
        price: 0,
        category: "Programming",
        image: "https://m.media-amazon.com/images/I/7186YfjgHHL._AC_UF1000,1000_QL80_.jpg",
        rating: 4.5,
        totalRatings: 120,
        ratingSum: 540,
        isTrending: true,
        isFree: true,
    },
    {
        name: "Clean Code",
        author: "Robert C. Martin",
        description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. This book is a must for any developer, software engineer, project manager, team lead, or systems analyst with an interest in producing better code.",
        price: 499,
        category: "Programming",
        image: "https://m.media-amazon.com/images/I/71T7aD3EELL._AC_UF1000,1000_QL80_.jpg",
        rating: 4.7,
        totalRatings: 200,
        ratingSum: 940,
        isTrending: true,
        isFree: false,
    },
    {
        name: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        description: "The story primarily concerns the young and mysterious millionaire Jay Gatsby and his quixotic passion and obsession for the beautiful former debutante Daisy Buchanan. A masterpiece of American fiction.",
        price: 199,
        category: "Novels",
        image: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg",
        rating: 4.3,
        totalRatings: 150,
        ratingSum: 645,
        isTrending: true,
        isFree: false,
    },
    {
        name: "A Brief History of Time",
        author: "Stephen Hawking",
        description: "A landmark volume in science writing by one of the great minds of our time, Stephen Hawking's book explores such profound questions as: How did the universe begin—and what made its start possible?",
        price: 350,
        category: "Science",
        image: "https://m.media-amazon.com/images/I/A1xkFZX5k-L._AC_UF1000,1000_QL80_.jpg",
        rating: 4.6,
        totalRatings: 180,
        ratingSum: 828,
        isTrending: true,
        isFree: false,
    },
    {
        name: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        description: "From a renowned historian comes a groundbreaking narrative of humanity's creation and evolution that explores the ways in which biology and history have defined us.",
        price: 450,
        category: "History",
        image: "https://m.media-amazon.com/images/I/713jIoMO3UL._AC_UF1000,1000_QL80_.jpg",
        rating: 4.5,
        totalRatings: 220,
        ratingSum: 990,
        isTrending: true,
        isFree: false,
    },
    {
        name: "The Innovators",
        author: "Walter Isaacson",
        description: "The Innovators is a masterly saga of collaborative genius destined to be the standard history of the digital revolution—and an indispensable guide to how innovation really happens.",
        price: 0,
        category: "Technology",
        image: "https://m.media-amazon.com/images/I/71GKFXM7zQL._AC_UF1000,1000_QL80_.jpg",
        rating: 4.2,
        totalRatings: 90,
        ratingSum: 378,
        isTrending: false,
        isFree: true,
    },
    {
        name: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        description: "Some books on algorithms are rigorous but incomplete; others cover masses of material but lack rigor. Introduction to Algorithms uniquely combines rigor and comprehensiveness.",
        price: 799,
        category: "Education",
        image: "https://m.media-amazon.com/images/I/61ZXsRMiURLSL._AC_UF1000,1000_QL80_.jpg",
        rating: 4.4,
        totalRatings: 100,
        ratingSum: 440,
        isTrending: false,
        isFree: false,
    },
    {
        name: "Maus",
        author: "Art Spiegelman",
        description: "A brutally moving work of art—widely hailed as the greatest graphic novel ever written—Maus recounts the chilling experiences of the author's father during the Holocaust.",
        price: 299,
        category: "Comics",
        image: "https://m.media-amazon.com/images/I/71sAuVsm-gL._AC_UF1000,1000_QL80_.jpg",
        rating: 4.8,
        totalRatings: 75,
        ratingSum: 360,
        isTrending: true,
        isFree: false,
    },
    {
        name: "Quantitative Aptitude",
        author: "R.S. Aggarwal",
        description: "A comprehensive guide to quantitative aptitude for competitive examinations. Covers arithmetic, algebra, geometry, and data interpretation with thousands of practice problems.",
        price: 0,
        category: "Competitive Exams",
        image: "https://m.media-amazon.com/images/I/81VM3RqURTL._AC_UF1000,1000_QL80_.jpg",
        rating: 4.1,
        totalRatings: 300,
        ratingSum: 1230,
        isTrending: false,
        isFree: true,
    },
    {
        name: "Python Crash Course",
        author: "Eric Matthes",
        description: "A hands-on, project-based introduction to programming. This fast-paced introduction to Python will have you writing programs, solving problems, and making things that work in no time.",
        price: 0,
        category: "Programming",
        image: "https://m.media-amazon.com/images/I/71sL0Qpd+yL._AC_UF1000,1000_QL80_.jpg",
        rating: 4.6,
        totalRatings: 160,
        ratingSum: 736,
        isTrending: false,
        isFree: true,
    },
    {
        name: "1984",
        author: "George Orwell",
        description: "Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its dystopian purgatory becomes more real.",
        price: 179,
        category: "Novels",
        image: "https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg",
        rating: 4.7,
        totalRatings: 250,
        ratingSum: 1175,
        isTrending: true,
        isFree: false,
    },
    {
        name: "The Selfish Gene",
        author: "Richard Dawkins",
        description: "Dawkins' brilliant reformulation of the theory of natural selection has the rare distinction of having provoked as much excitement and interest outside the scientific community as within it.",
        price: 399,
        category: "Science",
        image: "https://m.media-amazon.com/images/I/71-4Dxs1AzL._AC_UF1000,1000_QL80_.jpg",
        rating: 4.3,
        totalRatings: 110,
        ratingSum: 473,
        isTrending: false,
        isFree: false,
    },
];

async function seed() {
    try {
        await mongoose.connect(process.env.MongoDBURI);
        console.log("Connected to MongoDB");

        // Seed admin user
        const existingAdmin = await User.findOne({ email: "admin@readhub.com" });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await User.create({
                fullname: "Admin",
                email: "admin@readhub.com",
                password: hashedPassword,
                role: "admin",
            });
            console.log("Admin user created (admin@readhub.com / admin123)");
        } else {
            console.log("Admin user already exists");
        }

        // Seed categories
        for (const cat of categories) {
            const existing = await Category.findOne({ name: cat.name });
            if (!existing) {
                await Category.create(cat);
                console.log(`Category created: ${cat.name}`);
            }
        }

        // Seed sample books
        const bookCount = await Book.countDocuments();
        if (bookCount === 0) {
            await Book.insertMany(sampleBooks);
            console.log(`${sampleBooks.length} sample books created`);
        } else {
            console.log(`Books already exist (${bookCount} found), skipping book seed`);
        }

        console.log("Seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
}

seed();
