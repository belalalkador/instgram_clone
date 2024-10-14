import {
  FaHome,
  FaSearch,
  FaEnvelope,
  FaBell,
  FaPlus,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "../redux/userSlice";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const notifications = useSelector((state) => state.post.Notifications);

  // Filter unread notifications
  const unreadNotificationsCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get("https://instgram-clone-website.onrender.com/api/v1/auth/signout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUserInfo(""));
        navigate("/sign-in");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-wrap flex-row justify-between md:flex-col text-white w-full md:w-64 h-full p-1 pb-2 sm:p-4 overflow-hidden">
      <div
        className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
        onClick={() => handleNavigation("/")}
        title="Home"
      >
        <FaHome className="text-[16px] sm:text-[24px]" />
        <span className="hidden md:inline">Home</span>
      </div>
      <div
        className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
        onClick={() => handleNavigation("/search")}
        title="Search"
      >
        <FaSearch className="text-[16px] sm:text-[24px]" />
        <span className="hidden md:inline">Search</span>
      </div>
            <div
        className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
        onClick={() => handleNavigation("/messages")}
        title="Messages"
      >
        <FaEnvelope className="text-[16px] sm:text-[24px]" />
        <span className="hidden md:inline">Messages</span>
      </div>
      <div
        className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
        onClick={() => handleNavigation("/notifications")}
        title="Notifications"
      >
        <FaBell className="text-[16px] sm:text-[24px]" />
        <span className="hidden md:inline">Notifications</span>
        {/* Show unread notifications count */}
        <span
          className={`bg-red-500 text-white p-1 rounded-[50%] flex justify-center items-center w-[20px] h-[20px] ${
            unreadNotificationsCount > 0 ? "" : "hidden"
          }`}
        >
          {unreadNotificationsCount}
        </span>
      </div>
      <div
        className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
        onClick={() => handleNavigation("/create")}
        title="Create"
      >
        <FaPlus className="text-[16px] sm:text-[24px]" />
        <span className="hidden md:inline">Create</span>
      </div>
      <div
        className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
        onClick={() => handleNavigation(`/profile/${user._id}/posts`)}
        title="Profile"
      >
        <FaUser className="text-[16px] sm:text-[24px]" />
        <span className="hidden md:inline">Profile</span>
      </div>
      <div
        className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
        onClick={() => {
          handleLogout();
        }}
        title="Logout"
      >
        <FaSignOutAlt className="text-[16px] sm:text-[24px]" />
        <span className="hidden md:inline">Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;
