import { BlockType } from "./blocks";

export type Category = {
  created_at: string;
  id: number;
  name: string;
  updated_at: string;
};

export type PostBaseType = {
  id?: number;
  blocks: BlockType[];
  date?: string;
  featured_image?: string;
  slug?: string;
  title: string;
};

export type PostCreateType = PostBaseType & {
  categories?: string[];
  tags?: string[];
};
export type PostType = PostBaseType & {
  created_at?: string;
  updated_at?: string;
  categories?: Category[];
  tags?: Category[];
};

export type PostResponse = { post: PostType[] };
