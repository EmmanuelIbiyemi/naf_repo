import { PaginationResponse } from "./pagination";

export type Programme = {
  id?: number;
  name: string;
  department_id: number;
};

export type ProgrammeResponse = {
  data: Programme[];
  pagination: PaginationResponse;
};

export type ProgrammeFormAction = (programme: Programme) => Promise<void>;
