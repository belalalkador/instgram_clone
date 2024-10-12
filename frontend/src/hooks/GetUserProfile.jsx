import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from '../components/Spinner';
const GetUserProfile = (userId) => {
  const [user, setUser] = useState({});
  const [loading,setLoading]=useState(false)
  useEffect(() => {
    const fetshUser = async (id) => {
        setLoading(true)
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/auth/profile/${id}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          setUser(res.data.user);
        setLoading(false)

        }
      } catch (error) {
        setLoading(false)
        console.log(error);
      }
    };
    fetshUser(userId);
  }, [userId]);

  if(loading) return <Spinner/>;

  return user;
};

export default GetUserProfile;
