import axios from 'axios';
import  { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { setSuggestUser } from '../redux/userSlice';

function GetSuggestUsers() {
    const disbatch=useDispatch()
    useEffect(()=>{ 
        const  fetchseggestUser =async ()=>{
          try {
              const res = await axios.get(
                  "http://localhost:8000/api/v1/auth/suggest-users",
                  {
                    withCredentials:true,
                  }
                );
              if(res.data.success)  {
                  disbatch(setSuggestUser(res.data.users))
              }
          } catch (error) {
              console.log(error);
          }
        }
        fetchseggestUser()
      },[])
 
}

export default GetSuggestUsers;
