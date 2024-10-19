import {
  LevelResponse,
  Level,
} from "../../types/levels";
import { appApi } from "./app.api";

const levelsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getLevels: builder.query<LevelResponse, null>({
      query: () => "/level/program/1",
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

    // Levels
    getProgramLevels: builder.query<LevelResponse, number>({
      query: (program_id) => `/level/programs/${program_id}`,
      providesTags: ["Programmes", "Levels"],
    }),

    // Course
    getLevelCourses: builder.query<
      LevelResponse,
      {
        level_id: number;
        page: number;
        per_page: number;
      }
    >({
      query: ({ level_id, page, per_page }) =>
        `/level/${level_id}/courses?page=${page}&per_page=${per_page}`,
      providesTags: ["Levels"],
    }),
    getLevelApplicants: builder.query<
      LevelResponse,
      {
        level_id: number;
        page: number;
        per_page: number;
      }
    >({
      query: ({ level_id, page, per_page }) =>
        `/level/${level_id}/participants?page=${page}&per_page=${per_page}`,
      providesTags: ["Levels", "Participants"],
    }),
    addLevelCourse: builder.mutation<LevelResponse, Level>({
      query: (level) => ({
        url: `/level/course`,
        method: "POST",
        body: level,
      }),
      invalidatesTags: ["Levels"],
    }),
    deleteLevelCourse: builder.mutation<
      LevelResponse,
      { course_id: number; level_id: number }
    >({
      query: ({ level_id, course_id }) => ({
        url: `/level/${level_id}/course/${course_id}`,
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
  useAddLevelCourseMutation,
} = levelsApi;
