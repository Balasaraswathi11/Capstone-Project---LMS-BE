import mongoose from "mongoose";

const courseschema= new mongoose.Schema({
title:{
    type:String,
    required:true
},
description:{
    type:String,
    required:true
},
image:{
    type:String,
    required:true
},
price:{
    type:Number,
    required:true
},
duration:{
    type:Number,
    required:true
},
category:{
    type:String,
    required:true
},
createdBy:{
    type:String,
    required:true
},
createdAt:{
    type:Date,
    default:Date.now,
    required:true
},
quiz: { // Reference to the Quiz schema
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz"
  },
  assignments: [{ // Add this field
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment'
}]

})
export const Courses=mongoose.model("Courses",courseschema)
// const Course= new mongoose.Schema("course",courseschema)