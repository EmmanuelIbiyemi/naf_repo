import { FormCreateType2, FormResponse, FormType2 } from "../../types/forms";
import { appApi } from "./app.api";

const formsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getForms: builder.query<FormResponse, null>({
      query: () => "/form",
      providesTags: ["Forms"],
    }),
    getForm: builder.query<FormResponse, number>({
      query: (form_id) => `/form/${form_id}`,
      providesTags: ["Forms"],
    }),
    getFormByName: builder.query<FormResponse, string>({
      query: (name) => `/form?name=${name}`,
      providesTags: ["Forms"],
    }),
    getFormByProgramId: builder.query<FormResponse, string>({
      query: (name) => `/form/program/${name}`,
      providesTags: ["Forms"],
    }),
    getFormFieldByKey: builder.query<FormResponse, string>({
      query: (key) => `formfield?key=${key}`,
      providesTags: ["Forms"],
    }),
    addForm: builder.mutation<FormResponse, FormCreateType2>({
      query: (form) => ({
        url: `/form`,
        method: "POST",
        body: form,
      }),
      invalidatesTags: ["Forms"],
    }),
    updateForm: builder.mutation<FormResponse, FormType2>({
      query: (form) => ({
        url: `/form/${form.id}`,
        method: "PUT",
        body: form,
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
  }),
  overrideExisting: false,
});

export const {
  useGetFormsQuery,
  useAddFormMutation,
  useUpdateFormMutation,
  useDeleteFormMutation,
  useGetFormQuery,
  useGetFormByNameQuery,
  useGetFormByProgramIdQuery,
  useGetFormFieldByKeyQuery,
} = formsApi;
