const ChartIcon = ({ color }: { color?: string }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.3335 8.55351V10.0002C1.3335 13.3335 2.66683 14.6668 6.00016 14.6668H10.0002C13.3335 14.6668 14.6668 13.3335 14.6668 10.0002V6.00016C14.6668 2.66683 13.3335 1.3335 10.0002 1.3335H6.00016C2.66683 1.3335 1.3335 2.66683 1.3335 6.00016"
        stroke={color || "white"}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6.74003 7.43311H4.97337C4.55337 7.43311 4.21338 7.77307 4.21338 8.19307V11.6064H6.74003V7.43311V7.43311Z"
        stroke={color || "white"}
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.50673 4.3999H7.49339C7.07339 4.3999 6.7334 4.73991 6.7334 5.15991V11.5999H9.26007V5.15991C9.26007 4.73991 8.92673 4.3999 8.50673 4.3999Z"
        stroke={color || "white"}
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11.0333 8.56641H9.2666V11.5998H11.7933V9.32642C11.7866 8.90642 11.4466 8.56641 11.0333 8.56641Z"
        stroke={color || "white"}
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default ChartIcon;
