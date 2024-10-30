import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../appBaseQuery";

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Courses",
    "Programmes",
    "Faculty",
    "Departments",
    "Levels",
    "Participants",
    "Instructors",
    "Semesters",
    "Sessions",
    "Forms",
    "Posts",
    "Faculties",
    "Students",
    "Applicants",
    "Media",
  ],
  endpoints: () => ({}),
});
