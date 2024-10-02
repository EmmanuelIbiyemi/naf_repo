import { BlockType } from "./blocks";

export type FormType = {
  id: number;
  elements: BlockType[];
  title: string;
  submitBtn: string;
  submissions: number;
  last_edited: string;
};
