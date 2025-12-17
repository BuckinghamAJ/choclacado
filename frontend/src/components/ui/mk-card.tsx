import { For, Match, Show, Switch } from "solid-js";
import MKIcon, { ExternalLinkIcon, AvatarIcon } from "./icons";
import { Badge } from "./badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./card";
import { Separator } from "./separator";

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
    <Card class="flex-1 inline-flex flex-col justify-star p-2.5 items-start gap-2.5 w-[26vw]">
      <CardHeader class="self-stretch inline-flex items-start justify-start px-6 pt-6 pb-2">
        <Badge variant="outline" class="rounded-xl">
          <MKIcon resource={resourceType} />
          <Switch>
            <Match when={resourceType == "Articles"}>
              <span class="ml-1">Article</span>
            </Match>
            <Match when={resourceType == "Code Snippets"}>
              <span class="ml-1">Code Snippet </span>
            </Match>
            <Match when={resourceType == "Learning Resources"}>
              <span class="ml-1"> Course</span>
            </Match>
          </Switch>
        </Badge>
        <CardTitle class="justify-start text-slate-900 text-lg font-['Inter'] leading-7 font-bold!">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent class="self-stretch flex flex-col justify-start items-start gap-2.5">
        <div class="self-stretch justify-start text-slate-900 text-base font-normal font-['Inter'] leading-7">
          {description}
        </div>
        <div class="justify-start text-slate-900 text-base font-bold font-['Inter'] underline leading-7 ">
          <Show when={url !== null}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={url!}
              class="inline-flex gap-1 align-middle items-center leading-7"
            >
              <ExternalLinkIcon />
              View article
            </a>
          </Show>
          <Show when={tags != null && tags.length > 0 && tags[0] != null}>
            <div class="inline-flex justify-start items-start gap-2.5">
              <For each={tags}>
                {(tag) => (
                  <Badge variant="outline" class="rounded-lg">
                    {tag}
                  </Badge>
                )}
              </For>
            </div>
          </Show>
        </div>
      </CardContent>
      <Separator />
      <CardFooter class="self-stretch pt-1 pb-2 justify-start items-start gap-2.5 inline-flex ">
        <AvatarIcon />
        <p class="text-center justify-start text-black  font-normal font-['Inter'] leading-7 text-lg">
          {postedByUser}
        </p>
      </CardFooter>
    </Card>
  );
}
