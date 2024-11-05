import { Questions } from "./questions";

export interface AssessmentResponse {
  created_at: string;
  id: number;
  name: string;
  questions: Questions;
  updated_at: string;
}

export type AssessmentResponses = AssessmentResponse[];
