import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import GetUserProfile from "../hooks/GetUserProfile";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setUserInfo } from "../redux/userSlice";
import Spinner from "../components/Spinner";
const EditProfile = () => {
  const disbatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const userAPI = GetUserProfile(user.id);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handelChange = (e) => {
    if (e.target.type === "file")
      setForm({ ...form, [e.target.id]: e.target.files[0] });
    else setForm({ ...form, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key] !== undefined && key !=='userImage')  {
          formData.append(key, form[key]);
        }
      });
      if (form.userImage) {
        formData.append("userImage", form.userImage);
      }

      const res = await axios.put(
        `https://instgram-clone-website.onrender.com/api/v1/auth/profile/${user._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', 
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        disbatch(setUserInfo(res.data.user));
        setForm({});
        setLoading(false);
        setError("");
        navigate(`/profile/${user._id}/posts`);
      }
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
  };
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account?\n You will lose every things "
    );
    if (confirmed) {
      try {
        await axios.delete(
          `https://instgram-clone-website.onrender.com/api/v1/auth/profile/${user._id}`,
          {
            withCredentials: true,
          }
        );
        // Optionally, you can clear the user state or log them out after deletion
        navigate("/sign-in"); // Redirect to login after account deletion
      } catch (error) {
        console.log(error);
        setError("Failed to delete the account. Please try again.");
      }
    }
  };

  return (
    <Layout>
      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-gray-500 h-auto pt-[50px] overflow-hidden">
          <h1 className="text-center py-7 text-white text-[30px] font-bold">
            Edit Your Profile
          </h1>
          <div>
            {error && !loading && (
              <p className="my-1 rounded-[8px]  text-white  w-[90%] sm:w-[500px] text-wrap mx-auto bg-red-400 p-1 ">
                {error}
              </p>
            )}
          </div>
          <div className=" w-full px-2  sm:w-[500px] mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="my-1">
                <label
                  htmlFor="name"
                  className="text-white text-[20px] block py-1 capitalize "
                >
                  name :
                </label>
                <input
                  id="name"
                  defaultValue={userAPI?.name}
                  onChange={handelChange}
                  type="text"
                  className="block py-[6px] px-2 text-black text-[17px] bg-slate-300 outline-none w-full rounded-[8px] border-2 border-transparent focus:border-blue-400"
                />
              </div>
              <div className="my-1">
                <label
                  htmlFor="email"
                  className="text-white text-[20px] block py-1 capitalize "
                >
                  email :
                </label>
                <input
                  id="email"
                  defaultValue={userAPI?.email}
                  onChange={handelChange}
                  type="email"
                  className="block  py-[6px] px-2 text-black text-[17px] bg-slate-300 outline-none w-full rounded-[8px] border-2 border-transparent focus:border-blue-400"
                />
              </div>
              <div className="my-1">
                <label
                  htmlFor="password"
                  className="text-white text-[20px] block py-1 capitalize "
                >
                  new password :
                </label>
                <input
                  id="password"
                  defaultValue={""}
                  onChange={handelChange}
                  type="password"
                  className="block py-[6px] px-2 text-black text-[17px] bg-slate-300 outline-none w-full rounded-[8px] border-2 border-transparent focus:border-blue-400"
                />
              </div>
              <div className="flex flex-col gap-2 my-1">
                <label
                  htmlFor="sex"
                  className="text-white text-[20px] block py-1 capitalize "
                >
                  Gender :
                </label>
                <select
                  id="sex"
                  onChange={handelChange}
                  className="bg-slate-300 outline-none p-2 border-[2px] rounded-[8px] border-transparent focus:border-blue-400"
                >
                  <option value="" key="">
                    {userAPI?.sex}
                  </option>
                  <option value="male" key="2">
                    male
                  </option>
                  <option value="female" key="3">
                    female
                  </option>
                </select>
              </div>
              <div className="my-1">
                <label
                  htmlFor="bio"
                  className="text-white text-[20px] block py-1 capitalize "
                >
                  bio :
                </label>
                <input
                  id="bio"
                  defaultValue={userAPI?.bio}
                  onChange={handelChange}
                  type="text"
                  className="block py-[6px] px-2 text-black text-[17px] bg-slate-300 outline-none w-full rounded-[8px] border-2 border-transparent focus:border-blue-400"
                />
              </div>
              <div className="my-1">
                <label
                  htmlFor="userImage"
                  className="text-white text-[20px] block py-1 capitalize "
                >
                  new user image :
                </label>
                <input
                  id="userImage"
                  type="file"
                  onChange={handelChange}
                  className="block py-[6px] px-2 text-black text-[17px] bg-slate-300 outline-none w-full rounded-[8px] border-2 border-transparent focus:border-blue-400"
                />
              </div>
              <div className="my-3">
                <button className="bg-blue-600 py-1 block text-center w-full text-[22px] text-white capitalize hover:bg-blue-900">
                  update now
                </button>
              </div>
            </form>
            <div className="my-3">
              <button
                onClick={handleDelete}
                className="bg-red-500 py-1 block text-center w-full text-[22px] text-white capitalize hover:bg-red-900"
              >
                Delete My Acounte
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EditProfile;
