import {
  note,
  noteInput,
  NoteResponse,
  shareNoteInput,
} from "../../types/notes";
import { appApi } from "./app.api";

type PaginationType = {
  page: number;
  pages: number;
  per_page: number;
  total: number;
};

const notesApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query<note, null>({
      query: () => "/note",
      providesTags: ["Notes"],
    }),
    getNote: builder.query<note, number>({
      query: (note_id) => `/note/${note_id}`,
      providesTags: ["Notes"],
    }),
    getCourseNotes: builder.query<
      { data: note[]; pagination: PaginationType },
      { course_id: number; page: number }
    >({
      query: ({ course_id, page }) => `/note/course/${course_id}?page=${page}`,
      providesTags: ["Notes"],
    }),
    getParticipantCourseNotes: builder.query<NoteResponse, number>({
      query: (course_id) => `/note/mine/course/${course_id}`,
      providesTags: ["Notes"],
    }),
    addNote: builder.mutation<{ data: note }, noteInput>({
      query: (note) => ({
        url: `/note`,
        method: "POST",
        body: note,
      }),
      invalidatesTags: ["Notes"],
    }),
    shareNote: builder.mutation<{ message: string }, shareNoteInput>({
      query: (body) => ({
        url: `/note/share`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Notes"],
    }),
    updateNote: builder.mutation<note, { body: noteInput; id: number }>({
      query: ({ body, id }) => ({
        url: `/body/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Notes"],
    }),
    deleteNote: builder.mutation<{ message: string }, number>({
      query: (note_id) => ({
        url: `/note/${note_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notes"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNoteQuery,
  useGetNotesQuery,
  useGetCourseNotesQuery,
  useGetParticipantCourseNotesQuery,
  useAddNoteMutation,
  useShareNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApi;
