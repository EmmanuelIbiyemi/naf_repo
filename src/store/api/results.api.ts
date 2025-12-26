import {
  ResultResponse,
  ResultsGetInput,
  ResultType2,
  LegacyResultUploadPayload,
  ResultTaskStartResponse,
  ResultVisibilityPayload,
  ResultVisibilityResponse,
  ResultDeletePayload,
  ResultDeleteResponse,
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
    generateResult: builder.mutation<ResultTaskStartResponse, ResultsGetInput>({
      query: (result) => ({
        url: `/result`,
        method: "POST",
        body: result,
      }),
      invalidatesTags: ["Results"],
    }),
    uploadLegacyResults: builder.mutation<
      ResultTaskStartResponse,
      LegacyResultUploadPayload
    >({
      query: (payload) => ({
        url: `/result/manual/upload`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Results", "Transcripts"],
    }),
    setResultVisibility: builder.mutation<
      ResultVisibilityResponse,
      ResultVisibilityPayload
    >({
      query: (payload) => ({
        url: `/result/visibility`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Results", "Transcripts"],
    }),
    deleteResults: builder.mutation<
      ResultDeleteResponse,
      ResultDeletePayload
    >({
      query: (payload) => ({
        url: `/result`,
        method: "DELETE",
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
  useUploadLegacyResultsMutation,
  useSetResultVisibilityMutation,
  useDeleteResultsMutation,
} = scoreApi;
