import { Dayjs } from "dayjs";
import { InstructorType } from "./instructors";

type SubjectBaseType = {
  duration: string;
  end_date: Dayjs;
  instructors: InstructorType[];
  phone: string;
  name: string;
  rank: string;
  start_date: Dayjs;
};

export type SubjectCreateType = SubjectBaseType & {};

export type SubjectType = SubjectBaseType & {
  id: number;
};

export type SubjectCombinedType = SubjectCreateType | SubjectType;
export type SubjectEditFuncType = (subject: SubjectCombinedType) => void;

export type CBTQuestion = {
  id?: number;
  question: string;
  options: string[];
  answer: string;
};

export type CBTSubjectType = {
  id?: number;
  name: string;
  questions: CBTQuestion[];
};
