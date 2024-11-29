import { LevelType } from "./levels";
import { PaginationResponse } from "./pagination";
import { Programme } from "./programmes";

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

export type ApplicantType = ApplicantBaseType & {
  id: number;
  program: Programme;
  level: LevelType;
  created_at: string;
  updated_at: string;
};

export type ApplicantsResponse = {
  data: ApplicantType2[];
  pagination: PaginationResponse;
};

export type ApplicantStatusChangeType = {
  applicant_id: number;
  status: string;
};

// New Applicant Schema

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
  first_name: string;
  gender: string;
  last_name: string;
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
  id: number;
  name: string;
  participants: Participant[];
  program: Program;
  status: string;
  session: string;
  user_id: number;
  level: Level;
  updated_at: string;
};
