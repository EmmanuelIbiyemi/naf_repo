export type Result = {
  id?: number;
  min_score: number;
  max_score: number;
  name: string;
  remark: string;
  program_id: number;
};

export type ResultsGetInput = {
  department_id: number;
  level_id: number;
  session?: string;
  semester?: string;
};
export type ResultCreateType = Result & {};

export type ResultResponse = {
  data: Result[];
};

export type ResultFormAction = (score: Result) => Promise<void>;
