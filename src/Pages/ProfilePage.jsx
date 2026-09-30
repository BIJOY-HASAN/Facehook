import { useEffect } from "react";
import useAxios from "../hooks/useAxios";
import { useAuth } from "../hooks/useAuth";
import {useProfile} from "../hooks/useProfile"
import { actions } from "../actions";
import ProfileInfo from "../components/profile/profileInfo";
import MyPosts from "../components/profile/MyPosts";



export default function ProfilePage() {
 const {state, dispatch} = useProfile();
  const { api } = useAxios();
  const { auth } = useAuth();

  useEffect(() => {
    dispatch({type: actions.profile.DATA_FETCHING});
    const fetchProfile = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_SERVER_BASE_URL}/profile/${auth?.user.id}`,
        );
       if(response.status === 200) {
        dispatch({type: actions.profile.DATA_FETCHED, data:response.data});
       }
      } catch (error) {
        console.error(error);
              dispatch({type: actions.profile.DATA_FETCH_ERROR, error:error.message});

      } 
    };
    fetchProfile();
  }, []);

  if(state?.loading) {
    return <div>Fetching your profile data...</div>
  }

  return (
     <>
       <ProfileInfo />
       <MyPosts />

     </>
  )
}
