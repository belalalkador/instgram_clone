import express from "express";
import {
  signup,
  signin,
  checkUserController,
  getUserImage,
  signout,
  getSuggestUser,
  getProfile,
  editProfile,
  deleteUser,
  refreshToken,
  bookmarks,
  getBookmarks,
  followProcess,
  getNotifictionsForUser,
  deleteNotification,
  markNotificationRead,
 
  
} from "../controllers/authController.js";
import { upload } from "../middlwaers/multer.js";
import { verifyToken } from "../middlwaers/veryfiToken.js";

const authRoute = express.Router();

authRoute.post("/signup", upload.single("userImage"), signup);

authRoute.post("/signin", signin);

authRoute.get("/check-user", verifyToken, checkUserController);

authRoute.get("/profile/:id", verifyToken, getProfile);

authRoute.put("/profile/:userId",verifyToken,upload.single("userImage") , editProfile);

authRoute.delete("/profile/:userId", verifyToken, deleteUser);

authRoute.get("/image/:userId", verifyToken, getUserImage);

authRoute.get("/signout", verifyToken, signout);

authRoute.get("/suggest-users", verifyToken, getSuggestUser);

authRoute.get("/bookmarks/:userId", verifyToken, getBookmarks);

authRoute.get("/bookmarks/:userId/:postId", verifyToken, bookmarks);

authRoute.post('/follow-process',verifyToken,followProcess)

authRoute.get("/notifictions", verifyToken, getNotifictionsForUser);

authRoute.delete("/notifiction/:notificationId", verifyToken, deleteNotification);

authRoute.put("/notifiction/:notificationId", verifyToken, markNotificationRead);

authRoute.get("/refresh-token", verifyToken, refreshToken);

export default authRoute;
