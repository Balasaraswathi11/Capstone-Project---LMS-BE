import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
    course: {  // Changed from 'courses' to 'course' for clarity
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
    },
    completedLectures: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lecture'
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    } 
}, { timestamps: true }); // Fixed typo 'timestams' to 'timestamps'

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;
