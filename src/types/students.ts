import { CourseType } from "./courses";

export type Student = {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  courses: CourseType[];
};

export type StudentCreateType = Student & {};

export type StudentFormAction = (lecturer: Student) => Promise<void>;

export type StudentResponse = {
  data: Student[];
};

export type StudentsResponse = { data: StudentType[] };

export type StudentCombinedType = StudentCreateType | StudentType;
export type StudentEditFuncType = (student: StudentCombinedType) => void;
