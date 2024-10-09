import { BlockType, BlockType2 } from "./blocks";

export type PostType = {
  id: number;
  elements: BlockType[];
  title: string;
};

export type PostBaseType = {
  blocks: BlockType2[];
  categories: string[];
  created_at: string;
  date: string;
  featured_image: string;
  tags: string[];
  title: string;
  updated_at: string;
};

export type PostCreateType = PostBaseType & {};
export type PostType2 = PostBaseType & {
  id?: number;
};

export type PostResponse = { data: PostType2[] };
