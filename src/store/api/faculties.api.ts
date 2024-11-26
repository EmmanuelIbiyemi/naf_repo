import { Faculty, FacultyResponse } from "../../types/faculties";
import { FacultyType } from "../../types/faculty";
import { Pagination } from "../../types/pagination";
import { appApi } from "./app.api";

const facultiesApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaculties: builder.query<FacultyResponse, Pagination>({
      query: ({ page, per_page }) =>
        `/faculty?page=${page}&per_page=${per_page}`,
      providesTags: ["Faculties"],
    }),
    getFaculty: builder.query<{ data: FacultyType }, number>({
      query: (faculty_id) => `/faculty/${faculty_id}`,
    }),
    addFaculty: builder.mutation<FacultyResponse, Faculty>({
      query: (faculty: Faculty) => ({
        url: `/faculty`,
        method: "POST",
        body: faculty,
      }),
      invalidatesTags: ["Faculties"],
    }),
    updateFaculty: builder.mutation<Faculty, Faculty>({
      query: (faculty: Faculty) => ({
        url: `/faculty/${faculty.id}`,
        method: "PUT",
        body: faculty,
      }),
      invalidatesTags: ["Faculties"],
    }),
    deleteFaculty: builder.mutation<Faculty, number>({
      query: (faculty_id: number) => ({
        url: `/faculty/${faculty_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Faculties"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFacultiesQuery,
  useAddFacultyMutation,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
  useGetFacultyQuery,
} = facultiesApi;
