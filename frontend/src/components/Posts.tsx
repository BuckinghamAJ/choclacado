import { createSignal, For } from "solid-js";
import MKCard from "./ui/mk-card";

type PostsProp = {
  posts: Array<Post>;
};

export type Post = {
  ID: number;
  Title: string;
  Description: string;
  Accountposted: string;
  Createdate: string; // Timestamptz → ISO timestamp string
  Updatedate: string; // Timestamptz → ISO timestamp string
  Resourcetype: string;
  Url: string | null; // pgtype.Text
  Content: string | null; // pgtype.Text
  Tags: Array<string> | null;
};

export default function Posts({ posts }: PostsProp) {
  return (
    <div class="self-stretch inline-flex flex-col justify-start items-start gap-4">
      <For each={posts}>{(post) => <SinglePost post={post} />}</For>
    </div>
  );
}

type PostProps = {
  post: Post;
};

function SinglePost({ post }: PostProps) {
  return (
    <MKCard
      title={post.Title}
      description={post.Description}
      resourceType={post.Resourcetype}
      url={post.Url}
      tags={post.Tags}
      postedByUser={post.Accountposted}
    ></MKCard>
  );
}
