import {
  Department,
  DepartmentResponse
} from "../../types/departments";
import { appApi } from "./app.api";

const departmentsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<DepartmentResponse, null>({
      query: () => "/department",
      providesTags: ["Departments"],
    }),
    addDepartment: builder.mutation<DepartmentResponse, Department>({
      query: (department: Department) => ({
        url: `/department`,
        method: "POST",
        body: department,
      }),
      invalidatesTags: ["Departments"],
    }),
    updateDepartment: builder.mutation<Department, Department>({
      query: (department: Department) => ({
        url: `/department/${department.id}`,
        method: "PUT",
        body: department,
      }),
      invalidatesTags: ["Departments"],
    }),
    deleteDepartment: builder.mutation<Department, number>({
      query: (department_id: number) => ({
        url: `/department/${department_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Departments"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDepartmentsQuery,
  useAddDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentsApi;
