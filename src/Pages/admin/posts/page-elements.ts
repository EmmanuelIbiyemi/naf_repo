import {
  Height,
  HMobiledata,
  Image,
  LocalParking,
  SmartDisplay,
} from "@mui/icons-material";

export const BLOCK_TYPES = {
  IMAGE: "image",
  VIDEO: "video",
  HEADING: "heading",
  TEXT: "text",
  BIG_SPACE: "big space",
  SMALL_SPACE: "small space",
} as const;

export const elements = [
  { id: 6, name: "Image", type: BLOCK_TYPES.IMAGE, icon: Image },
  { id: 7, name: "Video", type: BLOCK_TYPES.VIDEO, icon: SmartDisplay },
  { id: 8, name: "Heading", type: BLOCK_TYPES.HEADING, icon: HMobiledata },
  { id: 9, name: "Paragraph", type: BLOCK_TYPES.TEXT, icon: LocalParking },
  { id: 14, name: "Big space", type: BLOCK_TYPES.BIG_SPACE, icon: Height },
  { id: 15, name: "Small space", type: BLOCK_TYPES.SMALL_SPACE, icon: Height },
] as const;
