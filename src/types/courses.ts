import { InstructorType2 } from "./instructors";

export type CourseType2 = {
  code: string;
  created_at: string;
  credit_unit: number;
  id?: number;
  instructors: InstructorType2[];
  name: string;
  semester: string;
  updated_at: string;
};

export type CourseCreateType2 = {
  code: string;
  credit_unit: number;
  id?: number;
  name: string;
  semester: string;
  instructor_ids: number[];
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

export type CourseCombinedType = CourseCreateType2 | CourseType2;
export type CourseFormAction = (course: CourseCombinedType) => Promise<void>;
