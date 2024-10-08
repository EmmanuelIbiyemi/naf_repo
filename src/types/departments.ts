export type Department = {
  id?: number;
  name: string;
  faculty_id: string;
};

export type DepartmentResponse = {
  data: Department[];
};

export type DepartmentFormAction = (department: Department) => Promise<void>;
