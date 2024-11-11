import {
  LiveClass,
  LiveClassResponse,
  SingleLiveClassResponse,
} from "../../types/liveClass";
import { appApi } from "./app.api";

const liveClassApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getLiveClasses: builder.query<
      LiveClassResponse,
      { course_id: string; semester: string; session: string; page:number; per_page:number }
    >({
      query: (params) => ({
        url: "/liveclass",
        params: params,
      }),
      providesTags: ["LiveClasses"],
    }),

    getSingleLiveClass: builder.query<SingleLiveClassResponse, number>({
      query: (class_id) => `/liveclass/${class_id}`,
      providesTags: (_result, _error, id) => [{ type: "LiveClasses", id }],
    }),

    createLiveClass: builder.mutation<SingleLiveClassResponse, LiveClass>({
      query: (liveClass) => ({
        url: "/liveclass",
        method: "POST",
        body: liveClass,
      }),
      invalidatesTags: ["LiveClasses"],
    }),

    deleteLiveClass: builder.mutation<void, number>({
      query: (class_id) => ({
        url: `/liveclass/${class_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LiveClasses"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLiveClassesQuery,
  useGetSingleLiveClassQuery,
  useCreateLiveClassMutation,
  useDeleteLiveClassMutation,
} = liveClassApi;
