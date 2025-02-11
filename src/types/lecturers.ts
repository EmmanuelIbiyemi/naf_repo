import { PaginationResponse } from "./pagination";

export type Lecturer = {
  id?: number;
  address: string;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  photo: string;
  updated_at: string;
  user_id: number;
};

export type LecturerCreateType = Lecturer & {};

export type LecturerFormAction = (lecturer: Lecturer) => Promise<void>;

export type LecturerResponse = {
  data: Lecturer[];
  pagination: PaginationResponse;
};
