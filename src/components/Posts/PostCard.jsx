import PostAction from "./PostAction";
import PostBody from "./PostBody";
import PostComment from "./PostComments";
import PostHeader from "./PostHeader";

export default function PostCard({post}) {
  return (
     <article class="card mt-6 lg:mt-8">
      <PostHeader post={post} />
      <PostBody poster={post?.image} content={post?.content} />
      <PostAction post={post} commentCount={post?.comments?.length} />
      <PostComment post={post} />
    </article>
  );
}
