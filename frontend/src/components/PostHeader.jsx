import { useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { BiX, BiDotsVertical } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import FriendProcess from "./FriendProcess";
import { setPosts, setSelectPost } from "../redux/postSlice";
import { setUserInfo } from "../redux/userSlice";

const PostHeader = ({ post }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate=useNavigate()
  const [includeFollower, setIncludeFollower] = useState(false);
  const [includeBookmarks, setIncludeBookmark] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const socket = useSelector((state) => state.socket.socket);
  const posts = useSelector((state) => state.post.posts);

  useEffect(() => {
    if (user?.following && post?.author) {
      const isFollowing = user.following.includes(post.author._id);
      setIncludeFollower(isFollowing);
    }
  }, [user?.following, post?.author]);

  useEffect(() => {
    if (user?.bookmarks && post?._id) {
      const isBooked = user?.bookmarks.includes(post._id);
        setIncludeBookmark(isBooked);
    }
  }, [user?.bookmarks, post?._id]);

  useEffect(() => {
    if (socket) {
      socket.on("deletedPost", (data) => {
        const updatePostsData = posts.filter((p) => p._id !== data.postId);
        dispatch(setPosts(updatePostsData));
      });
    }
  }, [socket]);

  // Handle post download
  const handleDownloadImage = () => {
    const link = document.createElement("a");
    link.href = post.postImage;
    link.download = "post-image.jpg";
    link.click();
  };
  // Handle post bookmarks
  const bookmarks = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/auth/bookmarks/${user._id}/${post._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        console.log(res.data);
        alert(res.data.message);
        if (!res.data.isBooked) {
          dispatch(
            setUserInfo({
              ...user,
              bookmarks: [...user.bookmarks, res.data.postId],
            })
          );
        } else {
          dispatch(
            setUserInfo({
              ...user,
              bookmarks: user.bookmarks.filter(
                (bookmark) => bookmark !== res.data.postId
              ),
            })
          );
        }
        setIncludeBookmark(!includeBookmarks);

      }
    } catch (error) {
      alert(error.response.data.message);
    }
   
  };
 
  // Handle Share button
  const handleShare =async () => {
    try{
      const postUrl = `http://localhost:5173/single/${post._id}`;
        await navigator.clipboard.writeText(postUrl); // Copy the link to the clipboard
        alert("Profile link copied to clipboard!"); // Optional feedback to user
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
  };

  // Handle post deletion
  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/${post._id}/${user._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        alert("Post deleted successfully!");
      }
    } catch (error) {
      console.error(
        "Error deleting post:",
        error.response?.data || error.message
      );
      alert("Failed to delete post");
    }
  };
// Handle post Follow Process
  const handleFollowProcess = async () => {
    try {
      if (post.author._id === user._id) {
        alert("you can not follow yourself");
        return;
      }
      const res = await axios.post(
        "http://localhost:8000/api/v1/auth/follow-process",
        {
          targetUserId: post.author._id,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const { action, targetUserId } = res.data;

        if (action === "followed") {
          dispatch(
            setUserInfo({
              ...user,
              following: [...user.following, targetUserId],
            })
          );
        } else {
          dispatch(
            setUserInfo({
              ...user,
              following: user.following.filter(
                (following) => following !== targetUserId
              ),
            })
          );
        }

        setIncludeFollower(!includeFollower);
      }
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };

//Handle Edit Post Navigate
const handlePostEdit= ()=>{
    dispatch(setSelectPost(post))
    navigate(`/edit-post/${post._id}`)
}

  return (
    <>
      <div className="flex justify-between items-center gap-2">
        <Link to={`/profile/${post.author._id}/posts`}>
          <img
            src={post.author.userImage}
            alt="User"
            className="w-[50px] h-[50px] rounded-full cursor-pointer border-2 border-blue-600"
          />
        </Link>
        <span className="text-white text-[17px] capitalize">
          {post.author.name}
        </span>
        {user._id === post.author._id && (
          <span className="text-slate-300 text-[14px] px-1 py-[1px] capitalize bg-gray-500 rounded-[10px]">
            Author
          </span>
        )}
      </div>
      <div>
        <button
          className="text-[25px] text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <BiX /> : <BiDotsVertical />}
        </button>
        {isOpen && (
          <div className="absolute z-10 bg-white rounded-lg shadow-md top-[58px] right-3 sm:right-0 w-40 flex flex-col items-start p-2 transition-all duration-300">
            <button
              onClick={handleFollowProcess}
              className="text-black text-[16px] py-2 px-3 w-full text-left hover:bg-gray-200 rounded-md"
            >
              {includeFollower ? "Unfollow" : "Follow"}
            </button>
            <button
              onClick={bookmarks}
              className="text-black text-[16px] py-2 px-3 w-full text-left hover:bg-gray-200 rounded-md"
            >
              {includeBookmarks ? (
                <p className="text-[14px] text-nowrap">remove from Favorites</p>
              ) : (
                <p className="text-[16px]">Add to Favorites</p>
              )}
            </button>
            <FriendProcess targetUserId={post.author._id} />
            <button
              onClick={handleDownloadImage}
              className="text-black text-[16px] py-2 px-3 w-full text-left hover:bg-gray-200 rounded-md"
            >
              Download
            </button>
            <button
              onClick={handleShare}
              className="text-black text-[16px] py-2 px-3 w-full text-left hover:bg-gray-200 rounded-md"
            >
              Share
            </button>
            {user._id === post.author._id && (
              <>
                <button  
                onClick={handlePostEdit}                
                  className="text-black text-[16px] py-2 px-3 w-full text-left hover:bg-gray-200 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-600 text-[16px] py-2 px-3 w-full text-left hover:bg-gray-200 rounded-md"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default PostHeader;
