import {
  FormCreateType2,
  FormField,
  FormResponse,
  FormsResponse,
  FormType2,
} from "../../types/forms";
import { appApi } from "./app.api";

const formsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getForms: builder.query<FormsResponse, null>({
      query: () => "/form",
      providesTags: ["Forms"],
    }),
    getForm: builder.query<FormResponse, number>({
      query: (form_id) => `/form/${form_id}`,
      providesTags: ["Forms"],
    }),
    getFormM: builder.mutation<FormResponse, number>({
      query: (form_id) => `/form/${form_id}`,
    }),
    getFormByName: builder.query<FormResponse, string>({
      query: (name) => `/form?name=${name}`,
      providesTags: ["Forms"],
    }),
    getFormByProgramId: builder.query<FormResponse, string>({
      query: (name) => `/form/program/${name}`,
      providesTags: ["Forms"],
    }),
    getFormFieldByKeyM: builder.mutation<{ data: FormField }, string>({
      query: (key) => `formfield?key=${key}`,
    }),
    addForm: builder.mutation<FormResponse, FormCreateType2>({
      query: (form) => ({
        url: `/form`,
        method: "POST",
        body: form,
      }),
      invalidatesTags: ["Forms"],
    }),
    addFormSection: builder.mutation<
      FormResponse,
      {
        name: string;
        form_id: number;
      }
    >({
      query: (section) => ({
        url: `/formsection`,
        method: "POST",
        body: section,
      }),
      invalidatesTags: ["Forms"],
    }),
    addFormRow: builder.mutation<FormResponse, { formsection_id: number }>({
      query: (row) => ({
        url: `/formrow`,
        method: "POST",
        body: row,
      }),
      invalidatesTags: ["Forms"],
    }),
    addFormField: builder.mutation<
      FormResponse,
      {
        key: string;
        name: string;
        placeholder: string;
        type: string;
        formrow_id: number;
      }
    >({
      query: (formField) => ({
        url: `/formfield`,
        method: "POST",
        body: formField,
      }),
      invalidatesTags: ["Forms"],
    }),
    updateForm: builder.mutation<
      FormResponse,
      Omit<FormType2, "sections" | "updated_at">
    >({
      query: (form) => ({
        url: `/form/${form.id}`,
        method: "PUT",
        body: form,
      }),
      invalidatesTags: ["Forms"],
    }),
    updateFormField: builder.mutation<{ data: FormField }, FormField>({
      query: (formfield) => ({
        url: `/formfield/${formfield.id}`,
        method: "PUT",
        body: formfield,
      }),
      invalidatesTags: ["Forms"],
    }),
    deleteForm: builder.mutation<FormResponse, number>({
      query: (form_id) => ({
        url: `/form/${form_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Forms"],
    }),
    deleteFormRow: builder.mutation<FormResponse, number>({
      query: (formrow_id) => ({
        url: `/formrow/${formrow_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Forms"],
    }),
    deleteFormField: builder.mutation<FormResponse, number>({
      query: (formfield_id) => ({
        url: `/formfield/${formfield_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Forms"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFormsQuery,
  useGetFormMMutation,
  useAddFormMutation,
  useAddFormRowMutation,
  useUpdateFormMutation,
  useDeleteFormMutation,
  useGetFormQuery,
  useGetFormByNameQuery,
  useGetFormByProgramIdQuery,
  useGetFormFieldByKeyMMutation,
  useAddFormSectionMutation,
  useAddFormFieldMutation,
  useDeleteFormFieldMutation,
  useDeleteFormRowMutation,
  useUpdateFormFieldMutation,
} = formsApi;
