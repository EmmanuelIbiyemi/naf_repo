export type CourseCreateType = {
  name: string;
};

export type CourseType = {
  id: number;
  name: string;
  instructor: string;
};

type CourseContent = {
  id: number;
  course: string;
  subject: string;
  topic: string;
  days: string;
  time: string;
  num_of_students: number;
};

export type CourseCombinedType = CourseCreateType | CourseType;
export type CourseEditFuncType = (course: CourseCombinedType) => void;
export type CourseContents = CourseContent;
