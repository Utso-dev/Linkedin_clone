import baseApiSlice from "../baseApi";

const boostingSlice = baseApiSlice.injectEndpoints({
  endpoints: (build) => ({
    getBoostingPlan: build.query({
      query: () => ({
        url: `/industry/boost-packages`,
        method: "GET",
      }),
      providesTags: ["boosting"],
    }),
    getBoostingPosts: build.query({
      query: (params) => ({
        url: `/job-boosting/list`,
        method: "GET",
        params,
      }),
      providesTags: ["boosting"],
    }),
    getBoostOrderSummary: build.query({
      query: ({ productId, ...params }) => ({
        url: `/industry/products/${productId}/boost/order-summary`,
        method: "GET",
        params,
      }),
    }),
    sendBoostOtp: build.mutation({
      query: ({ productId, ...body }) => ({
        url: `/industry/products/${productId}/boost/send-otp`,
        method: "POST",
        body,
      }),
    }),
    resendBoostOtp: build.mutation({
      query: ({ productId, ...body }) => ({
        url: `/industry/products/${productId}/boost/resend-otp`,
        method: "POST",
        body,
      }),
    }),
    purchaseBoost: build.mutation({
      query: ({ productId, ...body }) => ({
        url: `/industry/products/${productId}/boost/purchase`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["boosting", "Advertisement"],
    }),
    confirmBoost: build.mutation({
      query: ({ productId, ...body }) => ({
        url: `/industry/products/${productId}/boost/confirm`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["boosting", "Advertisement"],
    }),
  }),
});

export const {
  useGetBoostingPlanQuery,
  useGetBoostingPostsQuery,
  useGetBoostOrderSummaryQuery,
  useLazyGetBoostOrderSummaryQuery,
  useSendBoostOtpMutation,
  useResendBoostOtpMutation,
  usePurchaseBoostMutation,
  useConfirmBoostMutation,
} = boostingSlice;

