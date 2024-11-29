import { PaginationResponse } from "./pagination";
import { SemesterType } from "./semesters";

type SessionBase = {
  name: string;
  start_date: string;
  end_date: string;
  created_at?: string;
  updated_at?: string;
  id: number;
  semesters: SemesterType[];
};

export type SessionType = SessionBase;
export type SessionCreateType = SessionBase & {};
export type SessionCombinedType = SessionCreateType | SessionType;

export type SessionResponse = { data: SessionType };
export type SessionsResponse = {
  data: SessionType[];
  pagination: PaginationResponse;
};
