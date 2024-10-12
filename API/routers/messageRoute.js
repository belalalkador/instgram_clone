import express from "express";
import { verifyToken } from "../middlwaers/veryfiToken.js";
import { createNewMessage, deleteAllMessagesForTwoUsers, getAllMessagesForTwoUsers } from "../controllers/messageController.js";

const messageRouter= express.Router()
messageRouter.post('/:targetUserId',verifyToken,createNewMessage)

messageRouter.get('/:targetUserId',verifyToken,getAllMessagesForTwoUsers)

messageRouter.delete('/:targetUserId',verifyToken,deleteAllMessagesForTwoUsers)


export default  messageRouter