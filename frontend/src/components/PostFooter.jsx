import { FaRegComment } from "react-icons/fa"; 
import { useState } from "react";
import { useSelector } from "react-redux";
import Like from "./Like";
import CommentsSection from "./CommentSection";
import { formatDistanceToNow } from 'date-fns';


function PostFooter({ post }) {
  const user = useSelector((state) => state.user.user);
  const [viewAllCommint, setViewAllCommint] = useState(false);
  const [numberOfComment,setNumberOfComment]=useState(0)

  return (
    <div>
      <div className="text-white text-[25px] flex justify-around items-center gap-3 pt-3">
        <Like post={post} />
        <span
              className="flex items-center gap-1 cursor-pointer text-white"
        >
          <FaRegComment  onClick={()=> setViewAllCommint(!viewAllCommint)} className={`text-[20px] ${viewAllCommint ? "text-slate-800":"text-white"}`} />
        <span className={`text-[16px] ${viewAllCommint ? "text-slate-800":"text-white"}`}>{numberOfComment}</span>
        </span>
      </div>
      <CommentsSection
        postId={post._id}
        user={user}
        setNumberOfComment={setNumberOfComment}
        comments={post.comments}
        viewAllCommint={viewAllCommint}
      />
       <p className="text-[15px] text-slate-900">
              {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </p>
    </div>
    
  );
}

export default PostFooter;
