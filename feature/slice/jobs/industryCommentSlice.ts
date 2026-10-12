import baseApiSlice from "../baseApi";

export const commentApi = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getIndustryAllCommentListByPostId: builder.query({
      query: ({ query }) => {
        return {
          url: `/industry/post/comments/${query}`,
          method: "GET",
        };
      },
      providesTags: ["Comment"],
    }),

    getIndustryReplyListByCommentId: builder.query({
      query: (commentId) => ({
        url: `/industry/post/comment/replies/${commentId}`,
        method: "GET",
      }),
      providesTags: ["Comment"],
    }),
    IndustrycommentPostById: builder.mutation({
      query: ({ commentData, postId }) => ({
        url: `/industry/post/comment/${postId}`,
        method: "POST",
        body: commentData,
      }),
      invalidatesTags: ["Comment", "Post"],
    }),
    IndustrycommentReplyByCommentId: builder.mutation({
      query: ({ commentData, commentId }) => ({
        url: `/industry/post/comment/reply/${commentId}`,
        method: "POST",
        body: commentData,
      }),
      invalidatesTags: ["Comment", "Post"],
    }),

    IndustrycommentDelete: builder.mutation({
      query: (commentId) => ({
        url: `/industry/post/comment/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Comment"],
    }),

  }),
});

export const {
  useGetIndustryAllCommentListByPostIdQuery,
  useGetIndustryReplyListByCommentIdQuery,
  useIndustrycommentPostByIdMutation,
  useIndustrycommentDeleteMutation,
} = commentApi;
