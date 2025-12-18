import { Accessor, Show } from "solid-js";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Post } from "./Posts";
import { ExternalLinkIcon } from "./ui/icons";

type MKDialogProps = {
  open: boolean;
  post: Post;
  canEdit: boolean;
};

export default function MKDialog({
  open,
  post,
  canEdit = false,
}: MKDialogProps) {
  return (
    <Dialog defaultOpen={false} open={open}>
      <DialogContent class="sm:max-w-[425px] lg:max-w-1/2  bg-white text-black">
        <DialogHeader>
          <DialogTitle>{post.Title}</DialogTitle>
          <DialogDescription>{post.Description}</DialogDescription>
        </DialogHeader>

        <Show when={post.Url !== null}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={post.Url!}
            class="inline-flex gap-1 align-middle items-center leading-7"
          >
            <ExternalLinkIcon />
            View article
          </a>
        </Show>

        <Show when={post.Content !== null}>
          <div class="text-black"></div>
        </Show>

        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MKDialogEdit() {
  return <></>;
}
