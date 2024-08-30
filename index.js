import express from "express";
import cors from "cors";
import http from "http";

import connectDb from "./Database/Dbconfig.js";
import userrouter from "./Routes/User.router.js";
import adminrouter from "./Routes/admin.router.js";
import courserouter from "./Routes/Course.router.js";
import userchat from "./Routes/Message.router.js";
import dotenv from "dotenv";
import Razorpay from "razorpay";


dotenv.config();

// Set up Razorpay instance
export const instance = new Razorpay({
    key_id: process.env.Razorpay_key,
    key_secret: process.env.Razorpay_secret
});

// Initialize Express app
const app = express();
app.use(cors({
    origin: process.env.frontendurl, 
    credentials: true
}));
app.use(express.json());

// Set up a basic route to confirm the app is working
app.get("/", (req, res) => { 
    res.status(200).json({ message: "App is working" });
});

// Serve static files
app.use("/uploads", express.static("uploads"));

// Connect to database
connectDb();

// Set up routes
app.use("/api/user", userrouter);
app.use("/api/course", courserouter);
app.use("/api/admin", adminrouter);
app.use("/api/chats", userchat);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

