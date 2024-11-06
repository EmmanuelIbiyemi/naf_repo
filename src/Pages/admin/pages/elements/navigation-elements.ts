import { AddLink, Image } from "@mui/icons-material";

export const BLOCK_TYPES = {
  LINK: "link",
  IMAGE: "image",
} as const;

export const navElements = [
  { id: 1, name: "Link", type: BLOCK_TYPES.LINK, icon: AddLink },
  { id: 1, name: "Image", type: BLOCK_TYPES.IMAGE, icon: Image },
] as const;
