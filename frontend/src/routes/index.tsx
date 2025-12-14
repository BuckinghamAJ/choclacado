import { A, createAsync, query, redirect, useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import Posts, { Post } from "~/components/Posts";

import Filter from "~/components/Filter";
import MKInput from "~/components/ui/mk-input";
import verifyUser from "~/lib/queries";
import { ShareSideBar } from "~/components/Share";

export default function Home() {
  const authUser = createAsync(() => verifyUser());
  const [posts, setPosts] = createSignal<Post[]>([]);
  const [search, setSearch] = createSignal("");

  // TODO: Place Value to fetch posts

  return (
    <div class="flex">
      <main class="w-full bg-white h-lvh mx-auto text-gray-700 p-4 relative bg-neutral-50 overflow-hidden">
        <div class="w-full self-stretch px-12 inline-flex justify-start items-start gap-2.5">
          <div class="flex-1 inline-flex flex-col justify-start items-start gap-2.5">
            <div class="self-stretch h-9 justify-start text-slate-900 text-3xl font-semibold font-['Inter'] leading-9">
              Discover Resources
            </div>
            <div class="self-stretch h-9 justify-start text-slate-900 text-xl font-normal font-['Inter'] leading-7">
              Explore shared knowledge from our community
            </div>
            <MKInput
              label=""
              placeholder="Search resources..."
              inputSignal={search}
              inputSignalSetter={setSearch}
              type="text"
            ></MKInput>
            <Filter />
            <Posts posts={posts()} />
          </div>
        </div>
      </main>
      <ShareSideBar></ShareSideBar>
    </div>
  );
}
