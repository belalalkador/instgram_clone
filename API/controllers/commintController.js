import Post from "../Models/post.js";
import User from "../Models/userModels.js";
import Comment from "../Models/comment.js";
import Notification from "../Models/notification.js";
import { io, getSocketId } from "../socket/socket.js";

export const createComment = async (req, res) => {
  try {
    const id = req.id.id;
    const { postId, text, userId } = req.body;

    if (!text || !postId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Text, Post ID, and User ID are required",
      });
    }

    if (id !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to comment  posts for another user.",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const user = await User.findById(userId).select("name ");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newComment = new Comment({
      text,
      postId,
      userId,
    });

    await newComment.save();
   
    post.comments.push(newComment._id);
    await post.save();

    await newComment.populate({
      path: "userId",
      select: "name userImage",
    })


  
    const notification = new Notification({
      recipientId: post.author,
      senderId: userId,
      action: "comment",
      postId: post._id,
      commentId: newComment._id,
      message: `${user.name} commented on your ${post.title} post`,
    });

    await notification.save();

    const socketId = getSocketId(post.author);
    if (socketId) {
      io.to(socketId).emit("notifiction", { notification });
    }

    io.emit("commented", {
      postId: post._id,
      newComment,
    });

    return res.status(201).json({
      success: true,
      message: "Comment created successfully",
     newComment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);

        return res.status(500).json({
      success: false,
      message: "Error creating comment: " + error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.id;
    const { commentId } = req.params; 

   
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }


    if (comment.userId.toString() !== id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment",
      });
    }
    const post = await Post.findById(comment.postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

   
    post.comments = post.comments.filter(
      (cmtId) => cmtId.toString() !== commentId.toString()
    );

      await post.save();

  
    await Comment.findByIdAndDelete(commentId);


    io.emit("deleteComment", {
      postId: post._id,
      commentId, 
    });

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      commentId, 
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the comment",
    });
  }
};