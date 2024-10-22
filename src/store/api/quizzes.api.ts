import {
  AssessmentResponse,
  CreateQuiz,
  QuizzesResponse,
} from "../../types/quizzes";
import { appApi } from "./app.api";

const quizzesApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuizzes: builder.query<{ data: QuizzesResponse[] }, null>({
      query: () => `/quiz`,
      providesTags: ["Quiz"],
    }),
    addQuiz: builder.mutation<{ data: QuizzesResponse }, CreateQuiz>({
      query: (values) => ({
        url: `/quiz`,
        method: "POST",
        body: values,
      }),
      invalidatesTags: ["Courses"],
    }),
    createAssessment: builder.mutation<
      { data: AssessmentResponse },
      { name: string; quiz_id: number }
    >({
      query: (values) => ({
        url: `/assessment`,
        method: "POST",
        body: values,
      }),
      invalidatesTags: ["Courses"],
    }),
  }),
});

export const {
  useGetQuizzesQuery,
  useAddQuizMutation,
  useCreateAssessmentMutation,
} = quizzesApi;
