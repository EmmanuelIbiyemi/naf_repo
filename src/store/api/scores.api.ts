import {
  ScoreCreateType,
  ScoreResponse,
  Score,
} from "../../types/scores.ts";
import { appApi } from "./app.api";

const scoreApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getScores: builder.query<ScoreResponse, null>({
      query: () => `/scoring/program/1`,
      providesTags: ["Scores"],
    }),
    getScore: builder.query<ScoreResponse, number>({
      query: (score_id) => `/scoring/${score_id}`,
      providesTags: ["Scores"],
    }),
    addScore: builder.mutation<ScoreResponse, ScoreCreateType>({
      query: (score: ScoreCreateType) => ({
        url: `/scoring`,
        method: "POST",
        body: score,
      }),
      invalidatesTags: ["Scores"],
    }),
    updateScore: builder.mutation<ScoreResponse, Score>({
      query: (score: Score) => ({
        url: `/scoring/${score.id}`,
        method: "PUT",
        body: score,
      }),
      invalidatesTags: ["Scores"],
    }),
    deleteScore: builder.mutation<ScoreResponse, number>({
      query: (score_id: number) => ({
        url: `/scoring/${score_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Scores"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetScoresQuery,
  useGetScoreQuery,
  useAddScoreMutation,
  useUpdateScoreMutation,
  useDeleteScoreMutation,
} = scoreApi;
