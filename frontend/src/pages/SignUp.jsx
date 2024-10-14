import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const nav = useNavigate();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [isvalid, setIsvalid] = useState("border-transparent");
  const [error, setError] = useState("");

  const handeChange = (e) => {
    if (e.target.id === "userImage")
      setForm({ ...form, [e.target.id]: e.target.files[0] });
    else setForm({ ...form, [e.target.id]: e.target.value });
  };

  const validateInput = (id, value) => {
    if (id === "name") {
      return value.length >= 3;
    } else if (id === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(value);
    } else if (id === "password") {
      return value.length >= 8;
    } else if ((id === "sex" && value !== "") || id === "userImage") {
      return true;
    }
    return false;
  };

  const handleInput = (e) => {
    const { id, value } = e.target;
    const isValid = validateInput(id, value);

    e.target.style.borderColor = isValid ? "blue" : "orange";
  };
  const handelSubmit = async (e) => {
    e.preventDefault();
    let allValid = true;
    setLoading(true);
    // Validate all inputs
    for (let key in form) {
      if (!validateInput(key, form[key])) {
        allValid = false;
        setError("Some Inputs Are Wrong");
        setLoading(false);
        break;
      }
    }

    // Update the border color based on validation result
    if (allValid) {
      setIsvalid("border-blue-500");
    } else {
      setIsvalid("border-orange-500");
    }
    try {
      if (allValid) {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("password", form.password);
        formData.append("sex", form.sex);
        if (form.userImage) {
          formData.append("userImage", form.userImage);
        }

        const res = await axios.post(
          "https://instgram-clone-website.onrender.com/api/v1/auth/signup",
          formData
        );

        if (res.data.success) {
          setLoading(false);
          setError("");
          setForm({});
          nav("/sign-in");
        }
      }
    } catch (error) {
      setError(error.response.data.message);
      setIsvalid("border-orange-500");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" w-full min-h-[100vh] flex items-center justify-center bg-gradient-to-tr from-indigo-400 to-blue-100 ">
      <div
        className={`border-[3px] ${isvalid} w-[350px] bg-white/70 backdrop-blur-md  p-5 sm:w-[500px] mx-auto overflow-hidden`}
      >
        <h1 className="text-center text-[20px] sm:text-[28px] mb-4">
          Create an account
        </h1>
        <form onSubmit={handelSubmit}>
          <div className="flex flex-col gap-2 my-1">
            <label htmlFor="name">Name :</label>
            <input
              id="name"
              required
              type="text"
              onInput={handleInput}
              onChange={handeChange}
              className="bg-gray-200 outline-none p-2 border-b-[3px] border-transparent focus:border-orange-500"
            />
          </div>
          <div className="flex flex-col gap-2 my-1">
            <label htmlFor="email">Email :</label>
            <input
              id="email"
              onChange={handeChange}
              required
              type="email"
              onInput={handleInput}
              className="bg-gray-200 outline-none p-2 border-b-[3px] border-transparent focus:border-orange-500"
            />
          </div>
          <div className="flex flex-col gap-2 my-1">
            <label htmlFor="email">Password :</label>
            <input
              id="password"
              required
              type="password"
              onInput={handleInput}
              onChange={handeChange}
              className="bg-gray-200 outline-none p-2 border-b-[3px] border-transparent focus:border-orange-500"
            />
          </div>
          <div className="flex flex-col gap-2 my-1">
            <label htmlFor="gender">Gender :</label>
            <select
              id="sex"
              required
              onInput={handleInput}
              onChange={handeChange}
              className="bg-gray-200 outline-none p-2 border-b-[3px] border-transparent focus:border-orange-500"
            >
              <option value="" key=""></option>
              <option value="male" key="2">
                male
              </option>
              <option value="female" key="3">
                female
              </option>
            </select>
          </div>

          <div className="flex flex-col gap-2 my-1">
            <label htmlFor="name">Image :</label>
            <div className="w-full relative flex ">
              <input
                id="userImage"
                onChange={handeChange}
                type="file"
                accept="img/*"
                onInput={handleInput}
                className="flex-1  bg-gray-200 outline-none p-2 border-b-[3px] border-transparent focus:border-orange-500"
              />
              <span className="absolute right-2 bottom-[25%] text-gray-500 pr-1">
                (optional){" "}
              </span>
            </div>
          </div>
          <div className="my-3">
            <button
              className="block font-[500] w-full text-white text-center rounded-md bg-blue-500 p-2 text-[20px] hover:bg-blue-400"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin"></div>

                  <span>Please wait...</span>
                </div>
              ) : (
                "Create Now"
              )}
            </button>
          </div>
          <div className="py-1">
            <Link to={"/sign-in"}>
              Do you have an account?{" "}
              <span className="text-orange-500 hover:text-orange-700">
                sign in
              </span>
            </Link>
          </div>
        </form>
        <div>
          {error && !loading && (
            <p className="my-1 text-white bg-red-400 p-1 ">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
