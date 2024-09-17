export const blurBg = () => {
  document.querySelector(".sidebar")?.classList.add("blur_effect");
  document.querySelector(".content-container")?.classList.add("blur_effect");
  document.querySelector(".header")?.classList.add("blur_effect");
};

export const unBlurBg = () => {
  document.querySelector(".sidebar")?.classList.remove("blur_effect");
  document.querySelector(".header")?.classList.remove("blur_effect");
  document.querySelector(".content-container")?.classList.remove("blur_effect");
};
