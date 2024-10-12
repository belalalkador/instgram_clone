import { Link, Outlet, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import GetUserProfile from '../hooks/GetUserProfile'
import { formatDistanceToNow } from 'date-fns';

const Profile = () => {
  const { userId } = useParams();
  const user = GetUserProfile(userId);
  

  const formattedDate = user?.createdAt ? formatDistanceToNow(new Date(user.createdAt)) : "Unknown";
  const copyToClipboard = async () => {
    try{
    const profileLink = `${window.location.origin}/profile/${userId}`; 
      await navigator.clipboard.writeText(profileLink); // Copy the link to the clipboard
      alert("Profile link copied to clipboard!"); // Optional feedback to user
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <Layout>
      <div className="p-2 w-full bg-gradient-to-tr from-slate-300 to-slate-900 min-h-screen overflow-hidden">
        <div className="flex flex-wrap justify-between">
          <div className="flex justify-center items-center basis-[100%] sm:basis-1/2 py-2">
            <img
              src={user?.userImage}
              className="h-[100px] w-[100px] sm:h-[200px] sm:w-[200px] rounded-[50%]"
              alt={`${user?.name}'s profile`}
            />
          </div>
          <div className="basis-[100%] sm:basis-1/2 mt-4 md:mt-0">
            {user?.isOwner ? (
              <div className="flex gap-5 md:gap-2 w-full justify-center md:justify-start md:w-auto px-6 md:p-0">
                <Link to={`/edit-profile/${user.id}`} className="bg-slate-900 text-white px-2 py-1 rounded cursor-pointer">
                  Edit Profile
                </Link>
                <Link to="/friend-requests" className="bg-slate-900 text-white px-2 py-1 rounded cursor-pointer">
                  Friend Requests
                </Link>
                <button onClick={copyToClipboard} className="bg-slate-900 text-white px-2 py-1 rounded cursor-pointer">
                  Share
                </button>
              </div>
            ) : (
            <></>
            )}
            <div className="pt-6 text-white">
              <h3 className="text-[32px]">{user?.name}</h3>
              <h3 className="text-[18px]">{user?.email}</h3>
              <h3 className="text-[18px]">{user?.sex}</h3>
              <h3 className="text-[18px]">{user?.bio}</h3>
              <h3 className="text-[18px]">{user?.followers?.length} Followers</h3>
              <p>Since: {formattedDate}</p>
            </div>
          </div>
        </div>
        <hr className="mx-auto w-full md:w-[800px] my-2" />

        <div className="text-[20px] flex h-4 w-full items-center justify-center text-white gap-4">
          <Link to={`/profile/${userId}/posts`} className="hover:text-gray-400">
            {user?.isOwner ? "My Posts" : "Posts"}
          </Link>
         
          {user?.isOwner && (
            <>
              <Link to={`/profile/${userId}/friend`} className="hover:text-gray-400">
                Friends
              </Link>
              <Link to={`/profile/${userId}/bookmarks`} className="hover:text-gray-400">
                Favorite
              </Link>
            </>
          )}
        </div>

        <div>
          <Outlet />
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
