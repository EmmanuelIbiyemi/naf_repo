const HomeIcon = ({ color }: { color?: string }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.6668 6.99978C14.6668 6.19312 14.1268 5.15978 13.4668 4.69978L9.34683 1.81312C8.4135 1.15978 6.9135 1.19312 6.0135 1.89312L2.42016 4.69312C1.82016 5.15978 1.3335 6.15312 1.3335 6.90645V11.8464C1.3335 13.3931 2.5935 14.6598 4.14016 14.6598H11.8602C13.4068 14.6598 14.6668 13.3931 14.6668 11.8531V9.78645"
        stroke={color || "white"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 11.9932V9.99316"
        stroke={color || "white"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default HomeIcon;
