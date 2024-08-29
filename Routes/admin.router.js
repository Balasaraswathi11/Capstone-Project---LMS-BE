import express from "express";
import { addLectures, createAssignment, createCourse, createQuiz, deleteassign, deleteCourse, deleteLecture, deletequiz, getAllStats, getAllUser, updateRole } from "../Controller/admin.controller.js";
import { isAuth } from "../Middleware/isAuth.js";
import { isAdmin } from "../Middleware/isAuth.js";
import { uploadFiles } from './../Middleware/multer.js';
const router=express.Router();


router.post("/course/new",isAuth,isAdmin,uploadFiles,createCourse)
router.post("/course/:id",isAuth,isAdmin,uploadFiles,addLectures)
router.delete("/lecture/:id",isAuth,isAdmin,deleteLecture)
router.delete("/delcourse/:id",isAuth,isAdmin,deleteCourse)
router.get("/getallstats",isAuth,isAdmin,getAllStats)
router.put("/user/:id",isAuth,isAdmin,updateRole)
router.get("/users",isAuth,isAdmin,getAllUser)
router.post("/course/:id/quiz",isAuth,isAdmin,createQuiz)
router.post("/course/:id/assignment",isAuth,isAdmin,createAssignment)
router.delete("/course/:courseId/assignment/:assignmentId/delete",isAuth,isAdmin,deleteassign)
router.delete("/delete/quiz/:quizId",isAuth,isAdmin,deletequiz)
export default router