import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { usePost } from "../../hooks/usePost.js";
import PostEntry from "./PostEntry.jsx";

export default function NewPost() {
  const { auth } = useAuth();
  const { state } = usePost();
  const user = state?.posts?.post?.author?.avatar ?? auth?.user?.avatar;
  const [showPostEntry, setShowPostEntry] = useState(false);
  return (
    <>
      {showPostEntry ? (
        <PostEntry onCreate={() => setShowPostEntry(false)} />
      ) : (
        <div className="card">
          <div className="flex-center mb-3 gap-2 lg:gap-4">
            <img
              className="max-w-10 max-h-10 rounded-full lg:max-h-[58px] lg:max-w-[58px]"
              src={`${import.meta.env.VITE_SERVER_BASE_URL}/${user}`}
              alt="avatar"
            />

            <div className="flex-1">
              <textarea
                className="h-16 w-full rounded-md bg-lighterDark p-3 focus:outline-none sm:h-20 sm:p-6"
                name="post"
                id="post"
                placeholder="What's on your mind?"
                onClick={() => setShowPostEntry(true)}
              ></textarea>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
