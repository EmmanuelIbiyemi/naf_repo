import { LevelCreateType, LevelsResponse, LevelType } from "../../types/levels";
import { appApi } from "./app.api";

const levelsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getLevels: builder.query<
      LevelsResponse,
      { program_id: number; search_term?: string }
    >({
      query: ({ program_id, search_term }) =>
        `/level/program/${program_id}?page=${1}&per_page=${100}${
          search_term ? "&search_term=" + search_term : ""
        }`,
      providesTags: ["Levels"],
    }),
    getLevelsM: builder.mutation<
      LevelsResponse,
      { program_id: number; search_term?: string }
    >({
      query: ({ program_id, search_term }) =>
        `/level/program/${program_id}?page=${1}&per_page=${100}${
          search_term ? "&search_term=" + search_term : ""
        }`,
    }),
    getLevel: builder.query<LevelsResponse, number>({
      query: (level_id) => `/level/1/${level_id}`,
      providesTags: ["Levels"],
    }),
    addLevel: builder.mutation<LevelsResponse, LevelCreateType>({
      query: (level) => ({
        url: `/level`,
        method: "POST",
        body: level,
      }),
      invalidatesTags: ["Levels"],
    }),
    updateLevel: builder.mutation<LevelsResponse, LevelType>({
      query: (level) => ({
        url: `/level/${level.id}`,
        method: "PUT",
        body: level,
      }),
      invalidatesTags: ["Levels"],
    }),
    deleteLevel: builder.mutation<LevelsResponse, number>({
      query: (level_id) => ({
        url: `/level/${level_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Levels"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLevelsQuery,
  useGetLevelsMMutation,
  useAddLevelMutation,
  useUpdateLevelMutation,
  useDeleteLevelMutation,
} = levelsApi;
