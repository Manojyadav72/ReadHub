import e from "express";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
export const signup = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        const user = await  User.findOne({email});
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const createUser = new User({
            fullname: fullname,
            email: email,
            password: hashedPassword,
        });
 
        await createUser.save();
        res.status(201).json({ message: "User created successfully",
            user: {
                fullname: createUser.fullname,
                email: createUser.email,
                _id: createUser._id
            }
         }); 
         
    } catch (error) {
        console.log("Error : "+error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    // Login logic to be implemented

    try{
        const { email, password } = req.body;
        const user = await User.findOne({email});
        const isMatch = await bcrypt.compare(password, user.password);
        if(!user || !isMatch){
            return res.status(400).json({ message: "Invalid credentials" });
        }else{
            res.status(200).json({ message: "Login successful", user:{
                fullname: user.fullname,
                email: user.email,
                _id: user._id
            }});
        }
        

    }catch(error){
        console.log("Error : "+error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
