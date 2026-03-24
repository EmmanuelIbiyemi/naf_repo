import { Pagination } from "../../types/pagination";
import {
  SingleStudentResponse,
  StudentCreateType,
  StudentPhotoUploadResponse,
  StudentsResponse,
  StudentsUploadType,
  StudentType,
  StudentUploadResponse,
} from "../../types/students";
import { appApi } from "./app.api";

const studentsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<
      StudentsResponse,
      Pagination & { search_term?: string }
    >({
      query: ({ search_term, page, per_page }) =>
        `/participant?page=${page}&per_page=${per_page}${
          search_term ? "&search_term=" + search_term : ""
        }`,
      providesTags: ["Students"],
    }),
    getStudent: builder.query<SingleStudentResponse, number>({
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
    uploadStudents: builder.mutation<StudentUploadResponse, StudentsUploadType>({
          query: (data) => ({
            url: `/participant/upload`,
            method: "POST",
            body: data,
          }),
          invalidatesTags: ["Students"],
        }),
    bulkUploadStudentPhotos: builder.mutation<
      StudentPhotoUploadResponse,
      FormData
    >({
      query: (data) => ({
        url: `/participant/photo-upload`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Students"],
    }),
    promoteAll: builder.mutation<StudentsResponse, null>({
      query: () => ({
        url: `/participant/promote`,
        method: "POST",
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
    bulkDeleteStudents: builder.mutation<
      {
        message: string;
        status: string;
        deleted_ids: number[];
        not_found_ids: number[];
        invalid_ids: (number | string)[];
      },
      { participant_ids: number[] }
    >({
      query: ({ participant_ids }) => ({
        url: `/participant/bulk`,
        method: "DELETE",
        body: { participant_ids },
      }),
      invalidatesTags: ["Students"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStudentsQuery,
  useAddStudentMutation,
  useUploadStudentsMutation,
  useBulkUploadStudentPhotosMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useBulkDeleteStudentsMutation,
  useGetStudentQuery,
  usePromoteAllMutation,
} = studentsApi;
