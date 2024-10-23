import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link, Outlet } from "react-router-dom";
import { BsMenuApp } from "react-icons/bs";

const Message = () => {
  const user = useSelector((state) => state.user.user);
  const [friends, setFriends] = useState([]);
  const [open, setOpen] = useState(false);
  const [online, setOnline] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const socket = useSelector((state) => state.socket.socket);

  useEffect(() => {
    if (socket) {
      socket.on("getOnlineUsers", (data) => {
        setOnline(data);
      });
    }
  }, [socket]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const { data } = await axios.get(
          `https://instgram-clone-website.onrender.com/api/v1/friend/get-friends`,
          { withCredentials: true }
        );
        if (data.success) {
          setFriends(data.friends);
        }
      } catch (error) {
        console.log(error.response);
      }
    };
    fetchFriends();
  }, [user]);

  const isOnline = (array, id) => {
    return array.includes(id);
  };

  const filteredFriends = friends?.friends?.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="h-[calc(100vh_-_100px)]  md:h-screen flex justify-between flex-col  lg:flex-row ">
        <div className="lg:basis-[25%] lg:h-screen bg-white/10 px-2 content-container">
          <div className="py-2 mx-auto my-2 flex justify-between z-30">
            <input
              className="w-[300px] lg:w-[90%] p-1"
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
            <button
              onClick={() => setOpen(!open)}
              className="block text-slate-500 hover:text-blue-600 lg:hidden"
            >
              <BsMenuApp />
            </button>
          </div>
          <div
            className={`flex flex-row gap-[40px] lg:flex-col lg:gap-3 overflow-hidden transition-all duration-500 
            ${open ? "h-auto" : "h-0"} lg:h-screen`}
          >
            {filteredFriends?.length > 0 ? ( 
              filteredFriends.map((f) => (
                <div
                  key={f._id}
                  className="flex flex-col lg:flex-row lg:items-center gap-2 text-white"
                >
                  <Link to={`/messages/chat/${f._id}`}>
                    <img
                      src={f.userImage}
                      className="w-[50px] rounded-[50%] h-[50px]"
                      alt=""
                    />
                  </Link>
                  <h3>{f.name}</h3>
                  {isOnline(online, f._id) ? (
                    <p className="text-lime-300 text-[12px]">ONLINE</p>
                  ) : (
                    <p className="text-gray-700 text-[12px]">OFFLINE</p>
                  )}
                </div>
              ))
            ) :  (
              <p>NO Friends</p>
            )}
          </div>
        </div>
        <div className={` ${open?"h-[calc(100vh_-_225px)] ":"h-[calc(100vh_-_170px)] "}  lg:flex-1 lg:h-screen `}>
          <Outlet />
        </div>
      </div>
    </Layout>
  );
};

export default Message;
