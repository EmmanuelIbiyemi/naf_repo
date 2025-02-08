export type MediaCreateType = { id: number };
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
  randomId: string | null | undefined;
  link: string;
  media: MediaCreateType[] | MediaType[] | null;
  position: number;
  title: string;
  type: string;
};
