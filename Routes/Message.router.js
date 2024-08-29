import express from "express";
import { addMessage, createChat, emailtest, getChatParticipants, getChatsForUser, getMessage, replyToMessage, sendMessage } from "../Controller/Chat.controller.js";
import { isAdmin, isAuth } from './../Middleware/isAuth.js';

const router=express.Router()
router.post("/createchat",isAuth,createChat)

router.get('/getchat/:userId',isAuth,getChatsForUser)
// router.get("/:userId",isAuth,getMessages)
router.post("/test-email",isAuth,emailtest)
router.post("/user/:chatId/addmessages",isAuth,addMessage)
router.post("/send-message",isAuth,sendMessage)
router.get("/messages/:userId/:recipientId",isAuth,getMessage)
router.post('/reply-message', isAuth, replyToMessage);
router.get("/participants",isAuth,isAdmin,getChatParticipants)
export default router     