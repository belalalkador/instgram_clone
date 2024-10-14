import {  useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import axios from "axios";
import { setNotifications } from "../redux/postSlice";



function Notifications() {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.post.Notifications); 

  const markNotificationRead = async (id) => {
    try {
      const { data } = await axios.put(
        `https://instgram-clone-website.onrender.com/api/v1/auth/notifiction/${id}`, 
        {},
        { withCredentials: true }
      );
      
      if (data.success) {
        
        const updatedNotifications = notifications.map((notification) =>
          notification._id === id
            ? { ...notification, isRead: true } 
            : notification
        );

        dispatch(setNotifications(updatedNotifications));
      }
    } catch (error) {
      console.log(error.response);
    }
  };
  

const deleteNotification= async (id)=>{
  try {
    const {data}= await axios.delete(`https://instgram-clone-website.onrender.com/api/v1/auth/notifiction/${id}`,{
      withCredentials:true,
    })
  if(data.success){
        dispatch(setNotifications(notifications.filter((not)=> not._id !== id)))
  }
  } catch (error) {
    console.log(error.response);
  }
}


  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h2 className="text-[40px] font-bold my-4 text-white text-center">Notifications</h2>

        {notifications.length > 0 ? (
          <ul className="min-h-screen">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className={`p-4 mb-2 rounded-md shadow-md ${
                  notification.isRead ? "bg-gray-300" : "bg-white"
                } flex justify-between items-center`}
              >
                <div>
                  <p className="text-lg">{notification.message}</p>
                  <p className="text-sm text-gray-500">
                     {notification.createdAt}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!notification.isRead && (
                    <button
                     onClick={()=>{markNotificationRead(notification._id)}}
                      className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification._id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                  >
                        Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-[20px] min-h-screen">No notifications available.</p>
        )}
      </div>
    </Layout>
  );
}

export default Notifications;
