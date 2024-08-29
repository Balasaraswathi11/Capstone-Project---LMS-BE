
import mongoose from "mongoose";

const Quizschema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Courses', required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    responses: { type: Map, of: String }, // Store responses as a map of question IDs to selected options
    score: { type: Number, default: 0 }
});

const  Quizprogress= mongoose.model('UserQuizProgress', Quizschema);
export default Quizprogress
