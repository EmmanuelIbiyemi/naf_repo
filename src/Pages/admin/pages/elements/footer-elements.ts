import { AddLink, FmdGood, Title, ContactPhone } from "@mui/icons-material";

export const BLOCK_TYPES = {
  LINKPAGE: "link page",
  LINKURL: "link url",
  CONTACTS: "contacts",
  TEXT: "text",
  MAP: "map",
} as const;

export const footerElements = [
  { id: 29, name: "Text", type: BLOCK_TYPES.TEXT, icon: Title },
  { id: 30, name: "Link Page", type: BLOCK_TYPES.LINKPAGE, icon: AddLink },
  { id: 31, name: "Link URL", type: BLOCK_TYPES.LINKURL, icon: AddLink },
  { id: 32, name: "Map", type: BLOCK_TYPES.MAP, icon: FmdGood },
  { id: 33, name: "Contacts", type: BLOCK_TYPES.CONTACTS, icon: ContactPhone },
] as const;
