import { InstructorsResponse } from "../../types/instructors";
import { appApi } from "./app.api";

const instructorsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getInstructors: builder.query<InstructorsResponse, null>({
      query: () => "/instructor",
    }),
  }),
  overrideExisting: false,
});

export const { useGetInstructorsQuery } = instructorsApi;
