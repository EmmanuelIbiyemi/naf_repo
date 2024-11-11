import { CreateLiveClass, LiveClassesResponse } from "../../types/classes";
import { appApi } from "./app.api";

type PaginationType = {
  page: number;
  pages: number;
  per_page: number;
  total: number;
};

const liveClassesApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getLiveClasses: builder.query<
      { data: LiveClassesResponse[]; pagination: PaginationType },
      {
        courseId: number | null;
        semester: string | undefined;
        session: string | undefined;
        page: number;
      }
    >({
      query: ({ courseId, semester, session, page }) =>
        `/liveclass?course_id=${courseId}&semester=${semester}&session=${session}&page=${page}`,
      providesTags: ["Live"],
    }),
    addLiveClass: builder.mutation<
      { data: LiveClassesResponse },
      CreateLiveClass
    >({
      query: (course) => ({
        url: `/liveclass`,
        method: "POST",
        body: course,
      }),
      invalidatesTags: ["Live"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetLiveClassesQuery, useAddLiveClassMutation } =
  liveClassesApi;
