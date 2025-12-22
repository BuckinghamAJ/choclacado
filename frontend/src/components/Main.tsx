import {
  Accessor,
  createMemo,
  createResource,
  createSignal,
  Suspense,
  useContext,
} from "solid-js";
import Filter from "./Filter";
import MKInput from "./ui/mk-input";
import { PostContext, UserContext, UtilityContext } from "./context/create";
import Posts from "./Posts";
import { ShareSideBar } from "./Share";
import MKDialog, { AreYouSureDialog } from "./MKDialog";

export default function Main() {
  const { singlePost, filteredPosts } = useContext(PostContext);
  const {
    openDialog,
    dialogMode,
    search,
    setSearch,
    openYouSureDialog,
    handleDelete,
  } = useContext(UtilityContext);

  const userId: string = useContext(UserContext) as string;

  return (
    <div class="flex overflow-x-hidden">
      <main class="w-full h-full mx-auto text-gray-700 p-4 relative bg-neutral-50 overflow-hidden">
        <div class="w-full self-stretch px-12 inline-flex justify-start items-start gap-2.5">
          <div class="flex-1 inline-flex flex-col justify-start items-start w-full gap-2.5">
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
            <div class="pt-2 flex-row w-full flex">
              <Filter />
              <Suspense fallback={"Loading..."}>
                <Posts posts={filteredPosts} currentUserID={userId} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <ShareSideBar post={singlePost}></ShareSideBar>
      <MKDialog open={openDialog} post={singlePost} mode={dialogMode} />
      <AreYouSureDialog
        open={openYouSureDialog}
        onCancel={() => handleDelete(false)}
        onConfirm={() => handleDelete(true)}
      />
    </div>
  );
}
