import Conversation from "../Models/conversion.js";
import Messages from "../Models/message.js";
import User from "../Models/userModels.js";
import { io, getSocketId } from "../socket/socket.js";

export const createNewMessage = async (req, res) => {
  try {
    const userId = req.id.id;
    const { targetUserId } = req.params;
    const { message } = req.body;

    if (!message || !targetUserId) {
      return res.status(401).json({
        success: false,
        message: "Missing data",
      });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    // Check if both users exist
    if (!user || !targetUser) {
      return res.status(404).json({
        success: false,
        message: "User(s) not found",
      });
    }

    const messageDB = new Messages({
      message,
      sendId: userId,
      receiverId: targetUserId,
    });
    await messageDB.save();

    let conversation = await Conversation.findOne({
      $or: [
        { sendId: userId, receiverId: targetUserId },
        { sendId: targetUserId, receiverId: userId },
      ],
    });

    if (!conversation) {
      conversation = new Conversation({
        sendId: userId,
        receiverId: targetUserId,
        messages: [messageDB._id],
      });
      await conversation.save();
    } else {
      conversation.messages.push(messageDB._id);
      await conversation.save();
    }

    const socketIdUser = getSocketId(userId);
    const socketIdTarget = getSocketId(targetUserId);

    if (socketIdUser) {
      io.to(socketIdUser).emit("newmessage", { message: messageDB });
    }
    if (socketIdTarget) {
      io.to(socketIdTarget).emit("newmessage", { message: messageDB });
    }

    return res.status(201).json({
      success: true,
      message: "Message created successfully",
      messageDB,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const getAllMessagesForTwoUsers = async (req, res) => {
  try {
    const userId = req.id.id;
    const { targetUserId } = req.params;

    if (!userId || !targetUserId) {
      return res.status(401).json({
        success: false,
        message: "Missing data",
      });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res.status(404).json({
        success: false,
        message: "User(s) not found",
      });
    }

    const conversation = await Conversation.findOne({
      $or: [
        { sendId: userId, receiverId: targetUserId },
        { sendId: targetUserId, receiverId: userId },
      ],
    }).populate("messages");

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "No conversation found between the users",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All messages between the users",
      conversation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteAllMessagesForTwoUsers = async (req, res) => {
  try {
    const userId = req.id.id;
    const { targetUserId } = req.params;

    if (!userId || !targetUserId) {
      return res.status(401).json({
        success: false,
        message: "Missing data",
      });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res.status(404).json({
        success: false,
        message: "User(s) not found",
      });
    }

    
    const conversation = await Conversation.findOne({
      $or: [
        { sendId: userId, receiverId: targetUserId },
        { sendId: targetUserId, receiverId: userId },
      ],
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "No conversation found between the users",
      });
    }

   
    await Messages.deleteMany({ _id: { $in: conversation.messages } });


    await Conversation.findByIdAndDelete(conversation._id);

    return res.status(200).json({
      success: true,
      message: "All messages and conversation deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};