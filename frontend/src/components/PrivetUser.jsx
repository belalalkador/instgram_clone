import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Spinner from "./Spinner";
import { useDispatch } from "react-redux"; 
import { setUserInfo } from "../redux/userSlice";


const PrivetUser = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isUser, setIsUser] = useState(null);
  const socketUrl = "https://instgram-clone-website.onrender.com";

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get(
          "https://instgram-clone-website.onrender.com/api/v1/auth/check-user",
          {
            withCredentials: true,
          }
        );
        if (res.data.ok) {
          setIsUser(true);
          dispatch(setUserInfo(res.data.user));


        } else {
          setIsUser(false);
        }
      } catch (error) {
        setIsUser(false);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [dispatch, socketUrl]);

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-black opacity-50 min-h-screen">
        <Spinner />
      </div>
    );
  }

  return isUser ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivetUser;
