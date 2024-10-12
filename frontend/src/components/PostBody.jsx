

function PostBody({post}) {
  return (
    <>
      <div className="h-[400px] rounded">
        <img src={post.postImage} alt="" className="h-full w-full rounded" />
      </div>
      <div className="py-1 text-white flex flex-col gap-1">
        <span className="text-[22px]"> {post.title}</span>
        <span className="text-[18px]"> {post.description}</span>
      </div>
    </>
  );
}

export default PostBody;
