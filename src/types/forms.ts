export type FormField = {
  id?: number;
  key: string;
  content: string;
  name: string;
  placeholder: string;
  type: string;
  updated_at?: string;
};

type Row = {
  id?: number;
  row: FormField[];
  fields?: FormField[];
  updated_at?: string;
};

type Section = {
  id?: number;
  name: string;
  rows: Row[];
  updated_at?: string;
};

type FormBaseType2 = {
  id?: number;
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

export type FormResponse = { data: FormType2 };
export type FormsResponse = { data: FormType2[] };

export type FormAction<T> = (object: T) => Promise<void>;
