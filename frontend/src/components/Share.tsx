import { Accessor, Setter } from "solid-js";
import MKInput from "./ui/mk-input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar";
import { createSignal } from "solid-js";
import { Button } from "./ui/button";
import { CloseIcon } from "./ui/icons";
import { Flex } from "./ui/flex";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { action, useAction, useSubmission } from "@solidjs/router";
import goApiClient from "~/lib/go-api-client";
import { getRequestEvent } from "solid-js/web";
import { getCookie } from "vinxi/http";
import authClient from "~/lib/auth-client";
import { auth } from "~/lib/auth";
import { showToast } from "./ui/toast";

export default function ShareResource() {
  const { setOpenMobile, setOpen, isMobile, toggleSidebar } = useSidebar();

  const handleShareClick = () => {
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
        class="justify-start text-white text-sm font-medium font-['Inter'] leading-6 hover:cursor-pointer"
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
  async (title: string, description: string, url: string, resource: number) => {
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
      }),
    });

    if (!rsp.ok) {
      showToast({
        variant: "error",
        title: "Problem!",
        description: "Could Not Submit a new resource post",
      });
      throw Error("Error submitting a resource post");
    }

    const data = await rsp.json();

    console.log("Response new post action: " + JSON.stringify(data));

    showToast({
      variant: "success",
      title: "Success!",
      description: "Resource Added.",
    });

    return data;
  },
  "newPost",
);

const RESOURCE_MAPPING = {
  Articles: 1,
  "Code Snippets": 2,
  "Learning Resources": 3,
} as const; // TODO: Since a quick project this is quick way to do it.

const RESOURCE_TYPES = Object.keys(RESOURCE_MAPPING) as Array<
  keyof typeof RESOURCE_MAPPING
>;

function getResourceId(key: string): number {
  return RESOURCE_MAPPING[key as keyof typeof RESOURCE_MAPPING];
}

export function ShareSideBar() {
  const [title, setTitle] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [tags, setTags] = createSignal(""); // TODO: Figure out how to go about this
  const [url, setUrl] = createSignal("");
  const [resource, setResource] = createSignal("");

  // TODO add the post url
  const sendNewPostAction = useAction(submitNewPost);
  const sendNewPostSubmission = useSubmission(submitNewPost);

  const { toggleSidebar } = useSidebar();

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
        <SidebarContent class="inline-flex flex-col justify-start items-start gap-4 w-full overflow-hidden">
          {/* Drop down for Type*/}

          <Select
            class="w-full text-black"
            value={resource()}
            onChange={setResource}
            options={RESOURCE_TYPES}
            placeholder="Select Resource Type"
            itemComponent={(props) => (
              <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
            )}
          >
            <SelectTrigger aria-label="Resource type" class="w-full">
              <SelectValue<string>>
                {(state) => state.selectedOption()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent />
          </Select>

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
              type="text"
              inputSignal={tags}
              inputSignalSetter={setTags}
            ></MKInput>
            {/* Add a button*/}
          </div>

          <div class="p-2 w-full">
            <MKInput
              label="Article URL"
              placeholder="https://example.com"
              type="url"
              inputSignal={url}
              inputSignalSetter={setUrl}
            ></MKInput>
          </div>
        </SidebarContent>
        <SidebarFooter>
          <Flex class="justify-end-safe gap-2">
            <Button
              variant="ghost"
              class="leading-6 text-black text-sm px-4 py-2 w-1/2 bg-white rounded-md outline-1 -outline-offset-1 outline-black/10 "
            >
              Close
            </Button>
            <Button
              variant="default"
              class="px-4 py-2 w-1/2 rounded-md opacity-50 bg-slate-900"
              onClick={() =>
                sendNewPostAction(
                  title(),
                  description(),
                  url(),
                  getResourceId(resource()),
                )
              }
            >
              Share
            </Button>
          </Flex>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
