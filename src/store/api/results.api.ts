import { ResultResponse, ResultsGetInput } from "../../types/results.ts";
import { appApi } from "./app.api.ts";

const scoreApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getResults: builder.query<ResultResponse, ResultsGetInput>({
      query: ({ department_id, level_id, semester, session }) =>
        `/result?department_id=${department_id}&level_id=${level_id}&session=${session}&semester=${semester}`,
      providesTags: ["Results"],
    }),
    getResultsM: builder.mutation<ResultResponse, ResultsGetInput>({
      query: ({ department_id, level_id, semester, session }) =>
        `/result?department_id=${department_id}&level_id=${level_id}&session=${session}&semester=${semester}`,
    }),
    getResult: builder.query<ResultResponse, number>({
      query: (score_id) => `/scoring/${score_id}`,
      providesTags: ["Results"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetResultsQuery, useGetResultsMMutation, useGetResultQuery } =
  scoreApi;
