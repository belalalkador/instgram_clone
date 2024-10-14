import axios from "axios";
import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/postSlice";

function Like({ post }) {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post.posts);
  const user = useSelector((state) => state.user.user); 
  const socket = useSelector((state) => state.socket.socket);

  const [like, setLike] = useState(post?.likes.includes(user._id));
  const [postLikes, setPostLikes] = useState(post?.likes.length || 0);

  useEffect(() => {
    setPostLikes(post?.likes.length);
    setLike(post?.likes.includes(user._id));
  }, [post?.likes]);

   useEffect(() => {
    if (socket) {
      const handleSocketLike = (data) => {
        if (post._id === data.postId) {
          console.log(data.newNumberOfLikes);
          setPostLikes(data.newNumberOfLikes);
        }
      };
      
      socket.on('liked', handleSocketLike);

     
      return () => {
        socket.off('liked', handleSocketLike);
      };
    }
  }, [socket, post._id]);

  // Handle like/unlike action
  const handleLike = async () => {
    try {
      const res = await axios.post(
        "https://instgram-clone-website.onrender.com/api/v1/post/like",
        { postId: post._id, userId: user._id },
        { withCredentials: true }
      );
      
      if (res.data.success) {
        // Toggle like state
        setLike(!like);

        // Update the posts array in Redux state
        const updatedPostData = posts.map(p =>
          p._id === post._id
            ? {
                ...p,
                likes: like
                  ? p.likes.filter(id => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );

        dispatch(setPosts(updatedPostData));
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <span onClick={handleLike} className="cursor-pointer flex items-center">
      {like ? (
        <FaHeart className="text-blue-500" />
      ) : (
        <FaRegHeart className="text-gray-500" />
      )}
      <span className="ml-1 text-[15px]">{postLikes}</span>
    </span>
  );
}

export default Like;
