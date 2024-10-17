import { CourseType } from "./courses";

export type Student = {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  courses: CourseType[];
  password: string;
};

export type StudentCreateType = Student & {};

export type StudentFormAction = (lecturer: Student) => Promise<void>;

export type StudentResponse = {
  data: Student[];
};

