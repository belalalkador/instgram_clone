import { useEffect } from "react";
import GetNotifictions from "../hooks/GetNotifictions";
import GetSocketCon from "../hooks/GetSocketCon";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { setNotifications } from "../redux/postSlice";


const Layout = ({ children }) => {
  const dispatch=useDispatch()
  const socket = useSelector((state) => state.socket.socket); 
  const user = useSelector((state) => state.user.user); 
  const notifications = useSelector((state) => state.post.Notifications);
 
  GetSocketCon()
  GetNotifictions()
  useEffect(() => {
    if (socket) {
      const handleNotification = (data) => {
     
        if (data.notification.recipientId === user._id) {
         
          dispatch(setNotifications([...notifications, data.notification]));
        }
      };

      socket.on("notifiction", handleNotification);

        return () => {
        socket.off("notifiction", handleNotification);
      };
    }
  }, [socket, user._id, notifications]); 
 
  
  return (
    <>
      <div className="flex flex-col-reverse md:flex-row justify-between">
        <div className="bg-gray-800 md:h-screen fixed bottom-0 z-10 left-0 right-0 h-[50px] sm:sticky">
          <Sidebar />
        </div>

        <div className="bg-gradient-to-r from-slate-700 to-slate-200   flex-1 h-screen overflow-y-scroll content-container">
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
