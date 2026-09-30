/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { actions } from "../../actions/index.js";
import addPhotoIcon from "../../assets/icons/addPhoto.svg";
import { useAuth } from "../../hooks/useAuth.js";
import useAxios from "../../hooks/useAxios.js";
import { usePost } from "../../hooks/usePost.js";
import { useProfile } from "../../hooks/useProfile.js";
import Field from "../Common/Field";

export default function PostEntry({ onCreate, post }) {
  const { auth } = useAuth();
  const { api } = useAxios();
  const { dispatch } = usePost();
  const { state: profile, dispatch: profileDispatch } = useProfile();
  const fileUploadRef = useRef();
  const user = profile?.user ?? auth?.user;

  // এডিট মোড ডিটেক্ট করা
  const Edit = !!post;

  // ছবির প্রিভিউ এবং ফাইল স্টোর করার জন্য স্টেট
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditMode, setIsEditMode] = useState(Edit);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
  } = useForm();

  // ১. এডিট মোডে থাকলে পূর্বের ডেটা (টেক্সট এবং ইমেজ) পপুলেট করার লজিক
  useEffect(() => {
    if (isEditMode && post) {
      // react-hook-form এর টেক্সট ফিল্ডের ভ্যালু সেট করছি
      setValue("content", post.content);

      // যদি আগে থেকেই কোনো ইমেজ আপলোড করা থাকে, তবে তার প্রিভিউ সেট করছি
      if (post.image) {
        setImagePreview(
          `${import.meta.env.VITE_SERVER_BASE_URL}/${post.image}`,
        );
      }
    }
  }, [post, isEditMode, setValue]);

  // "Add Photo" বাটনে ক্লিক করলে হিডেন ফাইল ইনপুটটি ক্লিক হবে
  const handleImageUploadClick = (event) => {
    event.preventDefault();
    fileUploadRef.current.click();
  };

  // ফাইল সিলেক্ট করলে প্রিভিউ দেখানোর ফাংশন (পোস্ট হবে না)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // ব্রাউজারে দেখানোর জন্য একটি টেম্পোরারি URL তৈরি করা হচ্ছে
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // প্রিভিউ ডিলিট করার ফাংশন (যদি ইউজার ছবি বাদ দিতে চায়)
  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    fileUploadRef.current.value = ""; // input ফিল্ড রিসেট করা
  };

  const handlePostSubmit = async (formData) => {
    const postData = new FormData();

    // টেক্সট কনটেন্ট অ্যাপেন্ড করা হচ্ছে
    postData.append("content", formData.content);

    // যদি কোনো ছবি সিলেক্ট করা থাকে, তবেই সেটি অ্যাপেন্ড হবে
    if (selectedFile) {
      postData.append("image", selectedFile);
    }

    try {
      let response;
      if (isEditMode) {
        response = await api.patch(
          `${import.meta.env.VITE_SERVER_BASE_URL}/posts/${post.id}`,
          postData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      } else {
        response = await api.post(
          `${import.meta.env.VITE_SERVER_BASE_URL}/posts`,
          postData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      }

      if (response.status === 200) {
        dispatch({
          type: isEditMode
            ? actions.post.DATA_EDITED
            : actions.post.DATA_CREATED,
          data: response.data,
        });

        if (isEditMode && profileDispatch) {
          profileDispatch({
            type: actions.profile.USER_DATA_EDITED,
            data: response.data,
          });
        }

        //close this UI
        if (typeof onCreate === "function") {
          onCreate();
        }
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: actions.post.DATA_FETCH_ERROR, error: error.message });
    }
  };

  return (
    <main className="mx-auto max-w-[1020px] py-8">
      <div className="container">
        <div className="card relative">
          <h6 className="mb-3 text-center text-lg font-bold lg:text-xl">
            {isEditMode ? "Edit Post" : "Create Post"}
          </h6>
          <form onSubmit={handleSubmit(handlePostSubmit)}>
            <div className="mb-3 flex items-center justify-between gap-2 lg:mb-6 lg:gap-4">
              <div className="flex items-center gap-3">
                <img
                  className="max-w-10 max-h-10 rounded-full lg:max-h-[58px] lg:max-w-[58px]"
                  src={`${import.meta.env.VITE_SERVER_BASE_URL}/${user?.avatar}`}
                  alt="avatar"
                />
                <div>
                  <h6 className="text-lg lg:text-xl">
                    {user?.firstName} {user?.lastName}
                  </h6>

                  <span className="text-sm text-gray-400 lg:text-base">
                    Public
                  </span>
                </div>
              </div>

              <button
                className="btn-primary cursor-pointer !text-gray-100"
                for="photo"
                type="button"
                onClick={handleImageUploadClick}
              >
                <img src={addPhotoIcon} alt="Add Photo" />
                Add Photo
              </button>
              <input
                type="file"
                name="photo"
                id="photo"
                ref={fileUploadRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* ছবি সিলেক্ট করা থাকলে এখানে তার একটি প্রিভিউ দেখাবে */}
            {imagePreview && (
              <div className="relative mb-4 max-h-[300px] overflow-hidden rounded-lg border border-gray-700">
                <img
                  src={imagePreview}
                  alt="Selected Preview"
                  className="w-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute right-2 top-2 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            )}

            <Field error={errors.content}>
              <textarea
                {...register("content", {
                  required: "Adding some text is mendatory!",
                })}
                className={`auth-input ${errors.textarea ? "border-red-500" : "border-gray-200"}`}
                type="textarea"
                name="content"
                id="content"
                placeholder="Share Your Thoughts..."
              />
            </Field>

            <div className="border-t border-[#3F3F3F] pt-4 lg:pt-6">
              <button
                className="auth-input bg-green-400 font-bold text-deepDark transition-all hover:opacity-90"
                type="submit"
              >
                {isEditMode ? "Update Post" : "Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
