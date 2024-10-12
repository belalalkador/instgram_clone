import { useParams } from "react-router-dom"
import GetUserPosts from "../hooks/GetUserPosts"
import Post from "./Post"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"


function UserPosts() {
  const { userId } = useParams();
  const socket = useSelector((state) => state.socket.socket);
  const initialPosts = GetUserPosts(userId);  // Assuming this is your initial posts fetching hook
  const [posts, setPosts] = useState(initialPosts);

  useEffect(() => {
      setPosts(initialPosts);
      
  }, [initialPosts]);

  useEffect(() => {
    if (socket) {
      socket.on("deletedPost", (data) => {
        console.log(data);
               const updatedPostsData = posts.filter((p) => p._id !== data.postId);
        setPosts(updatedPostsData);  
      });
    }

    return () => {
      if (socket) {
        socket.off("deletedPost");
      }
    };
  }, [socket, posts]);

return (
    <div className="flex flex-col h-auto mx-auto  overflow-hidden mb-[50px]">
    {posts?.map((post)=>{
        return <Post key={post._id} post={post}/>
    })}
    </div>
  )
}

export default UserPosts
