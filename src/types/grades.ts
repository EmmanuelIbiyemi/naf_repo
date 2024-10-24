export type Grade = {
  id?: number;
  point: number;
  name: string;
  program_id: number;
};

export type GradeCreateType = Grade & {};

export type GradeResponse = {
  data: Grade[];
};

export type GradeFormAction = (grade: Grade) => Promise<void>;
