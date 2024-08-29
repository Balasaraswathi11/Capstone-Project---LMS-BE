import TryCatch from "../Middleware/TryCatch.js";
import { Courses } from "../Model/Courses.js";
import { Lecture } from "../Model/Lecture.js";
import { User } from "../Model/User.schema.js";
import { rm, unlink } from "fs";
import { promisify } from "util";

import Quiz from "../Model/Quiz.schema.js";
import Assignment from "../Model/Assignment.js";

const unlinkAsync = promisify(unlink);

export const createCourse = TryCatch(async (req, res) => {
    const { title, description, category, createdBy, duration, price } = req.body;
    const image = req.file;

    let courses=await Courses.create({
        title,
        description,
        category,
        createdBy,
        image: image?.path,
        duration,
        price,
    });

    res.status(201).json({
        message: "Course created successfully",courses
    });
});

export const addLectures = TryCatch(async (req, res) => {
    const course = await Courses.findById(req.params.id);

    if (!course) {
        return res.status(404).json({
            message: "No Course with this ID",
        });
    }

    const { title, description } = req.body;
    const file = req.file;

    const lecture = await Lecture.create({
        title,
        description,
        video: file?.path,
        course: course._id,
    });

    res.status(201).json({
        message: "Lecture Added",
        lecture,
    });
});

export const deleteLecture = TryCatch(async (req, res) => {
    const lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
        return res.status(404).json({
            message: "Lecture not found",
        });
    }

    await unlinkAsync(lecture.video).catch(() => console.log("Video deletion failed"));

    await lecture.deleteOne();

    res.json({ message: "Lecture Deleted" });
});

export const deleteCourse = TryCatch(async (req, res) => {
    const course = await Courses.findById(req.params.id);

    if (!course) {
        return res.status(404).json({
            message: "Course not found",
        });
    }

    const lectures = await Lecture.find({ course: course._id });

    await Promise.all(
        lectures.map(async (lecture) => {
            await unlinkAsync(lecture.video).catch(() => console.log("Video deletion failed"));
        })
    );

    await unlinkAsync(course.image).catch(() => console.log("Image deletion failed"));

    await Lecture.deleteMany({ course: req.params.id });

    await course.deleteOne();

    await User.updateMany({}, { $pull: { subscription: req.params.id } });

    res.json({
        message: "Course Deleted",
    });
});

export const getAllStats = TryCatch(async (req, res) => {
    const totalCourses = await Courses.countDocuments();
    const totalLectures = await Lecture.countDocuments();
    const totalUsers = await User.countDocuments();

    const stats = {
        totalCourses,
        totalLectures,
        totalUsers,
    };

    res.json({
        stats,
    });
});

export const getAllUser = TryCatch(async (req, res) => {
    const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");

    res.json({ users });
});

export const updateRole = TryCatch(async (req, res) => {
    if (req.user.mainrole !== "superadmin") {
        return res.status(403).json({
            message: "This endpoint is assigned to superadmin",
        });
    }
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    if (user.role === "user") {
        user.role = "admin";
        await user.save();

        return res.status(200).json({
            message: "Role updated to admin",
        });
    }

    if (user.role === "admin") {
        user.role = "user";
        await user.save();

        return res.status(200).json({
            message: "Role updated to user",
        });
    }

    res.status(400).json({
        message: "Invalid role change",
    });
});
//quiz controller



export const createQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, questions } = req.body;

        console.log('Course ID:', id);
        console.log('Title:', title);
        console.log('Questions:', questions);

        const course = await Courses.findById(id);
        if (!course) {
            console.log('Course not found');
            return res.status(404).json({ message: "Course not found" });
        }

        const quiz = await Quiz.create({
            courseId: id,
            title,
            questions,
            user: req.user._id,
        });

        console.log('Quiz created:', quiz);

        res.status(201).json({
            message: "Quiz created successfully",
            quiz,
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

export const deletequiz=TryCatch(
    async(req,res)=>{
        const { quizId } = req.params; // Destructure the quizId from req.params
        const quiz = await Quiz.findByIdAndDelete(quizId); // Find and delete the quiz by its ID
    
        if (!quiz) {
          return res.status(404).json({ message: 'Quiz not found' });
        }
    
        res.status(200).json({ message: 'Quiz deleted successfully' });}
  )

//for assignments
export const createAssignment=TryCatch(async(req,res)=>{
    const { id } = req.params; // Get the course ID from the URL
    const { title, description, dueDate } = req.body; // Get assignment details from the request body

    // Validate input
    if (!title || !description || !dueDate) {
        return res.status(400).json({ message: "All fields are required: title, description, and dueDate" });
    }

    // Check if the course exists
    const course = await Courses.findById(id);
    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    // Create the assignment
  const assignment = await Assignment.create({
        courseId: id,
        title,
        description,
        dueDate,
        user: req.user._id, // Assuming the user ID is passed from isAuth middleware
    });

    res.status(201).json({
        message: "Assignment created successfully",
        assignment,
    });}
  )

  export const deleteassign=TryCatch(async(req,res)=>{
    const { courseId, assignmentId } = req.params;
        const assignment = await Assignment.findById(assignmentId);
        
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        if(!courseId)
{
    return res.status(404).json({message:"course not found"})
}
await Assignment.deleteOne({ _id: assignmentId });
        res.status(200).json({ message: 'Assignment deleted successfully' });}
  )