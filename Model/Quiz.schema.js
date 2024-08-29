import mongoose from "mongoose";


const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Courses', required: true },
  questions: [
    {
      question: { type: String, required: true },
      option1: { type: String, required: true },
            option2: { type: String, required: true },
      option3: { type: String, required: true },
      option4: { type: String, required: true },
      answer: { type: String, required: true },
      title: { type: String, required: true },
      mcq: { type: Boolean, default: false },
    }
  ]
}, { timestamps: true });
const Quiz = mongoose.model('Quiz', QuizSchema); //quiz is model name
export default Quiz