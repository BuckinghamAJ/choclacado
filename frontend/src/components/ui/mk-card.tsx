import { For, Match, Show, Switch } from "solid-js";
import MKIcon from "./icons";
import { Badge } from "./badge";

type MKCardProps = {
  title: string;
  description: string;
  resourceType: string;
  postedByUser: string;
  url: string | null;
  tags: Array<string> | null;
};

export default function MKCard({
  title,
  description,
  resourceType,
  postedByUser,
  url,
  tags,
}: MKCardProps) {
  return (
    <div class="self-stretch pt-2.5 inline-flex justify-start items-start gap-2.5">
      <div class="flex-1 inline-flex flex-col justify-start items-start gap-2.5">
        <div class="self-stretch inline-flex justify-between items-center">
          <div class="h-7 p-2 bg-white rounded-[50px] outline-1 outline-offset-[-1px] outline-black/20 flex justify-center items-center gap-2">
            <div class="w-5 h-5 relative overflow-hidden">
              <div class="w-4 h-4 left-[1.67px] top-[1.67px] absolute outline-2 outline-offset-[-1px] outline-black"></div>
            </div>
            <Badge variant="outline">
              <MKIcon resource={resourceType} />
              <Switch>
                <Match when={resourceType == "Articles"}>Article</Match>
                <Match when={resourceType == "Code Snippets"}>
                  Code Snippet
                </Match>
                <Match when={resourceType == "Learning Resources"}>
                  Course
                </Match>
              </Switch>
            </Badge>
          </div>
          <div class="flex justify-start items-center gap-2.5">
            <div class="w-6 h-6 relative overflow-hidden">
              <div class="w-5 h-5 left-[2px] top-[2px] absolute outline-2 outline-offset-[-1px] outline-black"></div>
            </div>
            <div class="w-6 h-6 relative overflow-hidden">
              <div class="w-4 h-5 left-[3px] top-[2px] absolute outline-2 outline-offset-[-1px] outline-black"></div>
            </div>
          </div>
        </div>
        <div class="justify-start text-slate-900 text-lg font-semibold font-['Inter'] leading-7">
          {title}
        </div>
        <div class="self-stretch flex flex-col justify-start items-start gap-2.5">
          <div class="self-stretch justify-start text-slate-900 text-base font-normal font-['Inter'] leading-7">
            {description}
          </div>
          <div class="inline-flex justify-start items-center gap-2">
            <div class="w-5 h-5 relative overflow-hidden">
              <div class="w-3.5 h-3.5 left-[2.50px] top-[2.50px] absolute outline outline-2 outline-offset-[-1px] outline-black"></div>
            </div>
            <div class="justify-start text-slate-900 text-base font-bold font-['Inter'] underline leading-7">
              <Show when={url !== null} fallback={<p>by {postedByUser}</p>}>
                <a target="_blank" rel="noopener noreferrer" href={url!}>
                  View article
                </a>
              </Show>
            </div>
          </div>
        </div>
        <div class="self-stretch pt-1 pb-2 flex flex-col justify-start items-start gap-2.5">
          <div class="inline-flex justify-start items-start gap-2.5">
            <For each={tags}>
              {(tag) => <Badge variant="outline">{tag}</Badge>}
            </For>
          </div>
        </div>
      </div>
    </div>
  );
}
