import { createApi } from "@reduxjs/toolkit/query/react";
import { myBaseQuery } from "../appBaseQuery";

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: myBaseQuery,
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
    "Lecturers",
    "Students",
    "LevelCoordinators",
    "ExamOfficers",
  ],
  endpoints: () => ({}),
});
