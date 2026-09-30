import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import useAxios from "../../hooks/useAxios.js";
import PostCommentLists from "./PostCommentList.jsx"

export default function PostComment({ post }) {
  const { auth } = useAuth();

  const [showCommentLists, setShowCommentLists] = useState(false);
  const [comments, setComments] = useState(post?.comments);
  const [comment, setComment] = useState("");
  const { api } = useAxios();

  const addComment = async (event) => {
    const keyCode = event.keyCode;

    //Enter er keycode=13
    if (keyCode === 13) {
      // কমেন্ট যদি খালি থাকে (শুধু স্পেস থাকে), তাহলে ফালতু রিকোয়েস্ট পাঠানো বন্ধ করতে
      if (!comment.trim()) return;

      try {
        const response = await api.patch(
          `${import.meta.env.VITE_SERVER_BASE_URL}/posts/${post.id}/comment`,
          { comment },
        );
        if (response.status === 200) {
          setComments([...response.data.comments]);
          setComment("");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <div className="flex-center mb-3 gap-2 lg:gap-4">
        <img
          className="max-w-7 max-h-7 rounded-full lg:max-h-[34px] lg:max-w-[34px]"
          src={`${import.meta.env.VITE_SERVER_BASE_URL}/${auth?.user?.avatar}`}
          alt="avatar"
        />

        <div className="flex-1">
          <input
            type="text"
            className="h-8 w-full rounded-full bg-lighterDark px-4 text-xs focus:outline-none sm:h-[38px]"
            name="post"
            id="post"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => addComment(e)}
            placeholder="What's on your mind?"
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          className="text-gray-300 max-md:text-sm"
          onClick={() => setShowCommentLists(!showCommentLists)}
        >
          All Comment ▾
        </button>
      </div>
      {showCommentLists && <PostCommentLists comments={comments} />}
    </>
  );
}
