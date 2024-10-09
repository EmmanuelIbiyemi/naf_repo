import {
  FacultyCreateType,
  FacultyResponse,
  FacultyType,
} from "../../types/faculty";
import { appApi } from "./app.api";

const facultyApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaculties: builder.query<FacultyResponse, null>({
      query: () => "/faculty",
      providesTags: ["Faculty"],
    }),
    getFaculty: builder.query<FacultyResponse, number>({
      query: (faculty_id) => `/faculty/${faculty_id}`,
      providesTags: ["Faculty"],
    }),
    addFaculty: builder.mutation<FacultyResponse, FacultyCreateType>({
      query: (faculty: FacultyCreateType) => ({
        url: `/faculty`,
        method: "POST",
        body: faculty,
      }),
      invalidatesTags: ["Faculty"],
    }),
    updateFaculty: builder.mutation<FacultyResponse, FacultyType>({
      query: (faculty: FacultyType) => ({
        url: `/faculty/${faculty.id}`,
        method: "PUT",
        body: faculty,
      }),
      invalidatesTags: ["Faculty"],
    }),
    deleteFaculty: builder.mutation<FacultyResponse, number>({
      query: (course_id: number) => ({
        url: `/faculty/${course_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Faculty"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFacultiesQuery,
  useGetFacultyQuery,
  useAddFacultyMutation,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
} = facultyApi;
