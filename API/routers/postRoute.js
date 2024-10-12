import express from "express";
import { verifyToken } from "../middlwaers/veryfiToken.js";
import {
  createNewPost,
  deletePost,
  editPost,
  getAllPosts,
  getSinglePostById,
  getUserPosts,
  search,
} from "../controllers/postController.js";
import { upload } from "../middlwaers/multer.js";
import { like } from "../controllers/likeController.js";

const postRoute = express.Router();

postRoute.post(
  "/create/:userid",
  verifyToken,
  upload.single("postImage"),
  createNewPost
);
postRoute.put(
  "/edit/:postId/:userId",
  verifyToken,
  upload.single("postImage"),
  editPost
);

postRoute.get("/all", verifyToken, getAllPosts);

postRoute.get("/user/:userId", verifyToken, getUserPosts);
postRoute.get("/single/:postId", verifyToken, getSinglePostById);

postRoute.post("/like", verifyToken, like);

postRoute.get("/search", verifyToken, search);

postRoute.delete("/:postId/:userId", verifyToken, deletePost);

export default postRoute;
