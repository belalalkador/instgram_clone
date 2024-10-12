import Notification from "../Models/notification.js";
import User from "../Models/userModels.js";
import { getSocketId, io } from "../socket/socket.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const userId = req.id.id;
    const { targetUserId } = req.body;
    if (userId === targetUserId) {
      return res.status(401).json({
        success: false,
        message: "you can not add friend to yourself",
      });
    }
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (
      user.friendRequestsSent.includes(targetUserId) ||
      targetUser.friendRequestsReceived.includes(userId) ||
      user.friends.includes(targetUserId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Friend request already sent or you are already friends.",
      });
    }

    user.friendRequestsSent.push(targetUserId);
    targetUser.friendRequestsReceived.push(userId);

    await user.save();
    await targetUser.save();

    const notification = new Notification({
      recipientId: targetUserId,
      senderId: userId,
      action: "friend",
      message: `${user.name} has sent you a friend request`,
    });

    await notification.save();
    const socketId = getSocketId(targetUserId);
    if (socketId) {
      io.to(socketId).emit("notifiction", {
        senderId: userId,
        notification,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Friend request sent successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.id.id;
    const { targetUserId } = req.body;
    if (userId === targetUserId) {
      return res.status(401).json({
        success: false,
        message: "you can not acceped friend to yourself",
      });
    }
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.friendRequestsReceived.includes(targetUserId)) {
      return res
        .status(400)
        .json({ success: false, message: "No friend request from this user" });
    }

    if (user.friends.includes(targetUserId)) {
      return res
        .status(400)
        .json({ success: false, message: "You are already friends" });
    }

    user.friends.push(targetUserId);
    targetUser.friends.push(userId);

    user.friendRequestsReceived = user.friendRequestsReceived.filter(
      (id) => id.toString() !== targetUserId
    );
    targetUser.friendRequestsSent = targetUser.friendRequestsSent.filter(
      (id) => id.toString() !== userId
    );

    await user.save();
    await targetUser.save();

    const notification = new Notification({
      recipientId: targetUserId,
      senderId: userId,
      action: "friend",
      message: `${user.name} has accepted your friend request`,
    });

    await notification.save();

    const socketId = getSocketId(targetUserId);
    if (socketId) {
      io.to(socketId).emit("notifiction", {
        senderId: userId,
        notification,
      });
    }

    res.status(200).json({
      success: true,
      message: "Friend request accepted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.id.id;
    const { targetUserId } = req.body;
    if (userId === targetUserId) {
      return res.status(401).json({
        success: false,
        message: "you can not rejected friend to yourself",
      });
    }
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.friendRequestsReceived.includes(targetUserId)) {
      return res
        .status(400)
        .json({ success: false, message: "No friend request from this user" });
    }

    user.friendRequestsReceived = user.friendRequestsReceived.filter(
      (id) => id.toString() !== targetUserId
    );
    targetUser.friendRequestsSent = targetUser.friendRequestsSent.filter(
      (id) => id.toString() !== userId
    );

    await user.save();
    await targetUser.save();

    const notification = new Notification({
      recipientId: targetUserId,
      senderId: userId,
      action: "friend",
      message: `${user.name} has rejected your friend request`,
    });

    await notification.save();

    const socketId = getSocketId(targetUserId);
    if (socketId) {
      io.to(socketId).emit("notifiction", {
        senderId: userId,
        notification,
      });
    }

    res.status(200).json({
      success: true,
      message: "Friend request rejected successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFriend = async (req, res) => {
  try {
    const userId = req.id.id;
    const { targetUserId } = req.body;

    // Prevent self-deletion
    if (userId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete yourself as a friend",
      });
    }

    // Find users
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    // Check if both users exist
    if (!user || !targetUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if users are friends
    if (
      !user.friends.includes(targetUserId) &&
      !targetUser.friends.includes(userId)
    ) {
      return res.status(400).json({
        success: false,
        message: "You are not friends",
      });
    }

    // Remove friend from both users' friend lists
    user.friends = user.friends.filter((id) => id.toString() !== targetUserId);
    targetUser.friends = targetUser.friends.filter(
      (id) => id.toString() !== userId
    );

    // Save changes
    await user.save();
    await targetUser.save();

    // Send notification to the target user
    const notification = new Notification({
      recipientId: targetUserId,
      senderId: userId,
      action: "friend",
      message: `${user.name || "Someone"} has removed you as a friend`,
    });

    await notification.save();

    // Emit socket event if target user is connected
    const socketId = getSocketId(targetUserId);
    if (socketId) {
      io.to(socketId).emit("notification", {
        senderId: userId,
        notification,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Friend removed successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getFriendRequest = async (req, res) => {
  try {
    const userId = req.id.id;
    const friendRequests = await User.findById(userId)
      .select("friendRequestsReceived")
      .populate({
        path: "friendRequestsReceived",
        select: "name userImage",
      });
    if (!friendRequests) {
      return res.status(401).json({
        success: false,
        message: "You Do Not Have Any Friend Requests",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Friend Requests successfully",
      friendRequests,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserFriend = async (req, res) => {
  try {
    const userId = req.id.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "you are not you",
      });
    }
    const friends = await User.findById(userId).select("friends").populate({
      path: "friends",
      select: "name userImage email ",
    });
    if (!friends) {
      return res.status(404).json({
        success: false,
        message: "you do not have any friends",
      });
    }

    return res.status(200).json({
      success: true,
      message: "you are  you",
      friends,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error",
      error,
    });
  }
};
