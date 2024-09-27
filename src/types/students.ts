import { CourseType } from "./courses";

type StudentBase = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  courses: CourseType[];
  password: string;
};
export type StudentCreateType = StudentBase;

export type StudentType = StudentBase & {
  id: number;
};

export type StudentCombinedType = StudentCreateType | StudentType;
export type StudentEditFuncType = (student: StudentCombinedType) => void;
