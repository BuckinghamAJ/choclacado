import { createSignal, For, Resource } from "solid-js";
import MKCard from "./ui/mk-card";
import { Grid } from "./ui/grid";

type PostsProp = {
  posts: Resource<any>;
  currentUserID: string;
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
  Accountposted: string; // ID of post
};

export default function Posts({ posts, currentUserID }: PostsProp) {
  return (
    // TODO: Sort out the cards columns ADD GRID!
    <Grid
      cols={1}
      colsMd={2}
      colsLg={3}
      class="w-full justify-start items-start gap-4 overflow-y-visible"
    >
      <For each={posts()}>
        {(post) => (
          <SinglePost
            post={post}
            ownPost={currentUserID == post.Accountposted}
          />
        )}
      </For>
    </Grid>
  );
}

type PostProps = {
  post: Post;
  ownPost: boolean;
};

function SinglePost({ post, ownPost }: PostProps) {
  return (
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
      <MKCard
        id={post.ID}
        title={post.Title}
        description={post.Description}
        resourceType={post.ResourceType}
        url={post.Url}
        tags={post.Tags}
        postedByUser={post.PostedBy}
        showEditDelete={ownPost}
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
      postedByUser={post.PostedBy}
      showEditDelete={false}
    ></MKCard>
  );
}
