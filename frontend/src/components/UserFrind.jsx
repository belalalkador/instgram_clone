import { useEffect, useState } from "react";
import axios from "axios";

const UserFriend = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const { data } = await axios.get(
          `https://instgram-clone-website.onrender.com/api/v1/friend/get-friends`,
          { withCredentials: true }
        );
        if (data.success) {
          setFriends(data.friends.friends);
        }
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch friends");
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  // Unfriend function
  const handleUnfriend = async (friendId) => {
    try {
      const { data } = await axios.post(
        `https://instgram-clone-website.onrender.com/api/v1/friend/unfriend`,
        { targetUserId: friendId },
        { withCredentials: true }
      );

      if (data.success) {
        setFriends((prevFriends) =>
          prevFriends.filter((friend) => friend._id !== friendId)
        );
      } else {
        console.log("Failed to unfriend");
      }
    } catch (error) {
      console.log(error.response?.data?.message || "Error unfriending user");
    }
  };

  if (loading) return <p>Loading friends...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className=" p-4 bg-gradient-to-tr from-slate-300 to-slate-900 text-white mt-4">
      <h2 className="text-2xl font-bold mb-4">Your Friends</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <div
              key={friend._id}
              className="p-4 bg-slate-700 rounded shadow-md flex flex-col items-center justify-center"
            >
              <img
                src={friend.userImage}
                alt={friend.name}
                className="h-20 w-20 rounded-full mb-2"
              />
              <h3 className="text-lg font-semibold">{friend.name}</h3>
              <button
                onClick={() => handleUnfriend(friend._id)}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Unfriend
              </button>
            </div>
          ))
        ) : (
          <p>No friends found.</p>
        )}
      </div>
    </div>
  );
};

export default UserFriend;
