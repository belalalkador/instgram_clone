import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import GetUserProfile from "../hooks/GetUserProfile";
import { MdSend } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import { formatDistanceToNow } from 'date-fns';

function Chat() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((state) => state.user.user);
  const userForChat = GetUserProfile(userId);
  const socket = useSelector((state) => state.socket.socket);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/v1/message/${userId}`,
          { withCredentials: true }
        );
        if (data.success) {
          setMessages(data.conversation.messages);
        }
      } catch (error) {
        setMessages([]);
        console.error("Error fetching messages:", error.response);
      }
    };
    fetchMessages();
  }, [userId]);

  useEffect(() => {
    if (socket) {
      socket.on("newmessage", (data) => {
        setMessages((prevMessages) => [...prevMessages, data.message]);
      });

      return () => {
        socket.off("newmessage");
          };
    }
  }, [socket]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);



  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const { data } = await axios.post(
        `http://localhost:8000/api/v1/message/${userId}`,
        { message: newMessage },
        { withCredentials: true }
      );
      if (data.success) {
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error.response);
    }
  };

  const handleDeleteMessages = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all messages with this user?"
    );
    if (!confirmDelete) return;

    try {
      const { data } = await axios.delete(
        `http://localhost:8000/api/v1/message/${userId}`,
        { withCredentials: true }
      );
      if (data.success) {
        setMessages([]);
        alert("All messages deleted successfully.");
        navigate("/"); // Redirect or take any other action after deletion
      }
    } catch (error) {
      console.error("Error deleting messages:", error.response);
    }
  };

  return (
    <div className="h-[calc(100vh_-_50px)] md:h-screen">
      {/* User Info Section */}
      <div className="bg-white/65 h-[70px] flex items-center px-2 gap-4">
        <img
          src={userForChat?.userImage}
          className="w-[60px] h-[60px] rounded-[50%]"
          alt=""
        />
        <h1>{userForChat.name}</h1>

  
          <button
          onClick={handleDeleteMessages}
          className="ml-auto flex items-center justify-center bg-red-500 hover:bg-red-600 text-white p-2 rounded"
        >
          <AiOutlineDelete size={20} /> Delete All
        </button>
      </div>

        <div className=" mb-[45px] md:mb-0 bg-slate-900 h-[calc(100vh_-_120px)] py-4 px-2 flex flex-col gap-3 content-container">
        {messages && messages.length > 0 ? (
          messages.map((msg) => (
            msg && msg.sendId ? (
              <div
                key={msg._id}
                className={`flex flex-col ${
                  msg.sendId === user._id
                    ? "bg-blue-600 self-end"
                    : "bg-green-600 self-start"
                } text-white p-2 rounded-md max-w-[60%] break-words w-fit`}
              >
                <span>{msg.message}</span>
                <span className="text-[12px]">
                  {formatDistanceToNow(new Date(msg.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            ) : (
              <p key={msg?._id || Math.random()} className="text-gray-400">
                Invalid message data
              </p>
            )
          ))
        ) : (
          <p className="text-white flex w-fit text-[30px] my-[100px] mx-auto">
            No messages yet.
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="h-[50px] py-2 mt-[-50px] md:mt-0">
        <form
          className="px-2 flex justify-center items-center gap-2 py-2 left-0 md:left-[600px] bottom-[70px] md:bottom-0 right-0 text-white bg-gray-800"
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            placeholder="Send A Message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 md:w-[300px] px-1 py-[2px] w-full text-white bg-slate-600 outline-none border border-transparent rounded focus:border-blue-400"
          />
          <button type="submit" className="hover:text-blue-500">
            <MdSend />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
