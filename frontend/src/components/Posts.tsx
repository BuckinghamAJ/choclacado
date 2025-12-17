import { createSignal, For } from "solid-js";
import MKCard from "./ui/mk-card";

type PostsProp = {
  posts: Array<Post>;
};

export type Post = {
  ID: number;
  Title: string;
  Description: string;
  PostedBy: string;
  Createdate: string; // Timestamptz → ISO timestamp string
  Updatedate: string; // Timestamptz → ISO timestamp string
  ResourceType: string;
  Url: string | null; // pgtype.Text
  Content: string | null; // pgtype.Text
  Tags: Array<string> | null;
};

export default function Posts({ posts }: PostsProp) {
  return (
    // TODO: Sort out the cards columns ADD GRID!
    <div class="w-full self-stretch inline-flex justify-start items-start gap-4 overflow-hidden">
      <For each={posts}>{(post) => <SinglePost post={post} />}</For>
    </div>
  );
}

type PostProps = {
  post: Post;
};

function SinglePost({ post }: PostProps) {
  // TODO: Update MKCard to utilize the card.tsx
  return (
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
      <MKCard
        title={post.Title}
        description={post.Description}
        resourceType={post.ResourceType}
        url={post.Url}
        tags={post.Tags}
        postedByUser={post.PostedBy}
      ></MKCard>
    </div>
  );
}

function SinglePostDetail({ post }: PostProps) {
  // TODO: Add Markdown Rendering, w/ highlight.js
  // https://chatgpt.com/share/693c746c-9868-8009-8b65-9354672eb332 (discussion)
  return (
    <MKCard
      title={post.Title}
      description={post.Description}
      resourceType={post.ResourceType}
      url={post.Url}
      tags={post.Tags}
      postedByUser={post.Accountposted}
    ></MKCard>
  );
}
