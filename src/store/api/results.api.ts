import {
  ResultResponse,
  ResultsGetInput,
  ResultType2,
  LegacyResultCreateType,
  LegacyResultResponse,
  LegacyResultUploadPayload,
  LegacyResultUploadResponse,
} from "../../types/results.ts";
import { appApi } from "./app.api.ts";

const scoreApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getResults: builder.query<ResultResponse, ResultsGetInput>({
      query: ({ department_id, level_id, semester, session }) =>
        `/result?department_id=${department_id}&level_id=${level_id}&session=${session}&semester=${semester}`,
      providesTags: ["Results"],
    }),
    getResultsM: builder.mutation<ResultType2, ResultsGetInput>({
      query: ({ department_id, level_id, semester, session }) =>
        `/result?department_id=${department_id}&level_id=${level_id}&session=${session}&semester=${semester}`,
    }),
    getResult: builder.query<ResultResponse, number>({
      query: (score_id) => `/scoring/${score_id}`,
      providesTags: ["Results"],
    }),
    generateResult: builder.mutation<ResultResponse, ResultsGetInput>({
      query: (result) => ({
        url: `/result`,
        method: "POST",
        body: result,
      }),
      invalidatesTags: ["Results"],
    }),
    addLegacyResult: builder.mutation<
      LegacyResultResponse,
      LegacyResultCreateType
    >({
      query: (payload) => ({
        url: `/result/manual`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Results", "Transcripts"],
    }),
    uploadLegacyResults: builder.mutation<
      LegacyResultUploadResponse,
      LegacyResultUploadPayload
    >({
      query: (payload) => ({
        url: `/result/manual/upload`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Results", "Transcripts"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetResultsQuery,
  useGetResultsMMutation,
  useGetResultQuery,
  useGenerateResultMutation,
  useAddLegacyResultMutation,
  useUploadLegacyResultsMutation,
} = scoreApi;
