import { AddLink, FmdGood, Title } from "@mui/icons-material";

export const BLOCK_TYPES = {
  LINK: "link",
  TEXT: "text",
  MAP: "map",
} as const;

export const footerElements = [
  { id: 1, name: "Text", type: BLOCK_TYPES.TEXT, icon: Title },
  { id: 2, name: "Link", type: BLOCK_TYPES.LINK, icon: AddLink },
  { id: 3, name: "Map", type: BLOCK_TYPES.MAP, icon: FmdGood },
] as const;
