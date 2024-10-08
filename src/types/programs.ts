export type ProgramBaseType = {
  name: string;
  next_program_id: number | null;
};

export type ProgramType = ProgramBaseType & {
  id?: number;
};

export type ProgramCreateType = ProgramBaseType & {};

export type ProgramResponse = {
  data: ProgramType[];
};

export type ProgramCourse = {
  program_id: number;
  course_ids: number[];
  type: string;
};
