import { Dayjs } from "dayjs";

type SubjectBaseType = {
  duration: string;
  end_date: Dayjs;
  instructors: number[];
  phone: string;
  name: string;
  rank: string;
  start_date: Dayjs;
};

export type SubjectCreateType = SubjectBaseType & {};

export type SubjectType = SubjectBaseType & {
  id: number;
};

type Question = {
  id?: number;
  question: string;
  options: string[];
};

export type CBTSubjectType = {
  id?: number;
  name: string;
  questions: Question[];
};
