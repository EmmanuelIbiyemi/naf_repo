export type Score = {
  id?: number;
  min_score: number;
  max_score: number;
  name: string;
  remark: string;
  program_id: number;
};

export type ScoreCreateType = Score & {};

export type ScoreResponse = {
  data: Score[];
};

export type ScoreFormAction = (score: Score) => Promise<void>;
