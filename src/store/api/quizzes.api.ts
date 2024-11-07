import {
  AssessmentResponse,
  CreateQuiz,
  FileUploadQuestionResponse,
  ManualUploadQuestion,
  ManualUploadQuestionResponse,
  QuizzesResponse,
  shareQuizInput,
  QuizResultResponse,
} from "../../types/quizzes";
import { appApi } from "./app.api";

// Single quiz submission types
interface SingleQuizSubmissionRequest {
  quiz_id: number;
  option_id: number;
  time_left: number; // float value for remaining time
}

interface SingleQuizSubmissionResponse {
  data: {
    result: Array<{
      assessment_id: number;
      created_at: string;
      right: number;
      wrong: number;
    }>;
  };
}

// Bulk quiz submission types
interface QuizSubmissionResponse {
  data: {
    result: Array<{
      assessment_id: number;
      created_at: string;
      right: number;
      wrong: number;
    }>;
  };
}

interface SingleQuizResponse {
  data: QuizzesResponse & {
    assessments: Array<{
      id: number;
      name: string;
      created_at: string;
      updated_at: string;
      questions: Array<{
        id: number;
        body: string;
        created_at: string;
        updated_at: string;
        options: Array<{
          id: number;
          body: string;
          is_answer: boolean;
          created_at: string;
          updated_at: string;
        }>;
      }>;
    }>;
  };
  message: string;
  status: string;
}

interface QuizSubmissionRequest {
  quiz_id: number;
  option_ids: number[];
  time_left: number; // float value for remaining time
}

const quizzesApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuizzes: builder.query<{ data: QuizzesResponse[] }, null>({
      query: () => `/quiz`,
      providesTags: ["Quiz"],
    }),

    getCourseQuizzes: builder.query<
      { data: QuizzesResponse[] },
      { course_id: number }
    >({
      query: ({ course_id }) => ({
        url: `/quiz?course_id=${course_id}`,
      }),
      providesTags: ["Quiz"],
    }),

    getSingleQuiz: builder.query<SingleQuizResponse, number>({
      query: (quizId) => `/quiz/${quizId}`,
      providesTags: ["Quiz"],
    }),

    getQuizResult: builder.query<QuizResultResponse, number>({
      query: (quizId: number) => `/quiz/result/${quizId}`,
      providesTags: ["Quiz"],
    }),

    getUserQuizResult: builder.query<
      QuizResultResponse,
      { quizId: number; userId: number }
    >({
      query: ({ quizId, userId }) => `/quiz/result/${quizId}/${userId}`,
      providesTags: ["Quiz"],
    }),

    // Single question submission
    submitSingleQuiz: builder.mutation<
      SingleQuizSubmissionResponse,
      SingleQuizSubmissionRequest
    >({
      query: (data) => ({
        url: "/quiz/submit",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Quiz"],
    }),

    // Multiple questions submission
    submitQuiz: builder.mutation<QuizSubmissionResponse, QuizSubmissionRequest>(
      {
        query: (data) => ({
          url: "/quiz/submit/all",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["Quiz"],
      }
    ),

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
      invalidatesTags: ["Quiz"],
    }),
    deleteQuiz: builder.mutation<{ message: string }, number>({
      query: (quiz_id) => ({
        url: `/quiz/${quiz_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Quiz"],
    }),
  }),
});

export const {
  useGetQuizzesQuery,
  useGetCourseQuizzesQuery,
  useGetSingleQuizQuery,
  useGetQuizResultQuery,
  useGetUserQuizResultQuery,
  useSubmitSingleQuizMutation,
  useSubmitQuizMutation,
  useAddQuizMutation,
  useCreateAssessmentMutation,
  useCreateQuestionFromFileMutation,
  useCreateQuestionManuallyMutation,
  useShareQuizMutation,
  useDeleteQuizMutation,
} = quizzesApi;
