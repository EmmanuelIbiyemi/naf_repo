import { PaginationResponse } from "./pagination";

export type Faculty = {
  id?: number;
  name: string;
  programme?: string;
};

export type FacultyResponse = {
  data: Faculty[];
  pagination: PaginationResponse;
};

export type FacultyFormAction = (faculty: Faculty) => Promise<void>;
