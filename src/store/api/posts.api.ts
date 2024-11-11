import { PostsResponseAnnouncement } from "../../types/announcements";
import { PostCreateType, PostResponse, PostsResponse } from "../../types/posts";
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
    getPostM: builder.mutation<PostResponse, number>({
      query: (post_id) => `/post/${post_id}`,
    }),
    getPostBySlug: builder.query<PostResponse, string>({
      query: (slug) => `/post/${slug}`,
      providesTags: ["Posts"],
    }),
    getPostCategories: builder.query<PostsResponse, null>({
      query: () => `/post/categories`,
      providesTags: ["Posts"],
    }),
    getPostByCategory: builder.query<PostsResponse, string>({
      query: (tag) => `post/category/${tag}`,
      providesTags: ["Posts"],
    }),
    getAnnouncements: builder.query<PostsResponseAnnouncement, string>({
      query: (tag) => `post/category/${tag}`,
      providesTags: ["Posts"],
    }),
    getPostCategoriesByTag: builder.query<PostsResponse, string>({
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
    updatePost: builder.mutation<PostResponse, PostCreateType>({
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
    deletePostBlock: builder.mutation<PostResponse, number>({
      query: (block_id) => ({
        url: `/post/block/${block_id}`,
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
  useDeletePostBlockMutation,
  useGetPostQuery,
  useGetPostMMutation,
  useGetPostCategoriesQuery,
  useGetPostCategoriesByTagQuery,
  useGetPostBySlugQuery,
  useGetPostByCategoryQuery,
  useGetAnnouncementsQuery
} = postsApi;
