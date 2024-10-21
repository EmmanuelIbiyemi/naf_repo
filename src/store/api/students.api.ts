import {
  StudentCreateType,
  StudentsResponse,
  StudentType,
} from "../../types/students";
import { appApi } from "./app.api";

const studentsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<StudentsResponse, null>({
      query: () => "/participant",
      providesTags: ["Students"],
    }),
    getStudent: builder.query<StudentsResponse, number>({
      query: (student_id) => `/participant/${student_id}`,
      providesTags: ["Students"],
    }),
    addStudent: builder.mutation<StudentsResponse, StudentCreateType>({
      query: (student) => ({
        url: `/participant`,
        method: "POST",
        body: student,
      }),
      invalidatesTags: ["Students"],
    }),
    updateStudent: builder.mutation<StudentsResponse, StudentType>({
      query: (student) => ({
        url: `/participant/${student.id}`,
        method: "PUT",
        body: student,
      }),
      invalidatesTags: ["Students"],
    }),
    deleteStudent: builder.mutation<StudentsResponse, number>({
      query: (student_id) => ({
        url: `/participant/${student_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Students"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStudentsQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useGetStudentQuery,
} = studentsApi;
