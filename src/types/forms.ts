import { BlockType } from "./blocks";

export type FormField = {
  id: number;
  key: string;
  content: string;
  name: string;
  placeholder: string;
  type: string;
  updated_at?: string;
};

type Row = {
  id: number;
  row: FormField[];
  updated_at?: string;
};

type Section = {
  id: number;
  name: string;
  rows: Row[];
  updated_at?: string;
};

type FormBaseType2 = {
  name: string;
  program_id: number;
  fee: number;
  sections: Section[];
};

export type FormCreateType2 = FormBaseType2 & {};

export type FormType2 = FormBaseType2 & {
  id: number;
  updated_at: string;
};

export type FormType = {
  id: number;
  elements: BlockType[];
  title: string;
  submitBtn: string;
  submissions: number;
  last_edited: string;
};

export type FormResponse = { data: FormType[] };

export type FormAction<T> = (object: T) => Promise<void>;
