import {
  bulkScoresInput,
  recordInput,
  recordResponse,
  scoresInput,
  scoresResponse,
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
      query: (course) => ({
        url: `/record`,
        method: "POST",
        body: course,
      }),
      invalidatesTags: ["Record"],
    }),
    addRecordScores: builder.mutation<{ data: scoresResponse }, scoresInput>({
      query: (course) => ({
        url: `/score`,
        method: "POST",
        body: course,
      }),
      invalidatesTags: ["Record"],
    }),
    addBulkRecordScores: builder.mutation<
      { data: scoresResponse },
      bulkScoresInput
    >({
      query: (course) => ({
        url: `/score/bulk`,
        method: "POST",
        body: course,
      }),
      invalidatesTags: ["Record"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRecordQuery,
  useAddRecordMutation,
  useAddRecordScoresMutation,
  useAddBulkRecordScoresMutation,
} = recordsApi;
