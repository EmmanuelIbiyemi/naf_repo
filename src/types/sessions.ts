type SessionBase = {
  name: string;
  start_date: string;
  end_date: string;
  session_id: number;
};

export type SessionType = SessionBase & { id?: number };
export type SessionCreateType = SessionBase & {};

export type SessionsResponse = { data: SessionType[] };
