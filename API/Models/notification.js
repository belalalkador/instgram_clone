import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, 
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, 
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }, // The related post
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  action: {
    type: String,
    enum: ["like", "comment","friend"], 
    required: true,
  },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
