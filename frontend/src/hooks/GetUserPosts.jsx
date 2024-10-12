import axios from "axios";
import { useEffect, useState } from "react";


const GetUserPosts = (id) => {
 const [posts,setPosts]=useState()
    useEffect(()=>{ 
        const  fetchseggestUser =async ()=>{
          try {
              const res = await axios.get(
                  `http://localhost:8000/api/v1/post/user/${id}`,
                  {
                    withCredentials:true,
                  }
                );
              if(res.data.success)  {
                 setPosts(res.data.posts)
            }
          } catch (error) {
              console.log(error);
          }
        }
        fetchseggestUser()
      },[id])  

      return posts;

}
export default GetUserPosts;