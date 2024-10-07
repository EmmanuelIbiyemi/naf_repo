import { InstructorType2 } from "./instructors";

export type CourseType2 = {
  code: string;
  created_at: string;
  credit_units: number;
  id: number;
  instructors: InstructorType2;
  name: string;
  semester: string;
  updated_at: string;
};

export type CoursesResponse = {
  data: CourseType2[];
};

export type CourseCreateType = {
  name: string;
};

export type CourseType = {
  id: number;
  name: string;
  instructor: string;
};

export type CourseCombinedType = CourseCreateType | CourseType;
export type CourseEditFuncType = (course: CourseCombinedType) => void;
