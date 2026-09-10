import { get } from "http";
import baseApiSlice from "./baseApi";

const subscriptionSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriptionPlans: builder.query({
            query: () => ({
                url: "/plans",
                method: "GET",
            }),
        }),
        sendSubscriptionOTPRequest: builder.mutation({
            query: (otpData) => ({
                url: "/subscription-otp",
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
        }),
    })
})

export const { useGetSubscriptionPlansQuery, useSendSubscriptionOTPRequestMutation, useSendSubscriptionConfirmationMutation } = subscriptionSlice;