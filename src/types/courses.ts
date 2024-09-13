export type CourseCreateType = {
  name: string;
};

export type CourseType = {
  id: number;
  name: string;
};

export type CourseCombinedType = CourseCreateType | CourseType;
export type CourseEditFuncType = (course: CourseCombinedType) => void;
