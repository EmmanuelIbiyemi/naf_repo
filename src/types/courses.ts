import { InstructorType } from "./instructors";

export type CourseBaseType = {
  code: string;
  credit_units: number;
  name: string;
  semester: string;
  type: string;
};

export type CourseType = CourseBaseType & {
  id?: number;
  instructors: InstructorType[];
  created_at: string;
  updated_at: string;
};

export type CourseCreateType = CourseBaseType & {
  instructor_ids: number[];
};

export type CoursesResponse = {
  data: CourseType[];
};

export type CourseCombinedType = CourseCreateType | CourseType;

type CourseContent = {
  id: number;
  course: string;
  subject: string;
  topic: string;
  days: string;
  time: string;
  num_of_students: number;
};

export type CourseEditFuncType = (course: CourseCombinedType) => void;
export type CourseContents = CourseContent;

export type CourseInstructor = {
  course_id: number;
  instructor_ids: number[];
};
