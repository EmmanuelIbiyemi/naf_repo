import { options } from "./options";

export interface Question {
  body: string;
  created_at: string;
  id: number;
  options: options;
  updated_at: string;
}

export type Questions = Question[];
