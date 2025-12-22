import {
  For,
  Match,
  Show,
  Switch,
  useContext,
  createEffect,
  on,
  createSignal,
} from "solid-js";
import MKIcon, {
  ExternalLinkIcon,
  AvatarIcon,
  EditIcon,
  DeleteIcon,
} from "./icons";
import { Badge } from "./badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Separator } from "./separator";
import { Flex } from "./flex";
import { Button } from "./button";
import { auth } from "~/lib/auth";
import { getRequestEvent } from "solid-js/web";
import { action, useAction, useSubmission } from "@solidjs/router";
import { PostContext, UserContext, UtilityContext } from "../context/create";
import { showToast } from "./toast";
import { Post } from "../Posts";
import { useSidebar } from "./sidebar";

type MKCardProps = {
  id: number;
  title: string;
  description: string;
  resourceType: string;
  postedByUser: string;
  url: string | null;
  tags: Array<string> | null;
  showEditDelete: () => boolean;
};

export default function MKCard({
  id,
  title,
  description,
  resourceType,
  postedByUser,
  url,
  tags,
  showEditDelete,
}: MKCardProps) {
  const { setOpenDialog, setDialogMode } = useContext(UtilityContext);
  const { posts, setSinglePost } = useContext(PostContext);
  const { open: sideBarOpen } = useSidebar();

  return (
    <Card
      class="flex-1 inline-flex flex-col justify-star p-2.5 items-start gap-2.5 w-[26vw] hover:shadow-2xl hover:cursor-pointer hover:border-4"
      onClick={() => {
        if (!sideBarOpen()) {
          const post = posts()?.find((p: Post) => p.ID === id);
          setSinglePost(post);
          setDialogMode("view");
          setOpenDialog(true);
        }
      }}
    >
      <CardHeader class="self-stretch inline-flex items-start justify-start px-6 pt-6 pb-2">
        <Flex flexDirection="row">
          <MKCardHeaderBadge resourceType={resourceType} />
          <Show when={showEditDelete()}>
            <EditDelete postId={id} />
          </Show>
        </Flex>

        <CardTitle class="justify-start text-slate-900 text-lg font-['Inter'] leading-7 font-bold!">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent class="self-stretch flex flex-col justify-start items-start gap-2.5">
        <div class="self-stretch justify-start text-slate-900 text-base font-normal font-['Inter'] leading-7">
          {description}
        </div>
        <div class="justify-start text-slate-900 text-base font-bold font-['Inter'] underline leading-7 ">
          <Show when={url}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={url!}
              class="inline-flex gap-1 align-middle items-center leading-7"
              onClick={(e: MouseEvent) => e.stopPropagation()}
            >
              <ExternalLinkIcon />
              View article
            </a>
          </Show>
          <Show when={tags != null && tags.length > 0 && tags[0] != null}>
            <div class="inline-flex justify-start items-start gap-2.5">
              <For each={tags}>
                {(tag) => (
                  <Badge variant="outline" class="rounded-lg">
                    {tag}
                  </Badge>
                )}
              </For>
            </div>
          </Show>
        </div>
      </CardContent>
      <Separator />
      <CardFooter class="self-stretch pt-1 pb-2 justify-start items-start gap-2.5 inline-flex ">
        <AvatarIcon />
        <p class="text-center justify-start text-black  font-normal font-['Inter'] leading-7 text-lg">
          {postedByUser}
        </p>
      </CardFooter>
    </Card>
  );
}

const GO_API_URL = process.env.GO_API_URL || "http://api:7373";

const deletePost = action(async (id: number, userId: string) => {
  "use server";

  const event = getRequestEvent();
  const rHeaders = new Headers(event?.request.headers);

  const { token } = await auth.api.getToken({
    headers: rHeaders,
  });

  const rheaders = new Headers();
  rheaders.set("Authorization", `Bearer ${token}`);
  rheaders.set("Content-Type", "application/json");

  const newPostUrl = new URL(`/api/posts/${id}`, GO_API_URL);
  const rsp = await fetch(newPostUrl.toString(), {
    method: "DELETE",
    headers: rheaders,
    body: JSON.stringify({
      user: userId,
    }),
  });

  if (!rsp.ok) {
    throw Error("Issue deleting post");
  }

  return { status: "ok" };
});

type EditDeleteProps = {
  postId: number;
};

function EditDelete({ postId }: EditDeleteProps) {
  const userId: string = useContext(UserContext) as string;

  const deletePostAction = useAction(deletePost);
  const deletePostSubmission = useSubmission(deletePost);

  const [sendToast, setSendToast] = createSignal(false);

  const { posts, setSinglePost, refetch } = useContext(PostContext);
  const { confirmDelete } = useContext(UtilityContext);

  const { toggleSidebar } = useSidebar();

  createEffect(() => {
    if (sendToast()) {
      if (deletePostSubmission.error !== undefined) {
        console.log("error!", deletePostSubmission.error);
        showToast({
          variant: "error",
          title: "Problem!",
          description: "Could Not Delete Post",
        });
      }
      if (deletePostSubmission.result !== undefined) {
        showToast({
          variant: "default",
          title: "Delete",
          description: "Post was successfully deleted",
        });
        refetch();
      }

      setSendToast(false);
    }
  });

  return (
    <Flex alignItems="end" flexDirection="row" justifyContent="end">
      <Button
        variant="ghost"
        class="w-2"
        onClick={(e: MouseEvent) => {
          e.stopPropagation();
          const post = posts()?.find((p: Post) => p.ID === postId);
          console.log(post);
          setSinglePost(post);
          toggleSidebar();
        }}
      >
        <EditIcon />
      </Button>
      <Button
        variant="ghost"
        class="w-2 delete-icon"
        onClick={async (e: MouseEvent) => {
          e.stopPropagation();
          const confirmed = await confirmDelete();
          if (!confirmed) return;

          await deletePostAction(postId, userId);
          setSendToast(true);
        }}
      >
        <DeleteIcon />
      </Button>
    </Flex>
  );
}

type MKHeaderBadgeProps = {
  resourceType: string;
};

function MKCardHeaderBadge({ resourceType }: MKHeaderBadgeProps) {
  return (
    <Badge variant="outline" class="rounded-xl">
      <MKIcon resource={resourceType} />
      <Switch>
        <Match when={resourceType == "Articles"}>
          <span class="ml-1 w-max">Article</span>
        </Match>
        <Match when={resourceType == "Code Snippets"}>
          <span class="ml-1 w-max">Code Snippet </span>
        </Match>
        <Match when={resourceType == "Learning Resources"}>
          <span class="ml-1 w-max"> Course</span>
        </Match>
      </Switch>
    </Badge>
  );
}
