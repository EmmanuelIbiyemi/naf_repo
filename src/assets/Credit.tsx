export default function Credit({ color }: { color?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill={color || "white"}
        d="M1.33203 8.00033C1.33203 5.64201 1.33203 4.46284 2.0339 3.67559C2.14616 3.54968 2.26988 3.43323 2.40367 3.32757C3.24012 2.66699 4.49298 2.66699 6.9987 2.66699H8.9987C11.5044 2.66699 12.7573 2.66699 13.5937 3.32757C13.7275 3.43323 13.8512 3.54968 13.9635 3.67559C14.6654 4.46284 14.6654 5.64201 14.6654 8.00033C14.6654 10.3587 14.6654 11.5378 13.9635 12.3251C13.8512 12.451 13.7275 12.5674 13.5937 12.6731C12.7573 13.3337 11.5044 13.3337 8.9987 13.3337H6.9987C4.49298 13.3337 3.24012 13.3337 2.40367 12.6731C2.26988 12.5674 2.14616 12.451 2.0339 12.3251C1.33203 11.5378 1.33203 10.3587 1.33203 8.00033Z"
        stroke="#023678"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fill={color || "white"}
        d="M6.66797 10.667H7.66797"
        stroke="#023678"
        stroke-miterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fill={color || "white"}
        d="M9.66797 10.667H12.0013"
        stroke="#023678"
        stroke-miterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fill={color || "white"}
        d="M1.33203 6H14.6654"
        stroke="#023678"
        strokeLinejoin="round"
      />
    </svg>
  );
}
