import express from "express";
import { verifyToken } from "../middlwaers/veryfiToken.js";
import {
  acceptFriendRequest,
  deleteFriend,
  getFriendRequest,
  getUserFriend,
  rejectFriendRequest,
  sendFriendRequest,
} from "../controllers/freindController.js";

const freindRouter = express.Router();
freindRouter.post("/add", verifyToken, sendFriendRequest);

freindRouter.post("/accept", verifyToken, acceptFriendRequest);

freindRouter.post("/reject", verifyToken, rejectFriendRequest);

freindRouter.get("/friend-requests", verifyToken, getFriendRequest);

freindRouter.get("/get-friends", verifyToken, getUserFriend);

freindRouter.post("/unfriend", verifyToken, deleteFriend);


export default freindRouter;
