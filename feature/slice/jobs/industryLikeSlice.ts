import baseApiSlice from "../baseApi";

export const likeSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getIndustryLikeList: builder.query({
      query: ({query}) => ({
        url: `/industry/post/likes/${query}`,
      }),
      providesTags: ["Post", "Comment"],
    }),

    replyIndustryLikeList: builder.query({
      query: ({query}) => ({
        url: `/industry/post/comment/likes/${query}`,
      }),
      providesTags: ["Post", "Comment"],
    }),

    getCommentIndustryLikeListByPostId: builder.query({
      query: ({query}) => ({
        url: `/comment-liked-list/${query}`,
      }),
      providesTags: ["Post", "Comment"],
    }),



    postIndustryToggleLike: builder.mutation({
      query: ({ postId }) => ({
        url: `/industry/post/like/${postId}`,
        method: "POST",
      }),
      invalidatesTags: ["Comment", "Post"],
    }),

    commentIndustryLikePost: builder.mutation({
      query: ({ commentId }) => ({
        url: `/industry/post/comment/like/${commentId}`,
        method: "POST",
      }),
      invalidatesTags: ["Comment"],
    }),

    replyIndustryToggleLikeById: builder.mutation({
      query: ({ commentId }) => ({
        url: `/industry/post/comment/reply/toggle-like/${commentId}`,
        method: "POST",
      }),
      invalidatesTags: ["Comment"],
    }),
  }),
});

export const {
  useGetIndustryLikeListQuery,
  useReplyIndustryLikeListQuery,
  useGetCommentIndustryLikeListByPostIdQuery,
  usePostIndustryToggleLikeMutation,
  useCommentIndustryLikePostMutation,
  useReplyIndustryToggleLikeByIdMutation,
} = likeSlice;
