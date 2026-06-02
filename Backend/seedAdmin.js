import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./model/user.model.js";

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MongoDBURI);
        console.log("Connected to MongoDB");

        const adminEmail = "admin@readhub.com";
        const adminPassword = "adminpassword123";

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log(`Admin user already exists with email: ${adminEmail}`);
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const adminUser = new User({
            fullname: "System Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "admin",
        });

        await adminUser.save();
        console.log(`Admin created successfully!`);
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        
    } catch (error) {
        console.error("Error creating admin:", error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

createAdmin();
