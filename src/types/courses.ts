import { InstructorType } from "./instructors";

export type CourseBaseType = {
  id?: number;
  code: string;
  credit_unit: number;
  name: string;
  semester: string;
  type: string;
  level_id: number;
  invigilatorSign?: string;
  instructors?: InstructorType[];
};

export type CourseType = CourseBaseType & {
  instructors: InstructorType[];
  created_at: string;
  updated_at: string;
};

export type CourseCreateType = CourseBaseType & {
  instructor_ids: number[];
};

export type CoursesResponse = {
  data: CourseType[];
  pagination: {
    page: number;
    pages: number;
    per_page: number;
    total: number;
  };
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
