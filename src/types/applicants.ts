import { PaginationResponse } from "./pagination";

type ApplicantBaseType = {
  data: {
    dob: string;
    email: string;
    first_name: string;
    gender: string;
    last_name: string;
    phone: string;
    reg_number: string;
  };
  payment_reference: string;
  program_id: string;
  session: string;
  status: string;
  user_id: number;
};

export type ApplicantCreateType = ApplicantBaseType & {};

export type ApplicantsResponse = {
  data: ApplicantType2[];
  pagination: PaginationResponse;
};

export type ApplicantStatusChangeType = {
  applicant_id: number;
  status: string;
};

type Instructor = {
  address: string;
  created_at: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  phone: string;
  photo: string;
  signature: string;
  updated_at: string;
};

type Course = {
  code: string;
  created_at: string;
  credit_units: number;
  id: number;
  instructors: Instructor[];
  name: string;
  semester: string;
  updated_at: string;
};

type Participant = {
  address: string;
  courses: Course[];
  created_at: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  matric_number: string;
  phone: string;
  photo: string;
  signature: string;
  updated_at: string;
  user_id: number;
};

type Program = {
  created_at: string;
  department: {
    created_at: string;
    id: number;
    name: string;
    updated_at: string;
  };
  department_id: number;
  id: number;
  name: string;
  updated_at: string;
};

type Data = {
  dob: string;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  gender: string;
  phone: string;
  reg_number: string;
};

type Level = {
  created_at: string;
  id: number;
  name: string;
  participants: Participant[];
  program: Program;
  updated_at: string;
};

export type ApplicantType2 = {
  created_at: string;
  data: Data;
  form: any;
  id: number;
  participants: Participant[];
  program: Program;
  status: string;
  session: string;
  user_id: number;
  level: Level;
  updated_at: string;
};

// Results

type Answer = {
  assessment_id: number;
  created_at: string;
  id: number;
  is_correct: boolean;
  option_id: number;
  question_id: number;
  time_left: number;
  updated_at: string;
  user_id: number;
};
type Option = {
  body: string;
  created_at: string;
  id: number;
  is_answer: boolean;
  updated_at: string;
};

type Question = {
  body: string;
  created_at: string;
  id: number;
  options: Option[];
  updated_at: string;
};

type Assessment = {
  created_at: string;
  id: number;
  name: string;
  questions: Question[];
  updated_at: string;
};

type Result = {
  assessment_id: number;
  assessment: Assessment;
  created_at: string;
  right: number;
  wrong: number;
};

export type ApplicantResultResponse = {
  data: {
    answers: Answer[];
    quiz: {
      assessments: Assessment[];
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
    };
    result: Result[];
  };
  message: string;
  status: string;
};
