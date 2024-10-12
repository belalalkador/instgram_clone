import axios from "axios";
import { useEffect, useState } from "react";

const GetUserBookmarks = (id) => {
  const [posts, setPosts] = useState([]); // Set initial state to an empty array

  useEffect(() => {
    const fetchUserBookmarks = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/auth/bookmarks/${id}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          setPosts(res.data.posts);
        } else {
          setPosts([]); 
        }
      } catch (error) {
        console.log(error);
        setPosts([]); // On error, set posts to an empty array to avoid undefined issues
      }
    };
    fetchUserBookmarks();
  }, [id]);

  return posts;
};

export default GetUserBookmarks;
