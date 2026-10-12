import baseApiSlice from "../baseApi";

export const postApi = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getIndustryPost: builder.query({
      query: () => ({ url: "/posts", method: "GET" }),
      providesTags: ["Post"],
    }),
    createIndustryPost: builder.mutation({
      query: (postData) => ({
        url: "/industry/post/create",
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["Post", "group"],
    }),

    updateIndustryPost: builder.mutation({
      query: ({ id, body }) => ({
        url: `/industry/post/update/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Post"],
    }),
    followIndustry: builder.mutation({
      query: ({ id }) => ({
        url: `/industry/follow/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Post"],
    }),

    deleteIndustryPost: builder.mutation({
      query: (postId) => ({
        url: `/industry/post/delete/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const {
  useGetIndustryPostQuery,
  useCreateIndustryPostMutation,
  useUpdateIndustryPostMutation,
  useDeleteIndustryPostMutation,
  useFollowIndustryMutation,
} = postApi;
