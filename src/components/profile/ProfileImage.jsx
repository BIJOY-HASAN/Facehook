import { useRef } from "react";
import { actions } from "../../actions";
import edit from "../../assets/icons/edit.svg";
import useAxios from "../../hooks/useAxios.js";
import { useProfile } from "../../hooks/useProfile.js";

export default function ProfileImage() {
  const { state, dispatch } = useProfile();
  const { api } = useAxios();
  const fileUploadRef = useRef();

  const handleImageUpload = (event) => {
    event.preventDefault();
    fileUploadRef.current.addEventListener("change", updateImageDisplay);
    fileUploadRef.current.click();
  };

  const updateImageDisplay = async () => {
    try {
      const formdata = new FormData();

      for (const file of fileUploadRef.current.files) {
        formdata.append("avatar", file);
      }

      const response = await api.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/profile/${state?.user?.id}/avatar`,
        formdata,
      );

      if (response.status === 200) {
        dispatch({ type: actions.profile.IMAGE_UPDATED, data: response.data });
      }
    } catch (error) {
      dispatch({
        type: actions.profile.DATA_FETCHED_ERROR,
        error: error.message,
      });
    }
  };
  return (
    <div className="relative mb-8 h-[180px] w-[180px] overflow-hidden rounded-full lg:mb-11 lg:h-[218px] lg:w-[218px]">
      {" "}
      <img
        className="h-full w-full object-cover rounded-full"
        src={`${import.meta.env.VITE_SERVER_BASE_URL}/${state?.user?.avatar}`}
        alt={`${state?.user?.firstName}`}
      />
      <form>
        <button
          className="flex-center absolute bottom-4 right-4 h-7 w-7 rounded-full bg-black/50 hover:bg-black/80"
          type="submit"
          onClick={handleImageUpload}
        >
          <img src={edit} alt="Edit" />
        </button>
        <input type="file" id="file" ref={fileUploadRef} hidden />
      </form>
    </div>
  );
}
