import { useReducer } from "react";
import { initialState, postReducer } from "../reducers/PostReducer";
import { PostContext } from "../context";

const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialState);

  return (
    <PostContext.Provider value={{ state, dispatch }}>
      {children}
    </PostContext.Provider>
  );
};
export default PostProvider;
