import { useState } from "react";
import { actions } from "../../actions";
import threeDots from "../../assets/icons/3dots.svg";
import deletee from "../../assets/icons/delete.svg";
import edit from "../../assets/icons/edit.svg";
import time from "../../assets/icons/time.svg";
import { useAuth } from "../../hooks/useAuth.js";
import { useAvatar } from "../../hooks/useAvatar";
import useAxios from "../../hooks/useAxios.js";
import { usePost } from "../../hooks/usePost.js";
import { useProfile } from "../../hooks/useProfile.js";
import { getDateDifferenceFromNow } from "../../utils";
import PostEntry from "./PostEntry";

export default function PostHeader({ post }) {
  const { avatarURL } = useAvatar(post);
  const [showAction, setShowAction] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { auth } = useAuth();
  const { api } = useAxios();
  const { dispatch } = usePost();
  const { dispatch: profileDispatch } = useProfile();
  const isMe = post?.author?.id == auth?.user?.id;

  function handleShowAction() {
    setShowAction(!showAction);
  }

  const handleEditPost = () => {
    setEditMode(true);
  };

  const handleDeletePost = async (event) => {
    dispatch({ type: actions.post.DATA_FETCHING });

    try {
      const response = await api.delete(
        `${import.meta.env.VITE_SERVER_BASE_URL}/posts/${post.id}`,
      );

      if (response.status === 200) {
        dispatch({
          type: actions.post.POST_DELETED,
          data: post.id,
        });

        profileDispatch({
          type: actions.profile.POST_DELETED,
          data: post.id,
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: actions.post.DATA_FETCH_ERROR,
        error: error.message,
      });
    }
  };

  return (
    <>
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            className="max-w-10 max-h-10 rounded-full lg:max-h-[58px] lg:max-w-[58px]"
            src={avatarURL}
            alt="avatar"
          />
          <div>
            <h6 className="text-lg lg:text-xl">{post?.author?.name}</h6>
            <div className="flex items-center gap-1.5">
              <img src={time} alt="time" />
              <span className="text-sm text-gray-400 lg:text-base">
                {`${getDateDifferenceFromNow(post?.createAt)}`} ago
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          {isMe && (
            <button onClick={handleShowAction}>
              <img src={threeDots} alt="3dots of Action" />
            </button>
          )}

          {showAction && (
            <div className="action-modal-container">
              <button
                className="action-menu-item hover:text-lwsGreen"
                onClick={handleEditPost}
              >
                <img src={edit} alt="Edit" />
                Edit
              </button>
              <button
                className="action-menu-item hover:text-red-500"
                onClick={handleDeletePost}
              >
                <img src={deletee} alt="Delete" />
                Delete
              </button>
            </div>
          )}
        </div>
      </header>
      {editMode && (
        <PostEntry post={post} onCreate={() => setEditMode(false)} />
      )}
    </>
  );
}
