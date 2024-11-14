type SemesterBase = {
  name: string;
  start_date: string;
  end_date: string;
  id: number;
  session_id: number;
  created_at?: string;
  updated_at?: string;
};

export type SemesterType = SemesterBase;
export type SemesterCreateType = SemesterBase & {};
export type SemesterCombinedType = SemesterCreateType | SemesterType;

export type SemesterResponse = { data: SemesterType };
export type SemestersResponse = { data: SemesterType[] };
