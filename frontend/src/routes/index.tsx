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
import {
  PostContext,
  UserContext,
  UtilityContext,
} from "~/components/context/create";
import Main from "~/components/Main";
const GET_ALL_POSTS = "/api/posts";
const GO_API_URL = process.env.API_URL || "http://api:7373";

const getAllPosts = query(async () => {
  "use server";
  const event = getRequestEvent();
  const tHeaders = new Headers(event?.request.headers);
  console.log("Get All Posts!");
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

  const [posts, { mutate, refetch }] = createResource(() => getAllPosts());

  const [openDialog, setOpenDialog] = createSignal(false);
  const [dialogMode, setDialogMode] = createSignal("view");

  const [singlePost, setSinglePost] = createSignal<Post>();

  const mutatePosts = (newPost) => {
    mutate((posts) => [newPost, ...posts]);
  };

  const [search, setSearch] = createSignal("");
  const [filterType, setFilterType] = createSignal<string[]>([]);

  const filteredPosts = createMemo(() => {
    const criteria = search().toLowerCase();
    const fType = filterType();
    if (!criteria && fType.length === 0) return posts();

    return posts()?.filter((post: Post) => {
      const matchesSearch =
        post.Title.toLowerCase().includes(criteria) ||
        post.Description.toLowerCase().includes(criteria);

      const matchesType =
        fType.length === 0 || fType.includes(post.ResourceType);

      return matchesSearch && matchesType;
    });
  });

  const navigate = useNavigate();
  createEffect(() => {
    const user = authUser();
    if (user !== undefined && "error" in user) {
      navigate("/login");
    }
  });

  return (
    <>
      <PostContext.Provider
        value={{
          posts,
          mutatePosts,
          refetch,
          singlePost,
          setSinglePost,
          filteredPosts,
        }}
      >
        <UserContext.Provider value={authUser()?.ID}>
          <UtilityContext.Provider
            value={{
              openDialog,
              setOpenDialog,
              dialogMode,
              setDialogMode,
              search,
              setSearch,
              setFilterType,
            }}
          >
            <Nav user={authUser()?.Name} />
            <Main />
          </UtilityContext.Provider>
        </UserContext.Provider>
      </PostContext.Provider>
    </>
  );
}
