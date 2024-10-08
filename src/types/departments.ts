export type Department = {
  id?: number;
  name: string;
  faculty: string;
};

export type DepartmentResponse = {
  data: Department[];
};

export type DepartmentFormAction = (department: Department) => Promise<void>;
