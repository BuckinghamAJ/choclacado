import {
  Accessor,
  createEffect,
  createSignal,
  Show,
  useContext,
} from "solid-js";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Post } from "./Posts";
import { CloseIcon, ExternalLinkIcon } from "./ui/icons";
import { UtilityContext } from "./context/create";
import MKInput from "./ui/mk-input";
import { action, useAction, useSubmission } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { auth } from "~/lib/auth";
import ResourceSelect, { getResourceId } from "./ResourceSelect";
import { showToast } from "./ui/toast";
import MKContent from "./Content";

type MKDialogProps = {
  open: Accessor<boolean>;
  post: Accessor<Post>;
  mode: Accessor<string>;
};

export default function MKDialog({ open, post, mode }: MKDialogProps) {
  return (
    <Show
      when={mode() == "edit"}
      fallback={<MKDialogView open={open} post={post} />}
    >
      <MKDialogEdit open={open} post={post} />
    </Show>
  );
}

type MKDialogViewProps = {
  open: Accessor<boolean>;
  post: Accessor<Post>;
};

export function MKDialogView({ open, post }: MKDialogViewProps) {
  return (
    <Dialog open={open()}>
      <DialogContent class="sm:max-w-[425px] lg:max-w-1/2  bg-white text-black">
        <DialogHeader>
          <DialogTitle>{post().Title}</DialogTitle>
          <DialogDescription class="text-black pt-2">
            {post().Description}
          </DialogDescription>
          <DialogClose />
        </DialogHeader>

        <Show when={post().Url}>
          <div class="w-fit justify-start text-slate-900 text-base font-bold font-['Inter'] underline leading-7">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={post().Url!}
              class="inline-flex gap-2 align-middle items-center leading-7 w-fit"
            >
              <ExternalLinkIcon />
              View article
            </a>
          </div>
        </Show>

        <Show when={post().Content}>
          <MKContent displayContent={post().Content ?? undefined} displayOnly />
        </Show>
      </DialogContent>
    </Dialog>
  );
}

function DialogClose() {
  const { setOpenDialog } = useContext(UtilityContext);

  return (
    <Button
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      aria-label="Close sidebar"
      class="text-black absolute top-0 right-0 hover:cursor-pointer hover:border-slate-500"
      onClick={() => setOpenDialog(false)}
    >
      <CloseIcon />
    </Button>
  );
}
const GO_API_URL = process.env.GO_API_URL || "http://api:7373";

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

export function MKDialogEdit({ open, post }: MKDialogViewProps) {
  const [title, setTitle] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [url, setUrl] = createSignal("");
  const [resource, setResource] = createSignal("");

  const updatePostAction = useAction(updatePost);
  const updatePostSubmission = useSubmission(updatePost);
  const [sentUpdate, setSentUpdate] = createSignal(false);

  createEffect(() => {
    const p = post();
    setTitle(p?.Title || "");
    setDescription(p?.Description || "");
    setUrl(p?.Url || "");
    setResource(p?.ResourceType || "");
  });

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

  return (
    <Dialog open={open()}>
      <DialogContent class="sm:max-w-[425px] lg:max-w-1/2  bg-white text-black">
        <DialogHeader>
          <div class="pr-5 justify-start text-slate-900 text-sm font-medium font-['Inter'] leading-5 gap-1.5">
            <span>Resource Type</span>
            <div class="pt-2">
              <ResourceSelect resource={resource} setResource={setResource} />
            </div>
          </div>
          <DialogTitle class="pt-2">
            <MKInput
              label="Title"
              placeholder="Enter a descriptive title"
              type="text"
              inputSignal={title}
              inputSignalSetter={setTitle}
              required
            ></MKInput>
          </DialogTitle>
          <DialogDescription class="text-black pt-2">
            <MKInput
              label="Description"
              placeholder="Enter a descriptive title"
              type="textarea"
              inputSignal={description}
              inputSignalSetter={setDescription}
              required
            ></MKInput>
          </DialogDescription>
          <DialogClose />
        </DialogHeader>

        <div class="p-2 w-full">
          <MKInput
            label="Article URL"
            placeholder="https://example.com"
            type="url"
            inputSignal={url}
            inputSignalSetter={setUrl}
          ></MKInput>
        </div>

        <Show when={post().Content !== null}>
          <div class="text-black"></div>
        </Show>

        <DialogFooter>
          <Button
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
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type AreYouSureDialogProps = {
  open: Accessor<{
    isOpen: boolean;
    resolve?: (value: boolean) => void;
  }>;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  message?: string;
};

export function AreYouSureDialog({
  open,
  onConfirm,
  onCancel,
  message,
}: AreYouSureDialogProps) {
  return (
    <Dialog open={open().isOpen}>
      <DialogContent class="sm:max-w-[350px] bg-white text-black">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <div class="py-4">
          {message ?? "Are you sure you want to delete this resource?"}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Yes, I'm sure
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
