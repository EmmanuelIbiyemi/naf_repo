import {
  Article,
  Badge,
  Height,
  HMobiledata,
  Image,
  LocalParking,
  MilitaryTech,
  Newspaper,
  SmartDisplay,
  Timeline,
  ViewCarousel,
} from "@mui/icons-material";

export const BLOCK_TYPES = {
  BANNER: "banner",
  HISTORY: "history",
  COURSES: "courses",
  NEWS: "news",
  IMAGE: "image",
  VIDEO: "video",
  HEADING: "heading",
  TEXT: "text",
  COMMANDANTS: "commandants",
  STAFFS: "staffs",
  BIG_SPACE: "big space",
  SMALL_SPACE: "small space",
} as const;

export const elements = [
  { id: 1, name: "Banner", type: BLOCK_TYPES.BANNER, icon: ViewCarousel },
  { id: 2, name: "History", type: BLOCK_TYPES.HISTORY, icon: Timeline },
  { id: 3, name: "Courses", type: BLOCK_TYPES.COURSES, icon: Article },
  { id: 5, name: "News", type: BLOCK_TYPES.NEWS, icon: Newspaper },
  { id: 6, name: "Image", type: BLOCK_TYPES.IMAGE, icon: Image },
  { id: 7, name: "Video", type: BLOCK_TYPES.VIDEO, icon: SmartDisplay },
  { id: 8, name: "Heading", type: BLOCK_TYPES.HEADING, icon: HMobiledata },
  { id: 9, name: "Text", type: BLOCK_TYPES.TEXT, icon: LocalParking },
  {
    id: 12,
    name: "Commandants",
    type: BLOCK_TYPES.COMMANDANTS,
    icon: MilitaryTech,
  },
  { id: 13, name: "Staffs", type: BLOCK_TYPES.STAFFS, icon: Badge },
  { id: 14, name: "Big space", type: BLOCK_TYPES.BIG_SPACE, icon: Height },
  { id: 15, name: "Small space", type: BLOCK_TYPES.SMALL_SPACE, icon: Height },
] as const;
