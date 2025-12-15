import { A, createAsync, query, redirect, useNavigate } from "@solidjs/router";
import { createEffect, createSignal } from "solid-js";
import Posts, { Post } from "~/components/Posts";

import Filter from "~/components/Filter";
import MKInput from "~/components/ui/mk-input";
import verifyUser from "~/lib/queries";
import { ShareSideBar } from "~/components/Share";
import Nav from "~/components/Nav";
import { getRequestEvent } from "solid-js/web";
import { auth } from "~/lib/auth";

const GET_ALL_POSTS = "/api/posts";
const GO_API_URL = process.env.GO_API_URL || "http://api:7373";

const getAllPosts = query(async () => {
  "use server";
  const event = getRequestEvent();
  const tHeaders = new Headers(event?.request.headers);

  const { token } = await auth.api.getToken({
    headers: tHeaders,
  });

  const rheaders = new Headers();
  rheaders.set("Authorization", `Bearer ${token}`);
  rheaders.set("Content-Type", "application/json");

  const newPostUrl = new URL(GET_ALL_POSTS, GO_API_URL);
  const rsp = await fetch(newPostUrl.toString(), {
    method: "GET",
    headers: rheaders,
  });

  if (!rsp.ok) {
    throw Error("Error grabbing posts!");
  }

  const data = await rsp.json();

  return data;
}, "getAllPosts");

export default function Home() {
  const authUser = createAsync(() => verifyUser());
  const posts = createAsync(() => getAllPosts());

  const [search, setSearch] = createSignal("");
  const navigate = useNavigate();
  createEffect(() => {
    if ("error" in authUser()) {
      navigate("/login");
    }
  });

  // TODO: Place Value to fetch posts

  return (
    <>
      <Nav />
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
    </>
  );
}
