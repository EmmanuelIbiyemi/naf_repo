import {
  GradeCreateType,
  GradeResponse,
  Grade,
} from "../../types/grades.ts";
import { appApi } from "./app.api.ts";

const gradeApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getGrades: builder.query<GradeResponse, null>({
      query: () => `/grading/program/1`,
      providesTags: ["Grades"],
    }),
    getGrade: builder.query<GradeResponse, number>({
      query: (grade_id) => `/grading/${grade_id}`,
      providesTags: ["Grades"],
    }),
    addGrade: builder.mutation<GradeResponse, GradeCreateType>({
      query: (grade: GradeCreateType) => ({
        url: `/grading`,
        method: "POST",
        body: grade,
      }),
      invalidatesTags: ["Grades"],
    }),
    updateGrade: builder.mutation<GradeResponse, Grade>({
      query: (grade: Grade) => ({
        url: `/grading/${grade.id}`,
        method: "PUT",
        body: grade,
      }),
      invalidatesTags: ["Grades"],
    }),
    deleteGrade: builder.mutation<GradeResponse, number>({
      query: (grade_id: number) => ({
        url: `/grading/${grade_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Grades"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetGradesQuery,
  useGetGradeQuery,
  useAddGradeMutation,
  useUpdateGradeMutation,
  useDeleteGradeMutation,
} = gradeApi;
