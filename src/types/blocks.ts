export type MediaCreateType = { id: number } | null;
export type MediaType = {
  id: number;
  created_at: string;
  name: string;
  type: string;
  updated_at: string;
  url: string;
};

export type BlockType = {
  caption: string;
  content: string;
  id: number;
  link: string;
  media: MediaCreateType[] | MediaType[];
  position: number;
  title: string;
  type: string;
};
