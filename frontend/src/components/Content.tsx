import { Accessor, createSignal, Match, Setter, Show, Switch } from "solid-js";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.min.css";
import { Separator } from "./ui/separator";

type EditableProps = {
  displayOnly?: false;
  content: Accessor<string>;
  setContent: Setter<string>;
};

type DisplayOnlyProps = {
  displayOnly: true;
  displayContent: string;
};

type MKContentProps = EditableProps | DisplayOnlyProps;

const md = new MarkdownIt({
  highlight: (str: string, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs p-2 rounded-md mt-0.5"><code>${hljs.highlight(str, { language: lang }).value}</code></pre>`;
      } catch {}
    }
    return `<pre class="hljs p-2 rounded-md mt-0.5"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

export default function MKContent({
  content,
  setContent,
  displayContent,
  displayOnly = false,
}: MKContentProps) {
  const [isEditing, setIsEditing] = createSignal(true);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
    }
  };

  return (
    <div class="self-stretch flex flex-col justify-start items-start gap-1.5">
      <Switch>
        <Match when={displayOnly}>
          <Separator />
          <div
            class="w-full p-2 cursor-text prose prose-sm text-slate-900 markdown-rendered overflow-y-auto"
            onClick={() => setIsEditing(true)}
            innerHTML={md.render(displayContent)}
          />
        </Match>

        <Match when={!displayOnly}>
          <div class="justify-start text-slate-900 text-sm font-medium font-['Inter'] leading-5">
            Code Content
            <span class="text-red-500 ml-1">*</span>
          </div>
          <Show
            when={isEditing()}
            fallback={
              <div
                class="w-full p-2 cursor-text prose prose-sm text-slate-900 markdown-rendered overflow-y-auto"
                onClick={() => setIsEditing(true)}
                innerHTML={md.render(content())}
              />
            }
          >
            <textarea
              class="outline-none justify-start text-zinc-900 text-base font-normal font-['Inter'] leading-6 w-full h-full min-h-48 p-2 overflow-y-scroll"
              placeholder="Enter content in Markdown form..."
              value={content()}
              onInput={(e) => setContent(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
              onFocusOut={() => setIsEditing(false)}
              autofocus
              required
            />
          </Show>
        </Match>
      </Switch>
    </div>
  );
}
