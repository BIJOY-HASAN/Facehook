import { useProfile } from "../../hooks/useProfile";
import PostList from "../Posts/PostList";

export default function MyPosts() {
  const { state } = useProfile();
  const posts = state?.posts;
  return (
    <>
      <h4 class="mt-6 text-xl lg:mt-8 lg:text-2xl">Your Posts</h4>
      <PostList posts={posts} />
    </>
  );
}
