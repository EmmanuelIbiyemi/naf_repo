import { AddLink, Image, EmojiPeople } from "@mui/icons-material";

export const BLOCK_TYPES = {
  LINK: "link page",
  IMAGE: "image",
  SOCIAL: "link social",
  LINKURL: "link url",
  BUTTONLINK: "button link",
} as const;

export const navElements = [
  { id: 24, name: "Link Page", type: BLOCK_TYPES.LINK, icon: AddLink },
  { id: 25, name: "Image", type: BLOCK_TYPES.IMAGE, icon: Image },
  { id: 26, name: "Social", type: BLOCK_TYPES.SOCIAL, icon: EmojiPeople },
  { id: 27, name: "Link Url", type: BLOCK_TYPES.LINKURL, icon: AddLink },
  { id: 28, name: "Button Link", type: BLOCK_TYPES.BUTTONLINK, icon: AddLink },
] as const;
