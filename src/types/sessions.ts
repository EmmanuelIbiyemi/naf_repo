import { SemesterType } from "./semesters";

type SessionBase = {
  name: string;
  start_date: string;
  end_date: string;
  // session_id: number;
  created_at: string;
  updated_at: string;
  id: number;
  semesters: SemesterType[];
};

export type SessionType = SessionBase;
export type SessionCreateType = SessionBase & {};

export type SessionsResponse = { data: SessionType[] };
export type CurrentSessionResponse = { data: SessionType };
