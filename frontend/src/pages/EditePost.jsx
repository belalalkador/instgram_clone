import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EditPost() {
  const selectPost = useSelector((state) => state.post.selectPost);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  const [form, setForm] = useState({
    title: "",
    description: "",
    postImage: null,
  });

  useEffect(() => {
    if (selectPost) {
      setForm({
        title: selectPost.title,
        description: selectPost.description,
        postImage: selectPost.postImage, 
      });
    }
  }, [selectPost]);

  const handleChange = (e) => {
    if (e.target.id === "postImage") {
      setForm({ ...form, postImage: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);

      if (form.postImage && typeof form.postImage === "object") {
        formData.append("postImage", form.postImage);
      }

      const res = await axios.put(
        `https://instgram-clone-website.onrender.com/api/v1/post/edit/${selectPost._id}/${user._id}`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        navigate(`/profile/${user._id}/posts`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="h-screen bg-gradient-to-bl from-slate-300 to-slate-900 flex items-center justify-center">
        <div className="w-full sm:w-[500px] mx-auto bg-white/10 backdrop-blur-md px-6 py-8 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 ease-in-out">
          <h1 className="text-3xl font-semibold text-center text-white mb-6">
            Edit Post
          </h1>

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-6">
              <label className="block text-[18px] pb-2 text-white">Title</label>
              <input
                type="text"
                id="title"
                value={form.title}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 rounded-md bg-white/20 text-white placeholder-white outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="Enter post title"
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-[18px] pb-2 text-white">Description</label>
              <input
                type="text"
                id="description"
                value={form.description}
                onChange={handleChange}
                required
                className="block w-full px-3 py-2 rounded-md bg-white/20 text-white placeholder-white outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="Enter post description"
              />
            </div>

            {/* Image */}
            <div className="mb-6">
              <label className="block text-[18px] pb-2 text-white">Post Image</label>
              <input
                type="file"
                id="postImage"
                onChange={handleChange}
                className="block w-full px-3 py-2 rounded-md bg-white/20 text-white placeholder-white outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
              {form.postImage && typeof form.postImage === "string" && (
                <img
                  src={form.postImage}
                  alt="Post"
                  className="mt-4 w-full max-w-[200px] h-auto rounded-md"
                />
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-md font-semibold text-lg shadow-md hover:bg-blue-600 transition-all duration-300 hover:scale-105 transform"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default EditPost;
