import { CourseType } from "./courses";

type InstructorBase = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  courses: CourseType[];
  password: string;
  role: string;
};
export type InstructorCreateType = InstructorBase;

export type InstructorType = InstructorBase & {
  id: number;
};

export type InstructorCombinedType = InstructorCreateType | InstructorType;
export type InstructorEditFuncType = (student: InstructorCombinedType) => void;

export type InstructorType2 = {
  address: string;
  created_at: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  phone: string;
  photo: string;
  updated_at: string;
};
