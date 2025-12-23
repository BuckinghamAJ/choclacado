import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import ShareResource from "./Share";
import { AvatarIcon, BookmarkIcon, LogOutIcon, MKLogoIcon } from "./ui/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { Flex } from "./ui/flex";
import authClient from "~/lib/auth-client";

type NavProps = {
  user: any;
};

export default function Nav({ user }: NavProps) {
  const [error, setError] = createSignal("");
  const navigate = useNavigate();

  const handleLogout = async (e: Event) => {
    e.preventDefault();
    setError("");

    try {
      await authClient.signOut();

      navigate("/login");
    } catch {
      setError("Invalid email or password. Please try again.");
    }
  };

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
          <div class="text-center justify-start text-black text-base font-normal font-['Inter'] leading-7">
            <NavigationMenu orientation="horizontal">
              <NavigationMenuItem>
                <NavigationMenuTrigger class="text-center justify-start text-black text-base font-normal font-['Inter'] leading-7">
                  <AvatarIcon />
                  {user()?.Name}
                </NavigationMenuTrigger>
                <NavigationMenuContent class="w-max min-w-fit">
                  <NavigationMenuLink class="w-max min-w-fit">
                    <Flex>
                      <BookmarkIcon />
                      <span class="ml-1">Your Shared Resources</span>
                    </Flex>
                  </NavigationMenuLink>

                  <NavigationMenuLink
                    class="w-max min-w-fit"
                    onClick={handleLogout}
                  >
                    <Flex>
                      <LogOutIcon />
                      <span class="ml-1">Logout</span>
                    </Flex>
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
