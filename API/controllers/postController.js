import Post from "../Models/post.js";
import User from "../Models/userModels.js";
import Comment from "../Models/comment.js";
import sharp from "sharp";
import { io } from "../socket/socket.js";

export const createNewPost = async (req, res) => {
  try {
    const id = req.id.id;
    const { userid } = req.params;
      if (id !== userid) {
      return res.status(401).json({
        success: false,
        message: "You can create posts only for yourself",
      });
    }

    const { title, description } = req.body;
    const postImage = req.file;

    // Ensure all fields are provided
    if (!title || !description || !postImage) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // Create new post instance
    const post = new Post({
      title,
      description,
      author: id,
    });

    let optimizedImageBuffer;
    if (postImage) {
      optimizedImageBuffer = await sharp(postImage.buffer)
        .resize({ width: 800, height: 800, fit: "inside" })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();
    }

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    post.postImage = fileUri;

    // Find user and update posts
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    user.posts.push(post._id);
    await user.save(); // Save user with updated posts array

    // Populate author info and save post
    await post.populate({ path: "author", select: "-password" });
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post Created!",
      post,
    });
  } catch (error) {
    // Improved error message with detailed error info
    return res.status(500).json({
      success: false,
      message: "An error occurred: " + error.message,
    });
  }
};

export const editPost = async (req, res) => {
  try {
    const loggedInUserId = req.id.id; 
    const { postId, userId } = req.params;

     if (!postId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Post ID or User ID is missing.",
      });
    }

   if (userId !== loggedInUserId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this post.",
      });
    }

      const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

   const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    const { title, description } = req.body;
    const postImage = req.file;

    post.title = title || post.title;
    post.description = description || post.description;

    if (postImage) {
      const optimizedImageBuffer = await sharp(postImage.buffer)
        .resize({ width: 800, height: 800, fit: "inside" })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();
      const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;
      post.postImage = fileUri;
    }

    
    await post.save();

   io.emit("updatePost", { postId, post });

    return res.status(200).json({
      success: true,
      message: "Post updated successfully!",
      post,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the post: " + error.message,
    });
  }
};


export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate({
        path: "author",
        select: "name userImage follwing",
      })
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "name userImage",
        },
        options: { sort: { createdAt: -1 } },
      })

      .sort({ createdAt: -1 }); 

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully!",
      posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching posts.",
    });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(404).json({
        success: false,
        message: "No ID send !",
      });
    }
    const posts = await Post.find({ author: userId })
      .populate({
        path: "author",
        select: "name userImage follwing",
      })
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "name userImage",
        },
        options: { sort: { createdAt: -1 } },
      })
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Posts !",
      posts,
    });
  } catch (error) {}
};

export const getSinglePostById = async (req, res) => {
  try {
    const { postId } = req.params;

      const post = await Post.findById(postId)
      .populate({
        path: "author",
        select: "name userImage follwing",
      })
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "name userImage",
        },
        options: { sort: { createdAt: -1 } }, 
      });

     if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post fetched successfully!",
      post,
    });
  } catch (error) {
      return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the post.",
    });
  }
};


export const search = async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required",
      });
    }

    // Search users
    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } }, // Case-insensitive search
        { email: { $regex: search, $options: "i" } },
      ],
    }).select("name userImage ");

    const posts = await Post.find({
      $or: [
        { title: { $regex: search, $options: "i" } }, // Case-insensitive search
        { description: { $regex: search, $options: "i" } },
      ],
    })
      .populate({
        path: "author",
        select: "name userImage follwing",
      })
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "name userImage",
        },
        options: { sort: { createdAt: -1 } },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      results: {
        users,
        posts,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred: " + error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const userId = req.id.id;
    const { postId, userId: paramUserId } = req.params;

    if (!postId || !paramUserId) {
      return res.status(400).json({
        success: false,
        message: "Post ID or User ID is missing.",
      });
    }

       if (paramUserId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post.",
      });
    }

   const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

   const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

      await Comment.deleteMany({ postId });

    user.posts = user.posts.filter((p) => p.toString() !== post._id.toString());
    user.bookmarks = user.bookmarks.filter((b) => b.toString() !== post._id.toString());

    await user.save();

      await Post.findByIdAndDelete(postId);

      io.emit("deletedPost", { postId });

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully!",
    });
  } catch (error) {
    console.error("Error when deleting post:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting the post: " + error.message,
    });
  }
};

