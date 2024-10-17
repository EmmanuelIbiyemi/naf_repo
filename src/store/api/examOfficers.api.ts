import {
  ExamOfficer,
  ExamOfficerCreateType,
  ExamOfficerResponse,
} from "../../types/examOfficers";
import { appApi } from "./app.api";

const examOfficersApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getExamOfficers: builder.query<ExamOfficerResponse, null>({
      query: () => "/instructor",
      providesTags: ["ExamOfficers"],
    }),
    getExamOfficer: builder.query<ExamOfficerResponse, number>({
      query: (examOfficer_id) => `/instructor/${examOfficer_id}`,
      providesTags: ["ExamOfficers"],
    }),
    addExamOfficer: builder.mutation<ExamOfficerResponse, ExamOfficerCreateType>({
      query: (examOfficer) => ({
        url: `/instructor`,
        method: "POST",
        body: examOfficer,
      }),
      invalidatesTags: ["ExamOfficers"],
    }),
    updateExamOfficer: builder.mutation<ExamOfficerResponse, ExamOfficer>({
      query: (examOfficer) => ({
        url: `/instructor/${examOfficer.id}`,
        method: "PUT",
        body: examOfficer,
      }),
      invalidatesTags: ["ExamOfficers"],
    }),
    deleteExamOfficer: builder.mutation<ExamOfficerResponse, number>({
      query: (examOfficer_id) => ({
        url: `/instructor/${examOfficer_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ExamOfficers"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetExamOfficersQuery,
  useAddExamOfficerMutation,
  useUpdateExamOfficerMutation,
  useDeleteExamOfficerMutation,
  useGetExamOfficerQuery,
} = examOfficersApi;
