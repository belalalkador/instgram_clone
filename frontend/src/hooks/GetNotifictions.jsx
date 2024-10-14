import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setNotifications } from "../redux/postSlice";


function GetNotifictions() {
    const dispatch = useDispatch();

    useEffect(()=>{
        const fetshNotifictions= async()=>{
          try {
            const {data}=await axios.get( "https://instgram-clone-website.onrender.com/api/v1/auth/notifictions",
              {
                withCredentials:true,
              })
            if(data.success){
              dispatch(setNotifications(data.notifictions))
            }
          } catch (error) {
            console.log(error);
          }
        }
        fetshNotifictions()
      },[])


  return null
}

export default GetNotifictions
