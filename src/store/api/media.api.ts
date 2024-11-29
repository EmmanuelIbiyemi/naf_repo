import { MediaResponse } from "../../types/media";
import { appApi } from "./app.api";

type Pagination = {
  page?: number;
  per_page?: number;
};

const mediasApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllMedia: builder.query<
      MediaResponse,
      Pagination & { mediaType?: string; search_term: string }
    >({
      query: ({ search_term, mediaType, page = 1, per_page = 12 }) => {
        if (mediaType)
          return `/media/type/${mediaType}?page=${page}&per_page=${per_page}${
            search_term ? "&search_term=" + search_term : ""
          }`;
        return `/media/all?page=${page}&per_page=${per_page}${
          search_term ? "&search_term=" + search_term : ""
        }`;
      },
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
  useGetMediaQuery,
  useAddMediaMutation,
  useDeleteMediaMutation,
} = mediasApi;
