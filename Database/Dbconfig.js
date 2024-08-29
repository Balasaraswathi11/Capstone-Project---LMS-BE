import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

const connectDb=async()=>{
  

    try {
        const connection=await mongoose.connect(process.env.mongoDBconnectionString)
        console.log("mongodb connected")
        return connection
    } catch (error) {
        console.log(error)
    }
}
export default connectDb 