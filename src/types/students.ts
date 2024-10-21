import { CourseType } from "./courses";

type StudentBase = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  courses: CourseType[];
};
export type StudentCreateType = StudentBase;

export type StudentType = StudentBase & {
  id: number;
};

export type StudentsResponse = { data: StudentType[] };

export type StudentCombinedType = StudentCreateType | StudentType;
export type StudentEditFuncType = (student: StudentCombinedType) => void;
