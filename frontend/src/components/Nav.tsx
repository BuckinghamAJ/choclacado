import { createAsync, useLocation } from "@solidjs/router";
import { Show, Suspense } from "solid-js";
import verifyUser from "~/lib/queries";
import ShareResource from "./Share";
import { useSidebar } from "./ui/sidebar";
import { AvatarIcon, MKLogoIcon } from "./ui/icons";

type NavProps = {
  user: any;
};

export default function Nav({ user }: NavProps) {
  return (
    <div class="relative self-stretch w-full px-12 py-4 bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)] inline-flex justify-between items-center z-10">
      <div class="flex justify-start items-center gap-2">
        <MKLogoIcon />
        <div class="w-7 h-7 relative overflow-hidden">
          <div class="w-4 h-5 left-[4.36px] top-[2.18px] absolute outline-2 -outline-offset-1 outline-white"></div>
        </div>
        <div class="justify-start text-slate-900 text-xl font-semibold font-['Inter'] leading-7">
          Method Know
        </div>
      </div>
      <div class="flex justify-start items-center gap-4">
        <ShareResource></ShareResource>
        <div class="flex justify-start items-center gap-[3px]">
          <AvatarIcon />
          <div class="text-center justify-start text-black text-base font-normal font-['Inter'] leading-7">
            <div>{user}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
