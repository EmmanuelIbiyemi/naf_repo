import {
  SemesterCreateType,
  SemesterResponse,
  SemestersResponse,
  SemesterType,
} from "../../types/semesters";
import { appApi } from "./app.api";

const semestersApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getSemesters: builder.query<SemestersResponse, null>({
      query: () => "/semester",
      providesTags: ["Semesters"],
    }),
    getSemester: builder.query<SemesterResponse, number>({
      query: (semester_id) => `/semester/${semester_id}`,
      providesTags: ["Semesters"],
    }),
    getCurrentSemester: builder.query<SemesterResponse, null>({
      query: () => `/semester/current`,
      providesTags: ["Semesters"],
    }),
    addSemester: builder.mutation<SemesterResponse, SemesterCreateType>({
      query: (semester) => ({
        url: `/semester`,
        method: "POST",
        body: semester,
      }),
      invalidatesTags: ["Semesters"],
    }),
    updateSemester: builder.mutation<SemesterResponse, SemesterType>({
      query: (semester) => ({
        url: `/semester/${semester.id}`,
        method: "PUT",
        body: semester,
      }),
      invalidatesTags: ["Semesters"],
    }),
    deleteSemester: builder.mutation<SemesterResponse, number>({
      query: (semester_id) => ({
        url: `/semester/${semester_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Semesters"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSemestersQuery,
  useAddSemesterMutation,
  useUpdateSemesterMutation,
  useDeleteSemesterMutation,
  useGetSemesterQuery,
  useGetCurrentSemesterQuery,
} = semestersApi;
