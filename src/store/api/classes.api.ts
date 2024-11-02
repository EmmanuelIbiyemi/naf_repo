import { CreateLiveClass, LiveClassesResponse } from "../../types/classes";
import { appApi } from "./app.api";

const liveClassesApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getLiveClasses: builder.query<
      { data: LiveClassesResponse[] },
      {
        courseId: number;
        semester: string | undefined;
        session: string | undefined;
      }
    >({
      query: ({ courseId, semester, session }) =>
        `/liveclass?course_id=${courseId}&semester=${semester}&session=${session}`,
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
