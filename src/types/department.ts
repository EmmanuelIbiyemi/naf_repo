import { PaginationResponse } from "./pagination";

type DepartmentBaseType = {
  name: string;
  faculty_id: number;
};

export type DepartmentCreateType = DepartmentBaseType & {};

export type DepartmentType = DepartmentBaseType & {
  id?: number;
};

export type DepartmentFormAction = (
  department: DepartmentType
) => Promise<void>;

export type DepartmentsResponse = {
  data: DepartmentType[];
  pagination: PaginationResponse;
};
