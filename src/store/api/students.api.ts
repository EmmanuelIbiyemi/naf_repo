import {
  Student,
  StudentCreateType,
  StudentResponse,
} from "../../types/students.ts";
import { appApi } from "./app.api.ts";

const studentsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<StudentResponse, null>({
      query: () => "/participant",
      providesTags: ["Students"],
    }),
    getStudent: builder.query<StudentResponse, number>({
      query: (participant_id) => `/participant/${participant_id}`,
      providesTags: ["Students"],
    }),
    addStudent: builder.mutation<StudentResponse, StudentCreateType>({
      query: (participant) => ({
        url: `/participant`,
        method: "POST",
        body: participant,
      }),
      invalidatesTags: ["Students"],
    }),
    updateStudent: builder.mutation<StudentResponse, Student>({
      query: (participant) => ({
        url: `/participant/${participant.id}`,
        method: "PUT",
        body: participant,
      }),
      invalidatesTags: ["Students"],
    }),
    deleteStudent: builder.mutation<StudentResponse, number>({
      query: (participant_id) => ({
        url: `/participant/${participant_id}`,
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
