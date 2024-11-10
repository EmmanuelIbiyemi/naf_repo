import {
  bulkScoresInput,
  importQuizScoresInput,
  recordInput,
  recordResponse,
  scoresInput,
  scoresResponse,
  updateRecordInput,
} from "../../types/records";
import { appApi } from "./app.api";

const recordsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecord: builder.query<{ data: recordResponse[] }, { course_id: number }>(
      {
        query: ({ course_id }) => `/record/course/${course_id}`,
        providesTags: ["Record"],
      }
    ),
    addRecord: builder.mutation<{ data: recordResponse }, recordInput>({
      query: (record) => ({
        url: `/record`,
        method: "POST",
        body: record,
      }),
      invalidatesTags: ["Record"],
    }),
    updateRecord: builder.mutation<
      { data: recordResponse },
      { id: number } & updateRecordInput
    >({
      query: ({ id, ...record }) => ({
        url: `/record/${id}`,
        method: "PATCH",
        body: record,
      }),
      invalidatesTags: ["Record"],
    }),
    addRecordScores: builder.mutation<{ data: scoresResponse }, scoresInput>({
      query: (record) => ({
        url: `/score`,
        method: "POST",
        body: record,
      }),
      invalidatesTags: ["Record"],
    }),
    addBulkRecordScores: builder.mutation<
      { data: scoresResponse },
      bulkScoresInput
    >({
      query: (record) => ({
        url: `/score/bulk`,
        method: "POST",
        body: record,
      }),
      invalidatesTags: ["Record"],
    }),
    importScoresFromRecord: builder.mutation<
      { message: string; status: string },
      importQuizScoresInput
    >({
      query: (score) => ({
        url: `/score/import/quiz`,
        method: "POST",
        body: score,
      }),
      invalidatesTags: ["Record"],
    }),
    deleteRecord: builder.mutation<
      { message: string; status: string },
      { record_id: number }
    >({
      query: ({ record_id }) => ({
        url: `/record/${record_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Record"],
    }),
    deleteRecordScore: builder.mutation<
      { message: string; status: string },
      { score_id: number }
    >({
      query: ({ score_id }) => ({
        url: `/score/${score_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Record"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRecordQuery,
  useAddRecordMutation,
  useUpdateRecordMutation,
  useAddRecordScoresMutation,
  useAddBulkRecordScoresMutation,
  useImportScoresFromRecordMutation,
  useDeleteRecordMutation,
  useDeleteRecordScoreMutation,
} = recordsApi;
