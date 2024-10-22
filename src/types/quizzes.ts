import { options } from "./options";
import { Participant } from "./participants";

export interface QuizzesResponse {
  assessments: unknown;
  code: string;
  created_at: string;
  expiry_date: string;
  id: number;
  instructions: string;
  is_published: boolean;
  name: string;
  obtainable_score: number;
  show_result: boolean;
  start_date: string;
  time_allowed: number;
  type: string;
  updated_at: string;
}

export interface CreateQuiz {
  name: string;
  instructions: string;
  time_allowed: number;
  start_date: string;
  expiry_date: string;
  obtainable_score: number;
  type: string;
  show_result: boolean;
}

export interface FileUploadQuestionResponse {
  body: string;
  created_at: string;
  id: number;
  options: options;
  updated_at: string;
}

export interface ManualUploadQuestion {
  questions: {
    body: string;
    options: { body: string; is_answer: boolean }[];
  }[];
  assessment_id: number;
}

export interface ManualUploadQuestionResponse {
  body: string;
  created_at: string;
  id: number;
  options: {
    body: string;
    created_at: string;
    id: number;
    is_answer: boolean;
    updated_at: string;
  }[];
  updated_at: string;
}

export interface AssessmentResponse {
  created_at: string;
  id: number;
  name: string;
  questions: unknown;
  updated_at: string;
}

export interface shareQuizInput {
  quiz_id: number;
  participants: Participant;
}
