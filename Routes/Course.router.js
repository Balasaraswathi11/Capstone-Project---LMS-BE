import express from "express";
import { checkout, fetchaLecture, fetchLectures, getAllCourses, getAllQuizzes, getassbycourseid, getMyCourses, getquizbyid, getQuizzesByCourseId, getSingleCourse, paymentVerification, quizresult, submitQuiz, sumbitassignment,  } from "../Controller/Course.controller.js";
import { isAuth } from './../Middleware/isAuth.js';
const router=express.Router();


router.get("/all",getAllCourses)
router.get("/mycourse",isAuth,getMyCourses)
router.get("/:id",getSingleCourse)
router.get("/fetchlectures/:id",isAuth,fetchLectures)
router.get("/fetchalecture/:id",isAuth,fetchaLecture)
router.post("/checkout/:id",isAuth,checkout)
router.post("/verification/:id",isAuth,paymentVerification)

router.get('/quizzes',isAuth, getAllQuizzes);
router.get('/quizzes/:id',isAuth, getQuizzesByCourseId);
router.post("/quiz/:quizId/submit",isAuth,submitQuiz)
router.get("/quiz/:id",getquizbyid)
router.get("/quiz/:quizId/result",isAuth,quizresult)
router.get("/:id/assignments",isAuth,getassbycourseid)
router.post("/:courseId/assignment/:assignmentId/submit",isAuth,sumbitassignment)
export default router
