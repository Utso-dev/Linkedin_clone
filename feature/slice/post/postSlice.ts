import baseApiSlice from "../baseApi";

export const postApi = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPost: builder.query({
      query: () => ({ url: "/posts", method: "GET" }),
      providesTags: ["Post"],
    }),

    getGroupList: builder.query({
      query: () => ({ url: "/group-list", method: "GET" }),
      providesTags: ["group"],
    }),

    getGroupTimeline: builder.query({
      query: ({ query }) => ({ url: `/group-posts/${query}`, method: "GET" }),
      providesTags: ["group"],
    }),

    getProfileTimeline: builder.query({
      query: ({ userId, query }) => ({
        url: `/timeline/${userId}?${query}`,
        method: "GET",
      }),
      providesTags: ["Post"],
    }),

    getNewsfeed: builder.query({
      query: ({ query }) => ({ url: `/newsfeed?${query}`, method: "GET" }),
      providesTags: ["Post"],
    }),

    getPostProfileById: builder.query({
      query: ({ id }) => ({ url: `/profile/posts/${id}`, method: "GET" }),
      providesTags: ["Post"],
    }),

    getGroupPostByID: builder.query({
      query: ({ id, groupId }) => ({
        url: `/groups/${groupId}/posts/${id}`,
        method: "GET",
      }),
      providesTags: ["group"],
    }),

    createPost: builder.mutation({
      query: (postData) => ({
        url: "/posts",
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["Post", "group"],
    }),

    updatePost: builder.mutation({
      query: ({ id, body }) => ({
        url: `/profile/posts/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Post"],
    }),
    advertisementsClick: builder.mutation({
      query: ({ id, placement = "newsfeed" }) => ({
        url: `/advertisements/${id}/click`,
        method: "POST",
        body: { placement },
      }),
    }),
    advertisementsImpression: builder.mutation({
      query: ({ campaign_ids, placement = "newsfeed" }) => ({
        url: `/advertisements/impressions`,
        method: "POST",
        body: { campaign_ids, placement },
      }),
    }),

    updateGroupPost: builder.mutation({
      query: ({ id, groupId, body }) => ({
        url: `/groups/${groupId}/posts/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["group"],
    }),

    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/profile/posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),

    deleteGroupPost: builder.mutation({
      query: ({ postId, groupId }) => ({
        url: `/groups/${groupId}/posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["group"],
    }),
  }),
});

export const {
  useGetPostQuery,
  useGetProfileTimelineQuery,
  useGetGroupListQuery,
  useGetNewsfeedQuery,
  useGetPostProfileByIdQuery,
  useGetGroupPostByIDQuery,
  useGetGroupTimelineQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useUpdateGroupPostMutation,
  useAdvertisementsClickMutation,
  useAdvertisementsImpressionMutation,
  useDeletePostMutation,
  useDeleteGroupPostMutation,
} = postApi;
