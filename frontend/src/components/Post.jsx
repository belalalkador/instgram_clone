import PostHeader from "./PostHeader";
import PostBody from "./PostBody";
import PostFooter from "./PostFooter";

function Post({ post }) {
  return (
    <div className="w-full bg-white/25 px-5  sm:w-[400px] py-2 mx-auto mt-9 relative">
      <div className="flex px-2 justify-between items-center">
        <PostHeader post={post} />
      </div>
      <div className="py-2 px-2 transition-all duration-500">
        <PostBody post={post} />
        <PostFooter post={post} />
      </div>
    </div>
  );
}

export default Post;
