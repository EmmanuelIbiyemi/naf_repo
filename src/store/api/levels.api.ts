import {
  LevelCourseCreateType,
  LevelCreateType,
  LevelsResponse,
  LevelType,
} from "../../types/levels";
import { appApi } from "./app.api";

const levelsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getLevels: builder.query<LevelsResponse, null>({
      query: () => "/level",
      providesTags: ["Levels"],
    }),
    getLevel: builder.query<LevelsResponse, number>({
      query: (level_id) => `/level/${level_id}`,
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

    // Levels
    getProgramLevels: builder.query<LevelsResponse, number>({
      query: (program_id) => `/level/programs/${program_id}`,
      providesTags: ["Programs", "Levels"],
    }),

    // Course
    getLevelCourses: builder.query<
      LevelsResponse,
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
      LevelsResponse,
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
    addLevelCourse: builder.mutation<LevelsResponse, LevelCourseCreateType>({
      query: (level) => ({
        url: `/level/course`,
        method: "POST",
        body: level,
      }),
      invalidatesTags: ["Levels"],
    }),
    deleteLevelCourse: builder.mutation<
      LevelsResponse,
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
