import {
  A,
  createAsync,
  createAsyncStore,
  query,
  redirect,
  revalidate,
  useNavigate,
} from "@solidjs/router";
import {
  createContext,
  createEffect,
  createMemo,
  createResource,
  createSignal,
  Suspense,
} from "solid-js";
import Posts, { Post } from "~/components/Posts";

import Filter from "~/components/Filter";
import MKInput from "~/components/ui/mk-input";
import verifyUser from "~/lib/queries";
import { ShareSideBar } from "~/components/Share";
import Nav from "~/components/Nav";
import { getRequestEvent } from "solid-js/web";
import { auth } from "~/lib/auth";
import { PostContext, UserContext } from "~/components/context/create";
import Main from "~/components/Main";
const GET_ALL_POSTS = "/api/posts";
const GO_API_URL = process.env.API_URL || "http://api:7373";

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
  console.log("Data: " + JSON.stringify(data));

  return data;
}, "getAllPosts");

export default function Home() {
  const authUser = createAsync(() => verifyUser());

  const [posts, { mutate, refetch }] = createResource(() => getAllPosts());

  const [openDialog, setOpenDialog] = createSignal(false);

  const mutatePosts = (newPost) => {
    mutate((posts) => [newPost, ...posts]);
  };

  const postById = (postId: number) =>
    createMemo(() => posts()?.find((post: Post) => post.ID === postId));

  const [search, setSearch] = createSignal("");
  const navigate = useNavigate();
  createEffect(() => {
    const user = authUser();
    if (user !== undefined && "error" in user) {
      navigate("/login");
    }
  });

  return (
    <>
      <Nav user={authUser()?.Name} />
      <PostContext.Provider value={{ posts, mutatePosts, refetch, postById }}>
        <UserContext.Provider value={authUser()?.ID}>
          <Main />
        </UserContext.Provider>
      </PostContext.Provider>
    </>
  );
}
