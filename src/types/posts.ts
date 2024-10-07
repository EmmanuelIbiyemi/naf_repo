import { BlockType } from "./blocks";

export type PostType = {
  id: number;
  elements: BlockType[];
  title: string;
};
