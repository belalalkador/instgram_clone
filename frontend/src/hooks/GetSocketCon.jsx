import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { setSocketCon, disconnectSocket } from "../redux/socket";

const socketUrl = "https://instgram-clone-website.onrender.com"; 

const GetSocketCon = () => {
  const dispatch = useDispatch();
   const userId = useSelector((state) => state.user.user._id);

  useEffect(() => {
   
    const socket = io(socketUrl, {
      transports: ['websocket'], 
      withCredentials: true,
      query: { userId }, 
    });

   
    dispatch(setSocketCon(socket));

   
    return () => {
      socket.disconnect();
      dispatch(disconnectSocket());
    };
  }, [dispatch, userId]); 

  return null;
};

export default GetSocketCon;
