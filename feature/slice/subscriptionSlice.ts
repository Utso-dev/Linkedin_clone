import baseApiSlice from "./baseApi";

const subscriptionSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionPlans: builder.query({
      query: (billingCycle) => ({
        url: `/plans`,
        method: "GET",
        params: {
          billing_cycle: billingCycle,
        },
      }),
    }),
    getSubscriptionSinglePlans: builder.query({
      query: (id) => ({
        url: `/plans/${id}`,
        method: "GET",
      }),
    }),
    sendSubscriptionOTPRequest: builder.mutation({
      query: (otpData) => ({
        url: "/subscriptions/send-otp",
        method: "POST",
        body: otpData,
      }),
    }),
    sendSubscriptionConfirmation: builder.mutation({
      query: (confirmationData) => ({
        url: "/subscriptions/create",
        method: "POST",
        body: confirmationData,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetSubscriptionPlansQuery,
  useGetSubscriptionSinglePlansQuery,
  useSendSubscriptionOTPRequestMutation,
  useSendSubscriptionConfirmationMutation,
} = subscriptionSlice;
