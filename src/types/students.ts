import { CourseType } from "./courses";
import { LevelType } from "./levels";

export type StudentType = {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  phone: string;
  photo: string;
  courses: CourseType[];
  level_id?: number;
  level?: LevelType;
};

export type StudentCreateType = StudentType & {};

export type StudentFormAction = (lecturer: StudentType) => Promise<void>;

export type StudentsResponse = { data: StudentType[] };

export type SingleStudentResponse = { data: StudentType };

export type StudentCombinedType = StudentCreateType | StudentType;
export type StudentEditFuncType = (student: StudentCombinedType) => void;
