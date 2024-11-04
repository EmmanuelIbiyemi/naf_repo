import { MediaResponse } from "../../types/media";
import { appApi } from "./app.api";

type Pagination = {
  page?: number;
  per_page?: number;
};

const mediasApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMedia: builder.query<MediaResponse, Pagination>({
      query: ({ page = 1, per_page = 10 }) =>
        `/media/all?page=${page}&per_page=${per_page}`,
      providesTags: ["Media"],
    }),
    getAllByTypeMedia: builder.query<
      MediaResponse,
      Pagination & { mediaType: string }
    >({
      query: ({ page = 1, per_page = 10, mediaType }) =>
        `/media/type/${mediaType}?page=${page}&per_page=${per_page}`,
      providesTags: ["Media"],
    }),
    getMedia: builder.query<MediaResponse, number>({
      query: (media_id) => `/media/${media_id}`,
      providesTags: ["Media"],
    }),
    addMedia: builder.mutation<MediaResponse, FormData>({
      query: (media) => ({
        url: `/media`,
        method: "POST",
        body: media,
      }),
      invalidatesTags: ["Media", "Posts"],
    }),
    deleteMedia: builder.mutation<MediaResponse, number>({
      query: (media_id) => ({
        url: `/media/${media_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Media"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllMediaQuery,
  useGetAllByTypeMediaQuery,
  useGetMediaQuery,
  useAddMediaMutation,
  useDeleteMediaMutation,
} = mediasApi;
