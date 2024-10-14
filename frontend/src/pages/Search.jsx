import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import Post from "../components/Post";
import Spinner from '../components/Spinner'

const Search = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
 
      const response = await axios.get(
        `https://instgram-clone-website.onrender.com/api/v1/post/search?search=${search}`,{
            withCredentials:true,
        }
      );
      if(response.data.success){
      setResults({
        users: response.data.results.users,
        posts: response.data.results.posts,
      });
      setLoading(false);
    }
    } catch (error) {
        console.log(error);
      setError("No Users Or Posts Found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
   {loading? (<Spinner/>):(  
     <div className="bg-gradient-to-bl from-slate-300 to-slate-800  min-h-screen .content-container">
        <div className="pt-[50px] pb-3 px-4">
          <form
            onSubmit={handleSearch}
            className="w-full sm:w-[500px] mx-auto flex gap-[10px] sm:gap-[30px]"
          >
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="flex-1 placeholder:text-white/90 py-2 px-3 outline-none bg-white/50"
            />
            <button
              type="submit"             
              className="bg-slate-700 text-white px-2 py-1 hover:bg-slate-900 transition-all duration-700 rounded"
            >
              Search
            </button>
          </form>
        </div>

     
        {error && (
          <div className="text-white py-3 mx-auto w-[600px]">{error}</div>
        )}

        {!loading && !error && (
          <div className="text-white py-3 w-[95%] mx-auto sm:w-[500px] ">
            <h2 className="text-2xl font-bold mb-4">Users</h2>
            {results.users.length > 0 ? (
              results.users.map((user) => (
                <div
                  key={user._id}
                  className="flex justify-between items-center gap-2 mb-4"
                >
                  <Link to={`/profile/${user._id}/posts`}>
                    <img
                      src={user.userImage}
                      alt="User"
                      className="w-[50px] h-[50px] rounded-[50%] cursor-pointer border-2 border-blue-600"
                    />
                  </Link>
                  <span className="text-white text-[17px] capitalize">
                    {user.name}
                  </span>
                </div>
              ))
            ) : (
              <p>No users found.</p>
            )}

            <h2 className="text-2xl font-bold mt-8 mb-4">Posts</h2>
            {results.posts.length > 0 ? (
              results.posts.map((post) => <Post key={post._id} post={post} />)
            ) : (
              <p>No posts found.</p>
            )}
          </div>
        )}
      
      </div>)}
    </Layout>
  );
};

export default Search;
