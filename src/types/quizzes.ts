import { AnswersResponses } from "./answers";
import { AssessmentResponses } from "./assessments";
import { options } from "./options";
import { ParticipantsMultipleData } from "./participants";
import { QuizResults } from "./results";
// import { Participant } from "./participants";

// Base interface for timestamps
interface TimeStamps {
  created_at: string;
  updated_at: string;
}

// Option interface
interface Option extends TimeStamps {
  id: number;
  body: string;
}

// Question interface
interface Question extends TimeStamps {
  id: number;
  body: string;
  options: Option[];
}

// Assessment interface
interface Assessment extends TimeStamps {
  id: number;
  name: string;
  questions: Question[];
}

// Quiz Data interface
interface QuizData extends TimeStamps {
  id: number;
  code: string;
  name: string;
  instructions: string;
  is_published: boolean;
  obtainable_score: number;
  show_result: boolean;
  start_date: string;
  expiry_date: string;
  time_allowed: number;
  type: string;
  assessments: Assessment[];
}

// Full Response interface
interface QuizResponse {
  data: QuizData;
  message: string;
  status: string;
}

export interface QuizResponse1 {
  data: {
    id: number;
    name: string;
    instructions: string;
    time_allowed: number;
    obtainable_score: number;
    quiz: {
      id: number;
      code: string;
      name: string;
      instructions: string;
      is_published: boolean;
      obtainable_score: number;
      show_result: boolean;
      start_date: string;
      expiry_date: string;
      time_allowed: number;
      type: string;
      assessments: Assessment[];
    };
  };
  status: string;
  message: string;
}

export type { Option, Question, Assessment, QuizData, QuizResponse };

export interface QuizzesResponse {
  data: {
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
  }[];
}

export interface InstructorQuizzesResponse {
  assessments: unknown;
  code: string;
  created_at: string;
  expiry_date: string;
  id: number;
  instructions: string;
  is_published: boolean;
  name: string;
  obtainable_score: number;
  participants: ParticipantsMultipleData;
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

export interface CreateQuiz2 {
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
  questions: Question;
  updated_at: string;
}

export interface shareQuizInput {
  quiz_id: number;
  participants: number[];
}

export interface QuizUserResultResponse {
  answers: AnswersResponses;
  quiz: {
    assessments: AssessmentResponses;
    code: string;
    created_at: string;
    expiry_date: string;
    id: number;
    instructions: string;
    is_published: boolean;
    name: string;
    obtainable_score: number;
    participants: ParticipantsMultipleData;
    show_result: boolean;
    start_date: string;
    time_allowed: number;
    type: string;
    updated_at: string;
  };
  result: QuizResults;
}

export interface QuizResultResponse {
  data: {
    answers: Answer[];
    quiz: Quiz;
    result: Result[];
  };
  message: string;
  status: string;
}

interface Answer {
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

export interface Quiz {
  assessments: Assessment[];
  code: string;
  created_at: string;
  expiry_date: string;
  id: number;
  instructions: string;
  is_published: boolean;
  name: string;
  obtainable_score: number;
  participants: string[];
  show_result: boolean;
  start_date: string;
  time_allowed: number;
  type: string;
  updated_at: string;
}

interface Assessment {
  created_at: string;
  id: number;
  name: string;
  questions: Question[];
  updated_at: string;
}

export interface Result {
  assessment_id: number;
  created_at: string;
  right: number;
  wrong: number;
}
