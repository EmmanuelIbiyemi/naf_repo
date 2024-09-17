import { RefObject } from "react";

export const blurBg = (containerRef: RefObject<HTMLDivElement>) => {
  document.querySelector(".sidebar")?.classList.add("blur_effect");
  document.querySelector(".header")?.classList.add("blur_effect");
  containerRef?.current?.classList.add("blur_effect");
};

export const unBlurBg = (containerRef: RefObject<HTMLDivElement>) => {
  containerRef.current?.classList.remove("blur_effect");
  document.querySelector(".sidebar")?.classList.remove("blur_effect");
  document.querySelector(".header")?.classList.remove("blur_effect");
};
