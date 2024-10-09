import { PostCreateType, PostResponse, PostType } from "../../types/posts";
import { appApi } from "./app.api";

const postsApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<PostResponse, null>({
      query: () => "/post",
      providesTags: ["Posts"],
    }),
    getPost: builder.query<PostResponse, number>({
      query: (post_id) => `/post/${post_id}`,
      providesTags: ["Posts"],
    }),
    getPostBySlug: builder.query<PostResponse, string>({
      query: (slug) => `/post/${slug}`,
      providesTags: ["Posts"],
    }),
    getPostCategories: builder.query<PostResponse, null>({
      query: () => `/post/categories`,
      providesTags: ["Posts"],
    }),
    getPostCategoriesByTag: builder.query<PostResponse, string>({
      query: (tag) => `post/category/page?tag=${tag}`,
      providesTags: ["Posts"],
    }),
    addPost: builder.mutation<PostResponse, PostCreateType>({
      query: (post) => ({
        url: `/post`,
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["Posts"],
    }),
    updatePost: builder.mutation<PostResponse, PostType>({
      query: (post) => ({
        url: `/post/${post.id}`,
        method: "PUT",
        body: post,
      }),
      invalidatesTags: ["Posts"],
    }),
    deletePost: builder.mutation<PostResponse, number>({
      query: (post_id) => ({
        url: `/post/${post_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts"],
    }),
    deletePostBlock: builder.mutation<
      PostResponse,
      { block_id: number; post_id: number }
    >({
      query: ({ block_id, post_id }) => ({
        url: `/post/${post_id}/block/${block_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPostsQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetPostQuery,
} = postsApi;
