import { BlockType } from "./blocks";

export type PageType = {
  id: number;
  elements: BlockType[];
  title: string;
};
