import {
  AssessmentResponse,
  CreateQuiz,
  FileUploadQuestionResponse,
  ManualUploadQuestion,
  ManualUploadQuestionResponse,
  QuizzesResponse,
  shareQuizInput,
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
      invalidatesTags: ["Quiz"],
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
      invalidatesTags: ["Quiz"],
    }),
    createQuestionFromFile: builder.mutation<
      { data: FileUploadQuestionResponse },
      { file_url: string; assessment_id: number }
    >({
      query: (values) => ({
        url: `/question/bulk/file`,
        method: "POST",
        body: values,
      }),
      invalidatesTags: ["Quiz"],
    }),
    createQuestionManually: builder.mutation<
      { data: ManualUploadQuestionResponse },
      ManualUploadQuestion
    >({
      query: (values) => ({
        url: `/question/bulk`,
        method: "POST",
        body: values,
      }),
      invalidatesTags: ["Quiz"],
    }),
    shareQuiz: builder.mutation<{ message: string }, shareQuizInput>({
      query: (body) => ({
        url: `/quiz/publish`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Notes"],
    }),
  }),
});

export const {
  useGetQuizzesQuery,
  useAddQuizMutation,
  useCreateAssessmentMutation,
  useCreateQuestionFromFileMutation,
  useCreateQuestionManuallyMutation,
  useShareQuizMutation,
} = quizzesApi;
