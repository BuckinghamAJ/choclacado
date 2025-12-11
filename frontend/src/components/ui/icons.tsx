import { Match, Switch } from "solid-js";

export function ArticleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_124_9944)">
        <path
          d="M12.5001 15H8.33341M15.0001 11.6667H8.33341M3.33341 18.3333H16.6667C17.1088 18.3333 17.5327 18.1577 17.8453 17.8452C18.1578 17.5326 18.3334 17.1087 18.3334 16.6667V3.33333C18.3334 2.8913 18.1578 2.46738 17.8453 2.15482C17.5327 1.84226 17.1088 1.66666 16.6667 1.66666H6.66675C6.22472 1.66666 5.8008 1.84226 5.48824 2.15482C5.17568 2.46738 5.00008 2.8913 5.00008 3.33333V16.6667C5.00008 17.1087 4.82449 17.5326 4.51193 17.8452C4.19937 18.1577 3.77544 18.3333 3.33341 18.3333ZM3.33341 18.3333C2.89139 18.3333 2.46746 18.1577 2.1549 17.8452C1.84234 17.5326 1.66675 17.1087 1.66675 16.6667V9.16666C1.66675 8.72464 1.84234 8.30071 2.1549 7.98815C2.46746 7.67559 2.89139 7.5 3.33341 7.5H5.00008M9.16675 5H14.1667C14.627 5 15.0001 5.37309 15.0001 5.83333V7.5C15.0001 7.96023 14.627 8.33333 14.1667 8.33333H9.16675C8.70651 8.33333 8.33341 7.96023 8.33341 7.5V5.83333C8.33341 5.37309 8.70651 5 9.16675 5Z"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_124_9944">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function CodeSnippetIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.3332 15L18.3332 10L13.3332 5M6.6665 5L1.6665 10L6.6665 15"
        stroke="black"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export function LearningIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.3332 8.33335V13.3333M4.99983 10.4167V13.3333C4.99983 13.9964 5.52662 14.6323 6.4643 15.1011C7.40198 15.57 8.67375 15.8333 9.99983 15.8333C11.3259 15.8333 12.5977 15.57 13.5354 15.1011C14.473 14.6323 14.9998 13.9964 14.9998 13.3333V10.4167M17.8498 9.10168C17.999 9.03587 18.1256 8.92774 18.2139 8.79068C18.3023 8.65363 18.3485 8.49367 18.3468 8.33063C18.3451 8.16758 18.2956 8.00862 18.2045 7.87342C18.1133 7.73822 17.9845 7.63273 17.834 7.57001L10.6915 4.31668C10.4744 4.21764 10.2385 4.16638 9.99983 4.16638C9.76117 4.16638 9.5253 4.21764 9.30816 4.31668L2.1665 7.56668C2.01814 7.63166 1.89193 7.73846 1.8033 7.87403C1.71468 8.00959 1.66748 8.16805 1.66748 8.33001C1.66748 8.49198 1.71468 8.65043 1.8033 8.786C1.89193 8.92157 2.01814 9.02837 2.1665 9.09335L9.30816 12.35C9.5253 12.4491 9.76117 12.5003 9.99983 12.5003C10.2385 12.5003 10.4744 12.4491 10.6915 12.35L17.8498 9.10168Z"
        stroke="black"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

type MKIconProps = {
  resource: string;
};

export default function MKIcon({ resource }: MKIconProps) {
  return (
    <Switch>
      <Match when={resource == "Articles"}>
        <ArticleIcon />
      </Match>
      <Match when={resource == "Code Snippets"}>
        <CodeSnippetIcon />
      </Match>
      <Match when={resource == "Learning Resources"}>
        <LearningIcon />
      </Match>
    </Switch>
  );
}
