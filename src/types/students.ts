import { CourseType } from "./courses";

export type StudentType = {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  courses: CourseType[];
};

export type StudentCreateType = StudentType & {};

export type StudentFormAction = (lecturer: StudentType) => Promise<void>;

export type StudentsResponse = { data: StudentType[] };

export type StudentCombinedType = StudentCreateType | StudentType;
export type StudentEditFuncType = (student: StudentCombinedType) => void;
