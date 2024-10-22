import { LevelCreateType, LevelsResponse, LevelType } from "../../types/levels";
import { appApi } from "./app.api";

const levelsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getLevels: builder.query<LevelsResponse, number>({
      query: (program_id) => `/level/program/${program_id}`,
      providesTags: ["Levels"],
    }),
    getLevel: builder.query<LevelResponse, number>({
      query: (level_id) => `/level/1/${level_id}`,
      providesTags: ["Levels"],
    }),
    addLevel: builder.mutation<LevelResponse, Level>({
      query: (level) => ({
        url: `/level`,
        method: "POST",
        body: level,
      }),
      invalidatesTags: ["Levels"],
    }),
    updateLevel: builder.mutation<LevelResponse, Level>({
      query: (level) => ({
        url: `/level/${level.id}`,
        method: "PUT",
        body: level,
      }),
      invalidatesTags: ["Levels"],
    }),
    deleteLevel: builder.mutation<LevelResponse, number>({
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
  useAddLevelMutation,
  useUpdateLevelMutation,
  useDeleteLevelMutation,
} = levelsApi;
