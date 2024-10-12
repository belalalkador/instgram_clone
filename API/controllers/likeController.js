import Notification from "../Models/notification.js";
import Post from "../Models/post.js";
import User from "../Models/userModels.js";
import { io, getSocketId } from "../socket/socket.js";

export const like = async (req, res) => {
  try {
    const id = req.id.id; 
    const { postId, userId } = req.body;  

    if (!postId || !userId || !id) {
      return res.status(400).json({
        success: false,
        message: "Missing data: postId, userId, or request user ID.",
      });
    }

    if (id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to like posts for another user.",
      });
    }

    const post = await Post.findById(postId);
    const user = await User.findById(userId).select("name");
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const userIdStr = userId.toString();
    const hasLiked = post.likes.some((id) => id.toString() === userIdStr);

    const notification = new Notification({
      recipientId: post.author,
      senderId: userId,
      postId: post._id,
      action: "like",
    });

    if (!hasLiked) {
     
      post.likes.push(userId);
      await post.save();

      const socketId = getSocketId(post.author._id); 

      notification.message = `${user.name} has liked your post.`;
      await notification.save(); 
     
      if (socketId) {
        io.to(socketId).emit("notifiction", { notification });
      }

      io.emit("liked", {
        postId: post._id,
        newNumberOfLikes: post.likes.length,
      });

      return res.status(201).json({
        success: true,
        message: "Like added successfully.",
        numberOfLikes: post.likes.length,
      });
    } else {
 
      post.likes = post.likes.filter((id) => id.toString() !== userIdStr);
      await post.save();

      const socketId = getSocketId(post.author);

      notification.message = `${user.name} has unliked your post.`;
      await notification.save(); 

      if (socketId) {
        io.to(socketId).emit("notifiction", { notification });
      }

      io.emit("liked", {
        postId: post._id,
        newNumberOfLikes: post.likes.length,
      });

      return res.status(201).json({
        success: true,
        message: "Like removed successfully.",
        numberOfLikes: post.likes.length,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
