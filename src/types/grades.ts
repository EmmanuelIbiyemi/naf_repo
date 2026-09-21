export type Grade = {
  id?: number;
  point: number;
  min_point?: number | null;
  max_point?: number | null;
  remark?: string | null;
  name: string;
  program_id: number;
};

export type GradeCreateType = Grade & {};

export type GradeResponse = {
  data: Grade[];
};

export type GradeFormAction = (grade: Grade) => Promise<void>;
