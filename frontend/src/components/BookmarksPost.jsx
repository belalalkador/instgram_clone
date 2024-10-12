import GetUserBookmarks from "../hooks/GetUserBookmarks";
import Post from "./Post";
import { useParams } from "react-router-dom";

function BookmarksPost() {
  const {userId}=useParams()

  const postsBookmarks = GetUserBookmarks(userId);

  return (
    <div className="flex flex-col h-auto mx-auto overflow-hidden mb-[50px]">
    
      {postsBookmarks && postsBookmarks.length > 0 ? (
        postsBookmarks?.map((post) => (
          <Post key={post._id} post={post} /> 
        ))
      ) : (
        <div className="text-center text-white mt-4">
          No bookmarks available.
        </div>
      )}
    </div>
  );
}

export default BookmarksPost;
