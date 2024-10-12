import { useSelector } from "react-redux";
import GetSuggestUsers from "../hooks/GetSuggestUsers";
import { Link } from "react-router-dom";

const SuggestUsers = () => {
  
  const users = useSelector((state) => state.user.suggestUser);

  GetSuggestUsers();

  return (
    <div className="basis-[100%] shadow px-3  bg-slate-500 py-1">
      <div className="flex flex-row gap-[20px] overflow-x-scroll suggest-users-container">
        {users?.length > 0 ? (
          users.map((user) => {
            return (
              <div
                key={user._id}
                className="flex flex-col items-center  min-w-[100px] "
              >
                <Link to={`/profile/${user._id}/posts`}>
                  <img
                    className="w-[65px] h-[65px] rounded-full border-2 border-blue-600"
                    src={user.userImage}
                    alt={user.name}
                  />
                </Link>
                <span className="text-white text-[17px] ">{user.name}</span>
              </div>
            );
          })
        ) : (
          <>There are no users</>
        )}
      </div>
    </div>
  );
};

export default SuggestUsers;
