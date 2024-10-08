type SemesterBase = {
  name: string;
  start_date: string;
  end_date: string;
  session_id: number;
};

export type SemesterType = SemesterBase & { id?: number };
export type SemesterCreateType = SemesterBase & {};

export type SemestersResponse = { data: SemesterType[] };
