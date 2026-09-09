import baseApiSlice from "../../baseApi";
import { CancelSubscriptionResponse, GetSubscriptionsParams, GetSubscriptionsResponse } from "./subscriptionType";

const subscriptionSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
      getMySubscribers: builder.query<GetSubscriptionsResponse, GetSubscriptionsParams>({
        query: ({ query }) => ({
          url: "/admin/subscriptions",
          method: "GET",
          params: query,
        }),
        providesTags: ["subscription"],
      }),

      cancelSubscription: builder.mutation<CancelSubscriptionResponse, { id: number | string }>({
        query: ({ id }) => ({
          url: `/admin/subscriptions/${id}/cancel`,
          method: "POST",
        }),
        invalidatesTags: ["subscription"],
      }),
    }),
  });
  
  export const { useGetMySubscribersQuery, useCancelSubscriptionMutation } = subscriptionSlice;