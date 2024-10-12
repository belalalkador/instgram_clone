import express from "express";
import { verifyToken } from "../middlwaers/veryfiToken.js";
import {
  createComment,
  deleteComment,

} from "../controllers/commintController.js";

const commintRoute = express.Router();

commintRoute.post("/:postId", verifyToken, createComment);

commintRoute.delete("/:commentId", verifyToken, deleteComment);

export default commintRoute;
