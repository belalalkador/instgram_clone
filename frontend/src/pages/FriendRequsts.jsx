import { useEffect, useState } from "react"
import Layout from "../components/Layout"
import axios from "axios"
import { Link } from "react-router-dom"

function FriendRequsts() {
  const [friendRequests,setFriendRequests]=useState([])  
useEffect(()=>{
    const fetshFriendRequests= async()=>{
try {
    const res = await axios.get(`https://instgram-clone-website.onrender.com/api/v1/friend/friend-requests`,{
        withCredentials:true
    })
    if(res.data.success){
          setFriendRequests(res.data.friendRequests)
    }

} catch (error) {
   console.log(error.response); 
}
    }
    fetshFriendRequests()
},[])

const handleAcceptFriend = async (id) => {
  try {
    const res = await axios.post(
      `https://instgram-clone-website.onrender.com/api/v1/friend/accept`,
      { targetUserId: id },
      { withCredentials: true }
    );

    if (res.data.success) {
      
      setFriendRequests((prevRequests) =>
        Array.isArray(prevRequests) 
          ? prevRequests.filter((f) => f._id !== id)
          : []
      );
    }
  } catch (error) {
    console.log(error.response);
  }
};

const handleRejectFriend = async (id) => {
  try {
    const res = await axios.post(
      `https://instgram-clone-website.onrender.com/api/v1/friend/reject`,
      { targetUserId: id },
      { withCredentials: true }
    );
    
    if (res.data.success) {
        setFriendRequests((prevRequests) => 
        prevRequests.filter((f) => f._id !== id)
      );
    }
  } catch (error) {
    console.log(error.response);
  }
};

  return (
    <Layout>
      <div className="flex flex-col gap-3 py-6 px-4 min-h-screen">
        <h1 className="py-4 text-white text-[30px] text-center font-bold ">Friends Requests</h1>
        {friendRequests?.friendRequestsReceived &&friendRequests?.friendRequestsReceived.length > 0 &&
           friendRequests.friendRequestsReceived.map(f=>(
            <div
            key={f._id}
            className={`p-4 rounded-md shadow-md bg-gray-300
                 flex flex-col sm:flex-row justify-between items-center flex-wrap`}
          >
            <div className="flex items-center gap-2 mb-2">
         <Link to={`/profile/${f._id}/posts`}> <img src={f.userImage} className="w-[80px] h-[80px] rounded-[50%]" alt="" /></Link>
           <h2 className="text-white text-[20px]">{f.name}</h2>
            </div>
            <div className="flex gap-2">
                <button
                  onClick={()=>handleAcceptFriend(f._id)}
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                >
                  Accept 
                </button>
               <button
               onClick={()=>{handleRejectFriend(f._id)}}
                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Rejected
              </button>
            </div>
          </div>
           ))
        

        }

      </div>
    </Layout>
  )
}

export default FriendRequsts
