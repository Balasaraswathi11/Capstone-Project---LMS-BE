import mongoose from "mongoose";

const userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"user"
    },
    mainrole:{
        type:String,
        default:"user"
    },
    otp: { type: String,
           required: false },

    subscription:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Courses"

    }],
    resetPasswordExpire:Date,
    

   
}, {timestamps:true}
)
export const User= mongoose.model("User",userschema)