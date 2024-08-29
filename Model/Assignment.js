import mongoose, { Schema } from "mongoose";

const assignmentSchema = new mongoose.Schema({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    title: {
        type: String,
       
        trim: true
    },
    description: {
        type: String,
      
        trim: true
    },
    dueDate: {
        type: Date,
      
    },
    
    link: {
        type: String,
        trim: true 
    }, 
    submitted: {
        type: Boolean,
        default: false},
    comment: {
        type: String,
        trim: true 
    },
   
},{timestamps:true});

const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment
