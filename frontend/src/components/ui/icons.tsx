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

export function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="black"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export function MKLogoIcon() {
  return (
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
  );
}

export function ExternalLinkIcon() {
  return (
    <svg
      class="w-5 h-5"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.5 2.5H17.5M17.5 2.5V7.5M17.5 2.5L8.33333 11.6667M15 10.8333V15.8333C15 16.2754 14.8244 16.6993 14.5118 17.0118C14.1993 17.3244 13.7754 17.5 13.3333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V6.66667C2.5 6.22464 2.67559 5.80072 2.98816 5.48816C3.30072 5.17559 3.72464 5 4.16667 5H9.16667"
        stroke="black"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export function AvatarIcon() {
  return (
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
  );
}

export function DeleteIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 11V17M14 11V17M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M3 6H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
        stroke="black"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export function EditIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.9999 5.00001L18.9999 9.00001M21.1739 6.81201C21.7026 6.28344 21.9997 5.56648 21.9998 4.81887C21.9999 4.07125 21.703 3.35422 21.1744 2.82551C20.6459 2.29681 19.9289 1.99973 19.1813 1.99963C18.4337 1.99954 17.7166 2.29644 17.1879 2.82501L3.84193 16.174C3.60975 16.4055 3.43805 16.6905 3.34193 17.004L2.02093 21.356C1.99509 21.4425 1.99314 21.5344 2.01529 21.6219C2.03743 21.7094 2.08285 21.7892 2.14673 21.853C2.21061 21.9168 2.29055 21.9621 2.37809 21.9841C2.46563 22.0061 2.55749 22.004 2.64393 21.978L6.99693 20.658C7.3101 20.5628 7.59511 20.3921 7.82693 20.161L21.1739 6.81201Z"
        stroke="black"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
