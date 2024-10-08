export type FacultyBaseType = {
  name: string;
  next_program_id: number | null;
};

export type FacultyType = FacultyBaseType & {
  id?: number;
};

export type FacultyCreateType = FacultyBaseType & {};

export type FacultyResponse = {
  data: FacultyType[];
};
