import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./model/user.model.js";

dotenv.config();

const resetAdminPassword = async () => {
    try {
        await mongoose.connect(process.env.MongoDBURI);
        console.log("Connected to MongoDB");

        const adminEmail = "admin@readhub.com";
        const adminPassword = "adminpassword123";

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            console.log("Admin user not found. Creating...");
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            const adminUser = new User({
                fullname: "System Admin",
                email: adminEmail,
                password: hashedPassword,
                role: "admin",
            });
            await adminUser.save();
            console.log("Admin created successfully!");
        } else {
            console.log("Admin found. Updating password to adminpassword123...");
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            existingAdmin.password = hashedPassword;
            existingAdmin.role = "admin"; // Ensure role is still admin
            await existingAdmin.save();
            console.log("Admin password updated successfully!");
        }
    } catch (error) {
        console.error("Error updating admin:", error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

resetAdminPassword();
