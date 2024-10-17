import {
  LevelCoordinator,
  LevelCoordinatorCreateType,
  LevelCoordinatorResponse,
} from "../../types/levelCoordinators";
import { appApi } from "./app.api";

const levelCoordinatorsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getLevelCoordinators: builder.query<LevelCoordinatorResponse, null>({
      query: () => "/instructor",
      providesTags: ["LevelCoordinators"],
    }),
    getLevelCoordinator: builder.query<LevelCoordinatorResponse, number>({
      query: (levelCoordinator_id) => `/instructor/${levelCoordinator_id}`,
      providesTags: ["LevelCoordinators"],
    }),
    addLevelCoordinator: builder.mutation<LevelCoordinatorResponse, LevelCoordinatorCreateType>({
      query: (levelCoordinator) => ({
        url: `/instructor`,
        method: "POST",
        body: levelCoordinator,
      }),
      invalidatesTags: ["LevelCoordinators"],
    }),
    updateLevelCoordinator: builder.mutation<LevelCoordinatorResponse, LevelCoordinator>({
      query: (levelCoordinator) => ({
        url: `/instructor/${levelCoordinator.id}`,
        method: "PUT",
        body: levelCoordinator,
      }),
      invalidatesTags: ["LevelCoordinators"],
    }),
    deleteLevelCoordinator: builder.mutation<LevelCoordinatorResponse, number>({
      query: (levelCoordinator_id) => ({
        url: `/instructor/${levelCoordinator_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LevelCoordinators"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLevelCoordinatorsQuery,
  useAddLevelCoordinatorMutation,
  useUpdateLevelCoordinatorMutation,
  useDeleteLevelCoordinatorMutation,
  useGetLevelCoordinatorQuery,
} = levelCoordinatorsApi;
