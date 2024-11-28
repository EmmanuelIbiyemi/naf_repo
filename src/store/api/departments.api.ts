import {
  DepartmentCreateType,
  DepartmentsResponse,
  DepartmentType,
} from "../../types/department";
import { Pagination } from "../../types/pagination";
import { appApi } from "./app.api";

const departmentsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<
      DepartmentsResponse,
      { faculty_id: number; search_term?: string } & Pagination
    >({
      query: ({ faculty_id, search_term, page, per_page }) =>
        `/department/faculty/${faculty_id}?page=${page}&per_page=${per_page}${
          search_term ? "&search_term=" + search_term : ""
        }`,
      providesTags: ["Departments"],
    }),
    getDepartmentsM: builder.mutation<
      DepartmentsResponse,
      { faculty_id: number; search_term?: string } & Pagination
    >({
      query: ({ faculty_id, search_term, page, per_page }) =>
        `/department/faculty/${faculty_id}?page=${page}&per_page=${per_page}${
          search_term ? "&search_term=" + search_term : ""
        }`,
      invalidatesTags: ["Departments"],
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
  useGetDepartmentsMMutation,
  useGetDepartmentQuery,
  useAddDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentsApi;
