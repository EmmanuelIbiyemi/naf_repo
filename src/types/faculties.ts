export type Faculty = {
  id?: number;
  name: string;
  programme?: string;
};

export type FacultyResponse = {
  data: Faculty[]
};

export type FacultyFormAction = (faculty: Faculty) => Promise<void>;
