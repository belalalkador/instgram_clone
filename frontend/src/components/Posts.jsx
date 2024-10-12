import { useSelector } from "react-redux";
import GetAllPosts from "../hooks/GetAllPosts";
import Post from "./Post";

function Posts() {
  GetAllPosts()
  const posts=useSelector((state )=> state.post.posts)
  return (
    <div className="bg-gradient-to-r px-3 from-slate-700 to-slate-200  pb-[75px]">
    <div className="flex flex-col h-auto mx-auto  ">
    
   {posts?.length>0 ?  (
  
       posts.map((post)=>{
    return <Post key={post._id} post={post}/>
   }) 
 

):(<p className="w-fit mx-auto my-4 text-white text-[30px] font-bold">Keep Wating</p>)
}

    </div>
    </div>
  )
}

export default Posts
