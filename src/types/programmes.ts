import { Department } from "./departments";
import { PaginationResponse } from "./pagination";

export type Programme = {
  id?: number;
  name: string;
  department_id: number;
  department: Department | undefined;
};

export type ProgrammeResponse = {
  data: Programme[];
  pagination: PaginationResponse;
};

export type ProgrammeFormAction = (programme: Programme) => Promise<void>;
