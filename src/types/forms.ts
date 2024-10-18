export type FormField = {
  id?: number;
  key: string;
  name: string;
  placeholder: string;
  type: string;
  updated_at?: string;
};

export type FormRow = {
  id?: number;
  row: FormField[];
  fields?: FormField[];
  updated_at?: string;
};

export type FormSection = {
  id?: number;
  name: string;
  rows: FormRow[];
  updated_at?: string;
};

type FormBaseType2 = {
  id?: number;
  name: string;
  program_id: number;
  fee: number;
  sections: FormSection[];
};

export type FormCreateType2 = FormBaseType2 & {};

export type FormType2 = FormBaseType2 & {
  id: number;
  updated_at: string;
};

export type FormResponse = { data: FormType2 };
export type FormsResponse = { data: FormType2[] };

export type FormAction<T> = (object: T) => Promise<void>;
