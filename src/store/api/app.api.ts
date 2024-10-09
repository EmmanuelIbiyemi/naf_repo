import { createApi } from "@reduxjs/toolkit/query/react";
import { myBaseQuery } from "../appBaseQuery";

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: myBaseQuery,
  tagTypes: [
    "Courses",
    "Programs",
    "Faculty",
    "Departments",
    "Levels",
    "Participants",
    "Instructors",
    "Semesters",
    "Sessions",
    "Forms",
  ],
  endpoints: () => ({}),
});
