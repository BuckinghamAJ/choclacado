import { Accessor, Show, useContext } from "solid-js";
import MKInput from "./ui/mk-input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar";
import { createSignal, createEffect } from "solid-js";
import { Button } from "./ui/button";
import { CloseIcon } from "./ui/icons";
import { Flex } from "./ui/flex";
import { action, useAction, useSubmission } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { auth } from "~/lib/auth";
import { showToast } from "./ui/toast";
import { PostContext } from "./context/create";
import ResourceSelect, { getResourceId } from "./ResourceSelect";
import { Post } from "./Posts";
import MKContent from "./Content";

export default function ShareResource() {
  const { setOpenMobile, setOpen, isMobile, toggleSidebar } = useSidebar();

  const { setSinglePost } = useContext(PostContext);

  const handleShareClick = () => {
    setSinglePost(undefined);

    if (isMobile()) {
      setOpenMobile(true);
    } else {
      setOpen(true);
    }
  };

  return (
    // TODO: Make a async to make a post
    // Make backend endpoint
    // Should I make an effect that will update the posts after sharing the resource?
    <div class="w-48 px-4 py-2 bg-slate-900 rounded-md flex justify-center items-center gap-2.5 hover:cursor-pointer hover:bg-slate-800">
      <button
        class="w-full justify-start text-white text-sm font-medium font-['Inter'] leading-6 hover:cursor-pointer"
        onClick={handleShareClick}
      >
        Share Resource
      </button>
    </div>
  );
}

const NEW_POST_ENDPOINT = "/api/posts";
const GO_API_URL = process.env.GO_API_URL || "http://api:7373";

const submitNewPost = action(
  async (
    title: string,
    description: string,
    url: string,
    resource: number,
    content: string,
  ) => {
    "use server";
    const event = getRequestEvent();
    const rHeaders = new Headers(event?.request.headers);

    const { token } = await auth.api.getToken({
      headers: rHeaders,
    });

    const rheaders = new Headers();
    rheaders.set("Authorization", `Bearer ${token}`);
    rheaders.set("Content-Type", "application/json");

    const newPostUrl = new URL(NEW_POST_ENDPOINT, GO_API_URL);
    const rsp = await fetch(newPostUrl.toString(), {
      method: "POST",
      headers: rheaders,
      body: JSON.stringify({
        title: title,
        description: description,
        resource: resource,
        url: url,
        content: content,
      }),
    });

    if (!rsp.ok) {
      throw Error("Error submitting a resource post");
    }

    const data = await rsp.json();
    if ("error" in data) {
      throw Error("Error submitting a resource post");
    }

    return data;
  },
  "newPost",
);

type ShareSideBarProps = {
  post: Accessor<Post>;
};

const updatePost = action(
  async (
    title: string,
    description: string,
    url: string,
    resource: string,
    post: Post,
  ) => {
    "use server";

    const event = getRequestEvent();
    const rHeaders = new Headers(event?.request.headers);

    const { token } = await auth.api.getToken({
      headers: rHeaders,
    });

    const rheaders = new Headers();
    rheaders.set("Authorization", `Bearer ${token}`);
    rheaders.set("Content-Type", "application/json");

    // Need to add the ID to URL, and content etc.
    const updatePostUrl = new URL(`/api/posts/${post.ID}`, GO_API_URL);
    const rsp = await fetch(updatePostUrl.toString(), {
      method: "PATCH",
      headers: rheaders,
      body: JSON.stringify({
        title: title,
        description: description,
        url: url,
        content: post.Content,
        resource: getResourceId(resource),
        user: post.Accountposted,
      }),
    });

    if (!rsp.ok) {
      throw Error("Error updating a resource post");
    }

    const data = await rsp.json();
    if ("error" in data) {
      throw Error("Error updating a resource post");
    }

    return { status: "Ok" };
  },
);

export function ShareSideBar({ post }: ShareSideBarProps) {
  const { refetch } = useContext(PostContext);

  const [title, setTitle] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [tags, setTags] = createSignal<string[]>(); // TODO: Figure out how to go about this
  const [url, setUrl] = createSignal("");
  const [resource, setResource] = createSignal("");
  const [content, setContent] = createSignal<string>("");

  const [toUpdate, setToUpdate] = createSignal(false);

  const [errMsg, setErrMsg] = createSignal<string>();

  const updatePostAction = useAction(updatePost);
  const updatePostSubmission = useSubmission(updatePost);
  const [sentUpdate, setSentUpdate] = createSignal(false);

  createEffect(() => {
    if (
      sentUpdate() &&
      !updatePostSubmission.error &&
      updatePostSubmission.result
    ) {
      showToast({
        variant: "success",
        title: "Success!",
        description: "Post Updated.",
      });
      refetch();
      setSentUpdate(false);
    }

    if (sentUpdate() && updatePostSubmission.error) {
      showToast({
        variant: "error",
        title: "Problem!",
        description: "There was an issue updating the post.",
      });
    }
  });

  createEffect(() => {
    const p = post();
    setTitle(p?.Title || "");
    setDescription(p?.Description || "");
    setUrl(p?.Url || "");
    setResource(p?.ResourceType || "");
    setTags(p?.Tags || []);
    setContent(p?.Content || "");

    if (p?.Title && p?.Description) {
      setToUpdate(true);
    } else {
      setToUpdate(false);
    }
  });

  const { posts, mutatePosts } = useContext(PostContext);

  const [sentSubmission, setSentSubmission] = createSignal(false);

  const sendNewPostAction = useAction(submitNewPost);
  const newPostSubmission = useSubmission(submitNewPost);

  const { toggleSidebar } = useSidebar();

  const clearInput = () => {
    setTitle("");
    setDescription("");
    setUrl("");
    setResource("");
    setContent("");
  };

  createEffect(() => {
    if (
      sentSubmission() &&
      !newPostSubmission.error &&
      newPostSubmission.result
    ) {
      mutatePosts(newPostSubmission.result);
      showToast({
        variant: "success",
        title: "Success!",
        description: "Resource Added.",
      });
      clearInput();
      setSentSubmission(false);
    }

    if (sentSubmission() && newPostSubmission.error) {
      showToast({
        variant: "error",
        title: "Problem!",
        description: "Could Not Submit a new resource post",
      });
    }
  });

  return (
    <>
      <SidebarTrigger class="hidden" />

      <Sidebar
        side="right"
        variant="floating"
        collapsible="offcanvas"
        class="p-4 bg-white rounded-md shadow-[0px_4px_6px_0px_rgba(0,0,0,0.09)] outline-1 outline-slate-100 lg:mt-24 lg:mr-8 overflow-hidden h-[87lvh]"
      >
        <SidebarHeader>
          <span class="justify-start text-slate-900 text-lg font-semibold font-['Inter'] leading-7">
            Share a resource
          </span>
          <div class="self-stretch justify-start text-slate-900 text-base font-normal font-['Inter'] leading-7">
            Contribute to the knowledge base by sharing valuable content
          </div>

          <Button
            data-sidebar="trigger"
            variant="ghost"
            size="icon"
            aria-label="Close sidebar"
            class="text-black absolute top-0 right-0 hover:cursor-pointer hover:border-slate-500"
            onClick={(event: MouseEvent) => toggleSidebar()}
          >
            <CloseIcon />
          </Button>
        </SidebarHeader>
        <SidebarContent class="inline-flex flex-col justify-start items-start gap-4 w-full overflow-auto">
          {/* Drop down for Type*/}

          <ResourceSelect resource={resource} setResource={setResource} />
          <Show when={errMsg() !== undefined}>
            <div class="text-red-600 text-xs font-medium mt-2">
              Please select a resource type.
            </div>
          </Show>

          <div class="p-2 w-full">
            <MKInput
              label="Title"
              placeholder="Enter a descriptive title"
              type="text"
              inputSignal={title}
              inputSignalSetter={setTitle}
              required
            ></MKInput>
          </div>
          <div class="p-2 w-full">
            <MKInput
              label="Description"
              placeholder="Enter a descriptive title"
              type="textarea"
              inputSignal={description}
              inputSignalSetter={setDescription}
              required
            ></MKInput>
          </div>

          <div class="p-2 w-full">
            <MKInput
              label="Tags"
              placeholder="Add tags"
              type="tags"
              inputSignal={tags}
              inputSignalSetter={setTags}
            ></MKInput>
            {/* Add a button*/}
          </div>

          <Show when={resource() !== "Code Snippets"}>
            <div class="p-2 w-full">
              <MKInput
                label="Article URL"
                placeholder="https://example.com"
                type="url"
                inputSignal={url}
                inputSignalSetter={setUrl}
              ></MKInput>
            </div>
          </Show>

          <Show when={resource() == "Code Snippets"}>
            <MKContent content={content} setContent={setContent} />
          </Show>
        </SidebarContent>
        <SidebarFooter>
          <Flex class="justify-end-safe gap-2">
            <Button
              variant="ghost"
              class="leading-6 text-black text-sm px-4 py-2 w-1/2 bg-white rounded-md outline-1 -outline-offset-1 outline-black/10 "
              onClick={(event: MouseEvent) => toggleSidebar()}
            >
              Close
            </Button>

            <Show
              when={toUpdate()}
              fallback={
                <ShareButton
                  onClick={async () => {
                    const resourceId = getResourceId(resource());
                    if (resourceId == undefined) {
                      setErrMsg("Please Select a Resource Type");
                      return;
                    }

                    setErrMsg(undefined);

                    setSentSubmission(true);
                    await sendNewPostAction(
                      title(),
                      description(),
                      url(),
                      resourceId,
                      content(),
                    );
                  }}
                >
                  Share
                </ShareButton>
              }
            >
              <ShareButton
                onClick={async () => {
                  await updatePostAction(
                    title(),
                    description(),
                    url(),
                    resource(),
                    post(),
                  );

                  setSentUpdate(true);
                }}
              >
                Update Resource
              </ShareButton>
            </Show>
          </Flex>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}

type ShareButtonProps = {
  onClick: (event: MouseEvent) => void | Promise<void>;
  children: string;
};

function ShareButton({ onClick, children }: ShareButtonProps) {
  return (
    <Button
      variant="default"
      class="px-4 py-2 w-1/2 rounded-md opacity-50 bg-slate-900"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
