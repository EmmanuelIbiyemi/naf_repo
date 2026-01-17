export type MediaCreateType = { id: number; caption?: string };
export type MediaType = {
  id: number;
  created_at: string;
  name: string;
  type: string;
  updated_at: string;
  url: string;
  caption?: string;
};

export type BlockSettings = {
  backgroundColor?: string;
  contentWidth?: "narrow" | "default" | "wide" | "full";
  layout?: "stack" | "row";
  paddingBottom?: number;
  paddingTop?: number;
  rowId?: string;
  columnWidth?: "1/2" | "1/3" | "2/3" | "1/4" | "3/4";
  textAlign?: "left" | "center" | "right";
  textColor?: string;
};

export type BlockType = {
  caption: string;
  content: string;
  id: number;
  randomId: string | null | undefined;
  link: string;
  media: MediaCreateType[] | MediaType[] | null;
  position: number;
  settings?: BlockSettings;
  title: string;
  type: string;
  description?: string;
};
