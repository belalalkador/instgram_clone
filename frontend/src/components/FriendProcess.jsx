import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function FriendProcess({targetUserId}) {
    const user= useSelector((state)=>state.user.user)
    const [isFrend,setIsfrend]=useState(null)
    const [status,setStatus]=useState(null)

useEffect(()=>{
if(user._id && targetUserId ){
     
  const isFriend = user.friends.includes(targetUserId);
  
  if(isFriend){
    setIsfrend(true)
  }
  else if ( user.friendRequestsSent.includes(targetUserId) || user.friendRequestsReceived.includes(targetUserId)){
      setIsfrend(false)
      setStatus(true)
  }
  else {
    setIsfrend(false)
    setStatus(false)
  }

}
},[])

const handleAddFriend=async ()=>{
  try {
    const res= await axios.post(`https://instgram-clone-website.onrender.com/api/v1/friend/add`,{
          targetUserId
    },{
     withCredentials:true
    })
    if(res.data.success){
      alert(res.data.message)
      setStatus(true)
    }
  } catch (error) {
      alert(error.response.data.message)
    }
}

  return (
    <button className="text-black text-[16px] py-2 px-3 w-full text-left hover:bg-gray-200 rounded-md">
    {isFrend? <>
    <button>
      UnFriend
    </button>
    </>:status?
     "Wating":
    <><button onClick={handleAddFriend}> 
     add Friend
     </button></>}
    </button>
  );
}

export default FriendProcess;
