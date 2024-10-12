import User from "../Models/userModels.js";
import Post from "../Models/post.js";
import Comment from "../Models/comment.js";
import Notification from "../Models/notification.js";
import { comparePasswords, hashPassword } from "../utils/hash.js";
import jwt from "jsonwebtoken";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { io } from "../socket/socket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const signup = async (req, res) => {
  try {
    const { name, email, password, sex } = req.body;
    const userImage = req.file;

    if (!name || !email || !password || !sex) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists!",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      sex,
    });

    let optimizedImageBuffer;
    if (userImage) {
      optimizedImageBuffer = await sharp(userImage.buffer)
        .resize({ width: 100, height: 100, fit: "inside" })
        .toFormat("jpeg", { quality: 90 })
        .toBuffer();
    } else {
      // Ensure this path is correct
      const defaultImagePath = path.join(
        __dirname,
        "../utils/img/download.png"
      );
      try {
        const image = fs.readFileSync(defaultImagePath);
        optimizedImageBuffer = await sharp(image)
          .resize({ width: 40, height: 40, fit: "inside" })
          .toFormat("jpeg", { quality: 80 })
          .toBuffer();
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "An error occurred while processing the default image.",
        });
      }
    }

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    user.userImage = fileUri;

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Sign Up successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred: " + error.message,
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(409).json({
        success: false,
        message: "Sorry, you need to create an account first!",
      });
    }

    const matchPassword = await comparePasswords(
      password,
      existingUser.password
    );

    if (!matchPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { id: existingUser._id },
      process.env.REFRESH_JWT_SECRET,
      { expiresIn: "1y" }
    );
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Sign In successfully!",
      user: existingUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred: " + error.message,
    });
  }
};

export const checkUserController = async (req, res) => {
  try {
    const { id } = req.id;

    if (!id) {
      return res.status(401).json({
        ok: false,
        message: "User is not authenticated",
      });
    }

    const existingUser = await User.findById(id).select("-password");

    if (!existingUser) {
      return res.status(404).json({
        ok: false,
        message: "Sorry, you need to create an account first!",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "User is authenticated",
      user: existingUser,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "An  error occurred: " + error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { id } = req.id; // Authenticated user's ID
    const { id: userId } = req.params; // Profile user ID from route params

    // Validate IDs
    if (!userId || !id) {
      return res.status(400).json({
        success: false,
        message: "Invalid request: Missing user ID",
      });
    }
    // Find the user by userId, excluding the password field
    const existingUser = await User.findById(userId).select("-password");

    // Check if the user exists
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userObj = existingUser.toObject();

    userObj.isOwner = id === userId;

    return res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      user: userObj,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An  error occurred: " + error.message,
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { id } = req.id;
    const { userId } = req.params;
    if (id !== userId) {
      return res.status(401).json({
        success: false,
        message: "You can Edit Profile only for yourself",
      });
    }

    const updates = req.body;
    const userImage = req.file;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found ",
      });
    }

    if (updates.name && updates.name !== user.name) {
      const existingUser = await User.findOne({ name: updates.name });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "This name is already taken. Please choose another one.",
        });
      }
    }
    if (updates.email && updates.email !== user.email) {
      const existingUser = await User.findOne({ email: updates.email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "This email is already taken. Please choose another one.",
        });
      }
    }

    if (updates.password) {
      const hashedPassword = await hashPassword(updates.password);
      updates.password = hashedPassword; // Replace plain password with hashed password
    }

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        user[key] = updates[key];
      }
    });

    let optimizedImageBuffer;
    if (userImage) {
      optimizedImageBuffer = await sharp(userImage.buffer)
        .resize({ width: 100, height: 100, fit: "inside" })
        .toFormat("jpeg", { quality: 90 })
        .toBuffer();

      const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
        "base64"
      )}`;
      user.userImage = fileUri;
    }
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User Updated Successfully !",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        sex: user.sex,
        bio: user.bio,
        userImage: user.userImage,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred: " + error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.id;
    const { userId } = req.params;
    if (id !== userId) {
      return res.status(401).json({
        success: false,
        message: "You Can Delete Profile only for yourself",
      });
    }
    // Delete posts by this user
    await Post.deleteMany({ author: id });

    // Delete comments by this user
    await Comment.deleteMany({ userId: id });

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found ",
      });
    }

    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
      sameSite: "Strict", // Adjust according to your needs
    });
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
      sameSite: "Strict", // Adjust according to your needs
    });

    return res.status(200).json({
      success: true,
      message: "User Deleted Successfully !",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred: " + error.message,
    });
  }
};

export const getUserImage = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "Id Not Found",
      });
    }
    const userImage = await User.findById(userId).select("userImage");
    if (!userImage) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    return res.status(200);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred: " + error.message,
    });
  }
};

export const signout = async (req, res) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
      sameSite: "Strict", // Adjust according to your needs
    });
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
      sameSite: "Strict", // Adjust according to your needs
    });

    res.status(200).json({ success: true, message: "Successfully signed out" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSuggestUser = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.id.id } }).select(
      "-password "
    );
    if (!users) {
      return res.status(400).json({
        message: "Currently do not have any users",
      });
    }
    res.status(200).json({
      success: true,
      message: "Users",
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const followProcess = async (req, res) => {
  try {
    const userId = req.id.id;
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: "Missing target user ID",
      });
    }
    if (userId === targetUserId) {
      return res.status(403).json({
        success: false,
        message: "You Can Not Follow Yourself",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Target user not found",
      });
    }

    const isFollowing = user.following.includes(targetUserId);

    if (!isFollowing) {
      // Add to following/followers
      user.following.push(targetUserId);
      targetUser.followers.push(userId);
    } else {
      // Remove from following/followers
      user.following = user.following.filter(
        (following) => following.toString() !== targetUserId
      );
      targetUser.followers = targetUser.followers.filter(
        (follower) => follower.toString() !== userId
      );
    }

    await user.save();
    await targetUser.save();

    if (io) {
      io.to(userId).emit("followProcess", {
        action: isFollowing ? "unfollowed" : "followed",
        targetUserId,
      });

      io.to(targetUserId).emit("followProcess", {
        action: isFollowing ? "unfollowed" : "followed",
        userId,
      });
    }

    return res.status(200).json({
      success: true,
      action: isFollowing ? "unfollowed" : "followed",
      targetUserId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in follow/unfollow process",
      error: error.message,
    });
  }
};

export const bookmarks = async (req, res) => {
  try {
    const id = req.id.id;
    const { postId, userId } = req.params;

    if (!postId || !userId || !id) {
      return res.status(400).json({
        success: false,
        message: "Missing postId or userId ",
      });
    }
    if (userId !== id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const isBooked = user.bookmarks.includes(postId);
    if (!isBooked) {
      user.bookmarks.push(postId);
    } else {
      user.bookmarks = user.bookmarks.filter(
        (bookmark) => bookmark.toString() !== postId.toString()
      );
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: `The post was${
        isBooked ? " remove from " : " added to"
      }  bookmarks successfully`,
      postId,
      isBooked,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const id = req.id.id;
    const { userId } = req.params;

    if (userId !== id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action",
      });
    }

    const userBookmarks = await User.findById(userId)
      .select("bookmarks")
      .populate({
        path: "bookmarks",
        populate: [
          {
            path: "author",
            select: "name userImage",
          },
          {
            path: "comments",
            options: { sort: { createdAt: -1 } },
            populate: {
              path: "userId",
              select: "name userImage",
            },
          },
        ],
      });

    if (!userBookmarks) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!userBookmarks.bookmarks.length) {
      return res.status(200).json({
        success: true,
        message: "No bookmarks found",
        posts: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Bookmarked posts fetched successfully",
      posts: userBookmarks.bookmarks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error fetching bookmarks: ${error.message}`,
    });
  }
};

export const getNotifictionsForUser = async (req, res) => {
  try {
    const notifictions = await Notification.find({
      recipientId: req.id.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All Notifictions",
      notifictions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error" + error,
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const userId = req.id.id;  // Ensure this is the authenticated user ID
    const { notificationId } = req.params;

    // Check if notificationId is provided
    if (!notificationId) {
      return res.status(401).json({
        success: false, // This should be false, not true
        message: "Missing data",
      });
    }

    // Find and delete the notification by its ID
    const notification = await Notification.findByIdAndDelete(notificationId);

    // If notification is not found, return 404
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

   return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      notificationId
    });
  } catch (error) {
     return res.status(500).json({
      success: false,
      message: "Server Error: " + error.message,
    });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const userId = req.id.id; 
    const { notificationId } = req.params;

    if (!notificationId) {
      return res.status(400).json({
        success: false,
        message: "Missing notification ID",
      });
    }

    
    const notification = await Notification.findById(notificationId);
        if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found or not authorized",
      });
    }
notification.isRead=true
await notification.save()
    // Successfully marked the notification as read
    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,  // Optionally return the updated notification
    });
  } catch (error) {
    // Handle any errors and return a 500 error
    return res.status(500).json({
      success: false,
      message: "Server Error: " + error.message,
    });
  }
};


export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh Token not found" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, user) => {
      if (err)
        return res.status(403).json({ message: "Invalid Refresh Token" });

      const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      });

      res.status(200).json({ success: true });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
