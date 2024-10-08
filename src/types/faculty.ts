export type FacultyBaseType = {
  created_at: string;
  id: number;
  name: string;
  updated_at: string;
};

export type FacultyType = FacultyBaseType & {
  id?: number;
};

export type FacultyCreateType = FacultyBaseType & {};

export type FacultyResponse = {
  data: FacultyType[];
};
