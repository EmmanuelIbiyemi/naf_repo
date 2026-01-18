import {
  AddLink,
  Height,
  HMobiledata,
  Image,
  LocalParking,
  SmartDisplay,
  ViewCarousel,
  Newspaper,
  Article,
  TextFields,
  EmojiPeople,
  FmdGood,
  ContactPhone,
  ViewColumn,
} from "@mui/icons-material";

export const BLOCK_TYPES = {
  // Page Elements
  ROW: "row",
  BANNER: "banner",
  LEFTCARD: "left card",
  RIGHTCARD: "right card",
  POSTCARDS: "post cards",
  NEWS_SECTION: "news section",
  POSTCAROUSEL: "post carousel",
  
  // Common Elements
  IMAGE: "image",
  VIDEO: "video",
  RICH_TEXT: "rich text",
  GALLERY: "gallery",
  FEATURE_GRID: "feature grid",
  ACCORDION: "accordion",
  HEADING: "heading",
  SUBHEADING: "subheading",
  TEXT: "text",
  MARGIN: "margin",
  
  // Link Elements
  LINK_PAGE: "link page",
  LINK_URL: "link url",
  SOCIAL: "link social",
  BUTTON_LINK: "button link",
  DROPDOWN: "dropdown",
  
  // Footer Elements
  CONTACTS: "contacts",
  MAP: "map",
} as const;

export const elements = [
  // Page Elements
  { id: 0, name: "Row", type: BLOCK_TYPES.ROW, icon: ViewColumn },
  { id: 1, name: "Banner", type: BLOCK_TYPES.BANNER, icon: ViewCarousel },
  { id: 2, name: "Left Card", type: BLOCK_TYPES.LEFTCARD, icon: Newspaper },
  { id: 3, name: "Right Card", type: BLOCK_TYPES.RIGHTCARD, icon: Newspaper },
  { id: 5, name: "Post Cards", type: BLOCK_TYPES.POSTCARDS, icon: Article },
  { id: 22, name: "Post Carousel", type: BLOCK_TYPES.POSTCAROUSEL, icon: ViewCarousel },

  // Common Elements
  { id: 7, name: "Image", type: BLOCK_TYPES.IMAGE, icon: Image },
  { id: 8, name: "Video", type: BLOCK_TYPES.VIDEO, icon: SmartDisplay },
  { id: 23, name: "Rich Text", type: BLOCK_TYPES.RICH_TEXT, icon: TextFields },
  { id: 24, name: "Gallery", type: BLOCK_TYPES.GALLERY, icon: Image },
  { id: 25, name: "Feature Grid", type: BLOCK_TYPES.FEATURE_GRID, icon: Article },
  { id: 26, name: "Accordion", type: BLOCK_TYPES.ACCORDION, icon: Article },
  { id: 9, name: "Heading", type: BLOCK_TYPES.HEADING, icon: HMobiledata },
  { id: 15, name: "Subheading", type: BLOCK_TYPES.SUBHEADING, icon: TextFields },
  { id: 10, name: "Paragraph", type: BLOCK_TYPES.TEXT, icon: LocalParking },
  { id: 13, name: "Margin", type: BLOCK_TYPES.MARGIN, icon: Height },

  // Link Elements
  { id: 18, name: "Link Page", type: BLOCK_TYPES.LINK_PAGE, icon: AddLink },
  { id: 19, name: "Link URL", type: BLOCK_TYPES.LINK_URL, icon: AddLink },
  { id: 16, name: "Social", type: BLOCK_TYPES.SOCIAL, icon: EmojiPeople },
  { id: 17, name: "Button Link", type: BLOCK_TYPES.BUTTON_LINK, icon: AddLink },
  { id: 18, name: "Dropdown", type: BLOCK_TYPES.DROPDOWN, icon: AddLink },

  // Footer Elements
  { id: 21, name: "Contacts", type: BLOCK_TYPES.CONTACTS, icon: ContactPhone },
  { id: 20, name: "Map", type: BLOCK_TYPES.MAP, icon: FmdGood },
] as const;
