import { CourseType } from "./courses";
import { PaginationResponse } from "./pagination";
import { LevelType } from "./levels";

export type StudentType = {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  phone: string;
  photo: string;
  matric_number: string;
  courses?: CourseType[] | any[];
  level_id?: number;
  level?: LevelType;
  user_id?: number;
};

export type StudentsUploadType = {
  faculty_id: number,
  department_id: number,
  program_id: number,
  level_id: number;
  list_url: string;
};

export type StudentCreateType = StudentType & {};

export type StudentFormAction = (lecturer: StudentType) => Promise<void>;

export type StudentsResponse = {
  data: StudentType[];
  pagination: PaginationResponse;
};

export type StudentUploadResponse = {
}

export type SingleStudentResponse = { data: StudentType };

export type StudentCombinedType = StudentCreateType | StudentType;
export type StudentEditFuncType = (student: StudentCombinedType) => void;
