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

type signalProps = {
  get: Accessor<any>;
  set: Setter<any>;
};

export function ShareSideBar() {
  const [title, setTitle] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [tags, setTags] = createSignal(""); // TODO: Figure out how to go about this
  const [url, setUrl] = createSignal("");

  // TODO add the post url

  const { toggleSidebar } = useSidebar();

  return (
    <>
      <SidebarTrigger class="hidden" />

      <Sidebar
        side="right"
        variant="floating"
        collapsible="offcanvas"
        class="p-4 bg-white rounded-md shadow-[0px_4px_6px_0px_rgba(0,0,0,0.09)] outline-1 outline-slate-100 lg:mt-24 lg:mr-8 overflow-hidden"
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

          <div class="p-2 w-full">
            <MKInput
              label="Title"
              placeholder="Enter a descriptive title"
              type="text"
              inputSignal={title}
              inputSignalSetter={setTitle}
            ></MKInput>
          </div>
          <div class="p-2 w-full">
            <MKInput
              label="Description"
              placeholder="Enter a descriptive title"
              type="textarea"
              inputSignal={description}
              inputSignalSetter={setDescription}
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
          {/*TODO: FIX!*/}
          <Button class="px-4 py-2">Share</Button>
          <Button class="px-4 py-2">Close</Button>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
