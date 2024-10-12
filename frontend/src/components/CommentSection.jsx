import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdSend } from "react-icons/md";
import { formatDistanceToNow } from "date-fns";
import { setPosts } from "../redux/postSlice";

function CommentsSection({
  postId,
  user,
  comments,
  setNumberOfComment,
  viewAllCommint,
}) {
  const [commintInput, setCommintInput] = useState("");
  const [postComments, setComments] = useState([]);
  const socket = useSelector((state) => state.socket.socket);
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post.posts);
  useEffect(() => {
    setComments(comments);
    setNumberOfComment(comments.length);
  }, [comments]);

  useEffect(() => {
    if (socket) {
      const handleSocketCommented = (data) => {
        if (postId === data.postId) {
          const updatedPostData = posts.map((p) =>
            p._id === data.newComment.postId
              ? {
                  ...p,
                  comments: [data.newComment, ...(p.comments || [])], // Add new comment to the post's comments
                }
              : p
          );

          dispatch(setPosts(updatedPostData));
        }
      };

      socket.on("commented", handleSocketCommented);

      return () => {
        socket.off("commented", handleSocketCommented);
      };
    }
  }, [socket, postId]);

  useEffect(() => {
    if (socket) {
      const handleSocketDeleteCommented = (data) => {
          if (postId === data.postId && data.commentId) {
          const updatedPostData = posts.map((p) =>
            p._id === data.postId
              ? {
                  ...p,
                  comments: p.comments.filter(
                    (comment) => comment._id !== data.commentId
                  ),
                }
              : p
          );
  
          dispatch(setPosts(updatedPostData));
        }
      };
  
      socket.on("deleteComment", handleSocketDeleteCommented);
  
      return () => {
        socket.off("deleteComment", handleSocketDeleteCommented);
      };
    }
   
  }, [socket, postId, posts, dispatch]);  
  

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/commint/${commentId}`, {
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!commintInput.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/commint/${postId}`,
        {
          text: commintInput,
          postId,
          userId: user._id,
        },
        {
          withCredentials: true, 
        }
      );

      if (res.data.success) {
        const newComment = res.data.newComment;

       
        const updatedPostData = posts.map((p) =>
          p._id === newComment.postId
            ? {
                ...p,
                comments: [newComment, ...(p.comments || [])], 
              }
            : p
        );

        dispatch(setPosts(updatedPostData));

        setCommintInput("");
      }
    } catch (error) {
      console.error("Error posting comment:", error.response);
    }
  };

  return (
    <div>
      <div
        className={`w-full overflow-y-scroll content-container py-2 my-2 text-white transition-[height] duration-300 bg-slate-900 ${
          viewAllCommint ? "h-[250px]" : "h-[80px]"
        }`}
      >
        {postComments && postComments.length > 0 ? (
          postComments.map((postcomment) => (
            <div
              key={postcomment?._id}
              className="flex flex-col gap-1 px-2 border-b border-gray-500"
            >
              <div className="flex my-1 items-center gap-2">
                <Link to={`/profile/${postcomment?.userId._id}/posts`}>
                  <img
                    src={postcomment?.userId.userImage}
                    alt="User"
                    className="w-[30px] h-[30px] rounded-[50%] cursor-pointer border-2 border-blue-600"
                  />
                </Link>
                <span className="text-white text-[17px] capitalize">
                  {postcomment?.userId.name}
                </span>
              </div>
              <p>{postcomment?.text}</p>
              {user._id === postcomment?.userId._id && (
                <div className="flex gap-1">
                  <button
                    className="bg-red-500 p-[2px]"
                    onClick={() => handleDeleteComment(postcomment?._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
              <p className="text-[10px] text-gray-400">
                {formatDistanceToNow(new Date(postcomment.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 p-2">No comments available</p>
        )}
      </div>

      <div className="w-full py-[6px]">
        <form className="flex justify-between gap-2" onSubmit={handleSubmit}>
          <input
            type="text"
            name={postId}
            value={commintInput}
            onChange={(e) => setCommintInput(e.target.value)}
            placeholder="Write a comment"
            className="flex-1 px-1 py-[2px] text-white bg-slate-600 outline-none border border-transparent focus:border-blue-400"
          />
          <button
            type="submit"
            className={`${
              commintInput
                ? "text-[23px] text-blue-500"
                : "text-[19px] text-gray-700"
            } hover:text-blue-500`}
          >
            <MdSend />
          </button>
        </form>
      </div>
    </div>
  );
}

export default CommentsSection;
