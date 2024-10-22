import { BlockType } from "./blocks";

type Media = {
  created_at: string;
  id: number;
  name: string;
  type: string;
  updated_at: string;
  url: string;
};

export type Block = {
  caption: string;
  content: string;
  id: number;
  link: string;
  media: Media[];
  position: number;
  title: string;
  type: string;
};

export type Category = {
  created_at: string;
  id: number;
  name: string;
  updated_at: string;
};

export type PostBaseType = {
  blocks: Block[];
  categories?: Category[];
  date: string;
  featured_image?: string;
  slug: string;
  tags?: Category[];
  title: string;
};

export type PostCreateType = PostBaseType & {};
export type PostType = PostBaseType & {
  id?: number;
  created_at?: string;
  updated_at?: string;
};

export type PostType2 = {
  id: number;
  elements: BlockType[];
  title: string;
};

export type PostResponse = { data: PostType[] };
