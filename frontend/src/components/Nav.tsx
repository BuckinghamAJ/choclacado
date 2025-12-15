import { createAsync, useLocation } from "@solidjs/router";
import { Show, Suspense } from "solid-js";
import verifyUser from "~/lib/queries";
import ShareResource from "./Share";
import { useSidebar } from "./ui/sidebar";

export default function Nav() {
  const authUser = createAsync(() => verifyUser());

  return (
    <div class="relative self-stretch w-full px-12 py-4 bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)] inline-flex justify-between items-center z-10">
      <div class="flex justify-start items-center gap-2">
        <div class="w-12 h-12 bg-black rounded-full">
          <svg
            class="relative left-1.5 top-1.5"
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 3V15L19.5 10.5L24 15V3M6 29.25V6.75C6 5.75544 6.39509 4.80161 7.09835 4.09835C7.80161 3.39509 8.75544 3 9.75 3H28.5C28.8978 3 29.2794 3.15804 29.5607 3.43934C29.842 3.72064 30 4.10218 30 4.5V31.5C30 31.8978 29.842 32.2794 29.5607 32.5607C29.2794 32.842 28.8978 33 28.5 33H9.75C8.75544 33 7.80161 32.6049 7.09835 31.9017C6.39509 31.1984 6 30.2446 6 29.25ZM6 29.25C6 28.2554 6.39509 27.3016 7.09835 26.5983C7.80161 25.8951 8.75544 25.5 9.75 25.5H30"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
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
          <div class="w-9 h-9 relative overflow-hidden">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.5 28.993V26.5C8.5 25.7044 8.81607 24.9413 9.37868 24.3787C9.94129 23.8161 10.7044 23.5 11.5 23.5H20.5C21.2956 23.5 22.0587 23.8161 22.6213 24.3787C23.1839 24.9413 23.5 25.7044 23.5 26.5V28.993M31 16C31 24.2843 24.2843 31 16 31C7.71573 31 1 24.2843 1 16C1 7.71573 7.71573 1 16 1C24.2843 1 31 7.71573 31 16ZM20.5 13C20.5 15.4853 18.4853 17.5 16 17.5C13.5147 17.5 11.5 15.4853 11.5 13C11.5 10.5147 13.5147 8.5 16 8.5C18.4853 8.5 20.5 10.5147 20.5 13Z"
                stroke="black"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="text-center justify-start text-black text-base font-normal font-['Inter'] leading-7">
            <Suspense fallback={<div>Loading...</div>}>
              <div>{authUser()?.Name}</div>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
