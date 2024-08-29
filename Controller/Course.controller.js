import TryCatch from "../Middleware/TryCatch.js";
import { Courses } from "../Model/Courses.js";
import { Lecture } from "../Model/Lecture.js";
import { Payment } from "../Model/Payment.schema.js";
import Progress from "../Model/Progress.js";

import { User } from "../Model/User.schema.js";
import { instance } from "../index.js";
import crypto from "crypto"

import Quiz from "../Model/Quiz.schema.js";
import Quizprogress from "../Model/Quizprogress.js";
import Assignment from "../Model/Assignment.js";
import mongoose from "mongoose";


export const getAllCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find();
  res.json({
    courses,
  });
});

export const getSingleCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  res.json({
    course
  });
});

export const fetchLectures = TryCatch(async (req, res) => {
  const lectures = await Lecture.find({ course: req.params.id });

  const user = await User.findById(req.user._id);

  if (user.role === "admin") {
    return res.json({ lectures });
  }

  if (!user.subscription.includes(req.params.id))
    return res.status(400).json({
      message: "You have not subscribed to this course",
    });

  res.json({ lectures });
});

export const fetchaLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  const user = await User.findById(req.user._id);

  if (user.role === "admin") {
    return res.json({ lecture });
  }

  if (!user.subscription.includes(lecture.course))
    return res.status(400).json({
      message: "You have not subscribed to this course",
    });

  res.json({ lecture });
});


export const getMyCourses = TryCatch(async (req, res) => {
    const courses = await Courses.find({ _id: req.user.subscription });
  
    res.json({
      courses,
    });
  });


export const checkout = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  console.log(user)

  const course = await Courses.findById(req.params.id);
console.log(course)
  if (user.subscription.includes(course._id)) {
    return res.status(400).json({
      message: "You already have this course",
    });
  }

  const options = {
    amount: Number(course.price * 100),
    currency: "INR",
  };

  const order = await instance.orders.create(options);
  console.log(order)
//instance - obj that interacts with the razor pay that containd the id and the secret
//orders.creat- method provides by payment gateway- to create new order
//options- contain the amonunt and the currency
  res.status(201).json({
    order,
    course,
  });
});

export const paymentVerification = TryCatch(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;


  //
  const expectedSignature = crypto
    .createHmac("sha256", process.env.Razorpay_secret)
    //creates the "HMAC instance", using sha256- hashing algorithm ,secret key
    .update(body)//HMAC use this string to create a "unique signature"
    .digest("hex") //hexadecimal string that represent the hash data

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    const user = await User.findById(req.user._id);

    const course = await Courses.findById(req.params.id);

    user.subscription.push(course._id);

    await Progress.create({
      course: course._id,
      completedLectures: [],
      user: req.user._id,
    });

    await user.save();

    res.status(200).json({
      message: "Course Purchased Successfully",
    });
  } else {
    return res.status(400).json({
      message: "Payment Failed",
    });
  }
});

export const addProgress = TryCatch(async (req, res) => {
  // Fetch progress based on user ID and course ID
  const progress = await Progress.findOne({
    user: req.user._id,
    course: req.query.course,
  });

  // Extract lectureId from query parameters
  const { lectureId } = req.query;

  // Handle case where no progress document is found
  if (!progress) {
    return res.status(404).json({
      message: "No progress record found for the specified user and course",
    });
  }

  // Check if the lecture has already been completed
  if (progress.completedLectures.includes(lectureId)) {
    return res.json({
      message: "Progress already recorded for this lecture",
    });
  }

  // Add new completed lecture and save progress
  progress.completedLectures.push(lectureId);
  await progress.save();

  res.status(201).json({
    message: "New progress added successfully",
  });
}); 




export const submitQuiz = TryCatch(async (req, res) => {
  console.log("Submit Quiz Called");
  const { quizId } = req.params; // Get quiz ID from URL parameters
  console.log("Quiz ID:", quizId);

  const { responses } = req.body; // Get user responses from request body
  console.log("Responses:", responses);

  // Find the quiz by ID
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    console.log("Quiz not found");
    return res.status(404).json({ message: 'Quiz not found' });
  }
  
  console.log("Quiz found:", quiz);

  // Calculate the score
  let score = 0;
  quiz.questions.forEach(question => {
    if (responses[question._id] === question.answer) {
      score += 1; // Assuming 1 point per correct answer
    }
  });

  const userId = req.user._id; // Get user ID from request object
  console.log("User ID:", userId);
  const courseId = quiz.courseId; // Get course ID from the quiz

  // Check if quiz progress already exists for this user and quiz
  const existingProgress = await Quizprogress.findOne({ userId, quizId });
  if (existingProgress) {
    console.log("Existing progress found, updating...");
    existingProgress.responses = responses;
    existingProgress.score = score;
    await existingProgress.save();
  } else {
    console.log("No existing progress, creating new...");
    // Create new quiz progress record
    const newProgress = new Quizprogress({
      userId,
      courseId,
      quizId,
      responses,
      score
    });
    await newProgress.save();
  }

  // Respond with success message and score
  res.json({ message: 'Quiz submitted successfully', score });
});

export const getAllQuizzes = async (req, res) => {
  try {
    // Fetch all quizzes from the database
    const quizzes = await Quiz.find();
    
    // Respond with the list of quizzes
    res.status(200).json({
      message: 'Quizzes retrieved successfully',
      quizzes
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};
export const getQuizzesByCourseId = async (req, res) => {
  try {
    const { id } = req.params; // Get courseId from the request parameters

    // Find quizzes by courseId
    const quizzes = await Quiz.find({ courseId: id });

    if (quizzes.length === 0) {
      return res.status(404).json({ message: 'No quizzes found for this course' });
    }
    console.log("Quizzes found:", quizzes); // Log the quizzes
    // Respond with the list of quizzes
    res.status(200).json({
      message: 'Quizzes retrieved successfully',
      quizzes
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


export const getquizbyid= async (req, res) => {
  const { id } = req.params; // Get quiz ID from URL parameters

  try {
    // Find the quiz by ID and populate the course details if needed
    const quiz = await Quiz.findById(id).populate('courseId');

    // Check if the quiz exists
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Return the quiz details
    res.json({ quiz });
  } catch (error) {
    console.error('Error fetching quiz details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const quizresult=TryCatch(async (req, res) => {
  const { quizId } = req.params;
  const userId = req.user._id; // Assuming user ID is available in req.user

  // Find the quiz progress for the user
  const quizProgress = await Quizprogress.findOne({ userId, quizId }).populate('quizId').populate('courseId');
  
  if (!quizProgress) {
    return res.status(404).json({ message: 'Result not found' });
  }

  // Respond with the quiz result
  res.json({
    message: 'Result retrieved successfully',
    score: quizProgress.score,
    responses: quizProgress.responses,
    courseTitle: quizProgress.courseId.title,
    quizTitle: quizProgress.quizId.title,
  });
})



//assignment
export const getassbycourseid=TryCatch(

  async(req,res)=>{
    const{id}=req.params
    const assignments = await Assignment.find({ courseId: id });
    res.status(200).json(assignments);
  }
)

export const sumbitassignment=TryCatch(async(req,res)=>{
  const { link, comment } = req.body;
  const { courseId, assignmentId } = req.params;
  

 
  const assignment = await Assignment.findOne({ courseId, _id: assignmentId });
  if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found or you are not authorized to submit this assignment.' });
  }

  // Update the assignment with the submission details
  assignment.link = link || assignment.link; // Update if provided
  assignment.comment = comment || assignment.comment; // Update if provided
  assignment.submitted = true; // Mark as submitted

  await assignment.save();
  res.status(200).json({ message: 'Assignment submitted successfully!' });}

)













export const getYourProgress = async (req, res) => {
  console.log("Handler invoked");

  try {
    // Log request parameters and user ID
    console.log("Request params:", req.params);
    console.log("Request user ID:", req.user ? req.user._id : 'No user info');

    // Access course ID from URL parameters
    const courseId = req.params.courseId;
    console.log("Course ID from params:", courseId);

    // Validate courseId
    if (!(courseId)) {
      console.log("Invalid course ID");
      return res.status(400).json({ message: "Invalid course ID" });
    }

  
    const progress = await Progress.findOne({
      user: req.user._id,
      course:courseId, // Correctly use ObjectId
    });
    console.log("Progress found:", progress);

    if (!progress) {
      console.log("No progress found for this course.");
      return res.status(404).json({ message: "No progress found for this course." });
    }

    const allLectures = await Lecture.countDocuments({ course: (courseId) });

    if (allLectures === 0) {
      console.log("No lectures found for this course.");
      return res.status(404).json({ message: "No lectures found for this course." });
    }

    const completedLectures = progress.completedLectures.length;
    const courseProgressPercentage = (completedLectures * 100) / allLectures;

    console.log("All Lectures:", allLectures);
    console.log("Completed Lectures:", completedLectures);
    console.log("Course Progress Percentage:", courseProgressPercentage);
    console.log(progress)

    res.json({
      courseProgressPercentage,
      completedLectures,
      allLectures,
      progress,
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ message: "An error occurred while fetching progress." });
  }
};
