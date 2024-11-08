export interface AnswersResponse {
  assessment_id: number;
  created_at: string;
  id: number;
  is_correct: boolean;
  option_id: number;
  question_id: number;
  time_left: number;
  updated_at: string;
  user_id: number;
}

export type AnswersResponses = AnswersResponse[];
