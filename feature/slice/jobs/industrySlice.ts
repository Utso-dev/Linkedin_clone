import baseApiSlice from "../baseApi";

export const postApi = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getIndustryPost: builder.query({
      query: () => ({ url: "/posts", method: "GET" }),
      providesTags: ["Post"],
    }),
    getIndustryJobPost: builder.query({
      query: (arg) => {
        const {
          industryId,
          cursor,
          per_page = 10,
        } = typeof arg === "object" && arg !== null ? arg : { industryId: arg };

        return {
          url: `/industry/${industryId}/jobs`,
          method: "GET",
          params: {
            per_page,
            ...(cursor ? { cursor } : {}),
          },
        };
      },
      providesTags: ["Post", "UserJob"],
    }),
    getIndustryProductPost: builder.query({
      query: (arg) => {
        const {
          industryId,
          cursor,
          per_page = 10,
        } = typeof arg === "object" && arg !== null ? arg : { industryId: arg };

        return {
          url: `/industry/${industryId}/products`,
          method: "GET",
          params: {
            per_page,
            ...(cursor ? { cursor } : {}),
          },
        };
      },
      providesTags: ["Post"],
    }),
    getIndustryPublicationPost: builder.query({
      query: (industryId) => ({
        url: `/industry/${industryId}/publications`,
        method: "GET",
      }),
      providesTags: ["Post"],
    }),
    getRelatedIndustry: builder.query({
      query: (industryId) => ({
        url: `/industry/${industryId}/related`,
        method: "GET",
      }),
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
    likebyIndustryProduct: builder.mutation({
      query: (id) => ({
        url: `/industry/products/${id}/like`,
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
  useGetIndustryJobPostQuery,
  useGetIndustryProductPostQuery,
  useGetIndustryPublicationPostQuery,
  useGetRelatedIndustryQuery,
  useLikebyIndustryProductMutation,
  useUpdateIndustryPostMutation,
  useDeleteIndustryPostMutation,
  useFollowIndustryMutation,
} = postApi;
