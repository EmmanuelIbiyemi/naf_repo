import { CoursesResponse } from "../../types/courses";
import { appApi } from "./app.api";

const coursesApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<CoursesResponse, null>({
      query: () => "/course",
    }),
  }),
  overrideExisting: false,
});

export const { useGetCoursesQuery } = coursesApi;
