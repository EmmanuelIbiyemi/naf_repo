type DepartmentBaseType = {
  name: string;
  faculty_id: number;
};

export type DepartmentCreateType = DepartmentBaseType & {};

export type DepartmentType = DepartmentBaseType & {
  id?: number;
};

export type DepartmentsResponse = {
  data: DepartmentType[];
};
