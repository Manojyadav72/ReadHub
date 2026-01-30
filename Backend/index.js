import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import cors from "cors";  //midleware for handling CORS issues

import bookRoute from "./route/book.route.js"; 
import userRoute from "./route/user.route.js";


const app = express();
app.use(cors()); //using cors as middleware
app.use(express.json()); //middleware to parse json bodies

dotenv.config();
const PORT = process.env.PORT || 4000;
//connect to mongoDB

const URI = process.env.MongoDBURI;

mongoose.connect(process.env.MongoDBURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


  //Defining routes
app.use("/book", bookRoute);

app.use("/user", userRoute);


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})