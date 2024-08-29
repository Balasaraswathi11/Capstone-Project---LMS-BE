
import express from "express";
import { fetchadmin, fetchuser, forgotpassword, getUserById, loginUser, myProfile, Register, resetPassword, VerifyOtp } from "../Controller/User.controller.js";
import { isAdmin, isAuth } from "../Middleware/isAuth.js";
import { addProgress, getYourProgress } from "../Controller/Course.controller.js";
const router=express.Router()
router.post("/register",Register)
router.post("/verify",VerifyOtp)
router.post("/login", loginUser)
router.get("/me", isAuth,myProfile)
router.post("/progress",isAuth,addProgress)
router.post("/forget",forgotpassword)
router.post("/reset/:token",resetPassword)
router.get("/:id",getUserById)
router.get("/getprogress/:courseId",isAuth,getYourProgress)
router.get("/getAdminId",isAuth,isAdmin,fetchadmin)
router.get("/getUserId",isAuth,fetchuser)
export default router