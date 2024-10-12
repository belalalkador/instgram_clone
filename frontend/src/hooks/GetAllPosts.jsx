import axios from "axios";
import { useEffect } from "react";
import {useDispatch} from 'react-redux';
import { setPosts } from "../redux/postSlice";

const GetAllPosts = () => {
  const dispatch=useDispatch()
    useEffect(()=>{ 
        const  fetchseggestUser =async ()=>{
          try {
              const res = await axios.get(
                  "http://localhost:8000/api/v1/post/all",
                  {
                    withCredentials:true,
                  }
                );
              if(res.data.success)  {
              dispatch(setPosts(res.data.posts))
            }
          } catch (error) {
              console.log(error);
          }
        }
        fetchseggestUser()
      },[])  
}
export default GetAllPosts;