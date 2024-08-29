import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../Model/User.schema.js"; // Correct the import path

dotenv.config();

export const isAuth = async (req, res, next) => {
    try {//extracts the token from the req header
        const token = req.headers.token;
        if (!token) {
            return res.status(403).json({ message: "Please login" });
        }
        //if it is a token then it decodes and verigy the token using the secret key
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        //once it is verified it extracts the user id from the tokes PARAMS and retrive the user from the database
        req.user = await User.findById(decodedData._id);
        //then the user data is added to the req obj to get recieved by the routers
        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();//passes the control to the next router
    } catch (error) {
        res.status(500).json({ message: "Login first" });
    }
};


export const isAdmin=(req,res,next)=>{
    try {//checks if the user is the admin or not
        if(req.user.role!=="admin")
            return res.status(403).json({
        message:"You are not admin"})
        //if admin pasess the control to the route handler
        next()
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
        
    }
}
