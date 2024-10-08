import {
  DepartmentCreateType,
  DepartmentsResponse,
  DepartmentType,
} from "../../types/department";
import { appApi } from "./app.api";

const departmentsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<DepartmentsResponse, number>({
      query: (faculty_id) => `/department/faculty/${faculty_id}`,
      providesTags: ["Departments"],
    }),
    getDepartment: builder.query<DepartmentsResponse, number>({
      query: (department_id) => `/department/${department_id}`,
      providesTags: ["Departments"],
    }),
    addDepartment: builder.mutation<DepartmentsResponse, DepartmentCreateType>({
      query: (department: DepartmentCreateType) => ({
        url: `/department`,
        method: "POST",
        body: department,
      }),
      invalidatesTags: ["Departments"],
    }),
    updateDepartment: builder.mutation<DepartmentsResponse, DepartmentType>({
      query: (department: DepartmentType) => ({
        url: `/department/${department.id}`,
        method: "PUT",
        body: department,
      }),
      invalidatesTags: ["Departments"],
    }),
    deleteDepartment: builder.mutation<DepartmentsResponse, number>({
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
