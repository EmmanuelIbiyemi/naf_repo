export type Department = {
  id?: number;
  name: string;
  faculty_id: number;
};

export type DepartmentResponse = {
  data: Department[];
};

export type DepartmentFormAction = (department: Department) => Promise<void>;
