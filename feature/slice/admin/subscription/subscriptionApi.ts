import baseApiSlice from "../../baseApi";
import { CancelSubscriptionResponse, CreatePlanResponse, DeletePlanResponse, GetPlansResponse, GetSubscriptionsParams, GetSubscriptionsResponse, GetTransactionsParams, GetTransactionsResponse, GetTransactionStatusResponse, UpdatePlanArgs, PlanPayload, UpdatePlanResponse, GetPlanFeaturesResponse } from "./subscriptionType";

const subscriptionSlice = baseApiSlice.injectEndpoints({
  overrideExisting: true,
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


    // ============   Transaction  ============
    getTransactionStats: builder.query<GetTransactionStatusResponse, void>({
      query: () => ({
        url: `/admin/transactions/overview`,
        method: "GET",
      }),
    }),
    getTransactionList: builder.query<GetTransactionsResponse, GetTransactionsParams>({
      query: ({ query }: GetTransactionsParams) => ({
        url: `/admin/transactions`,
        method: "GET",
        params: query,
      }),
      providesTags: ["subscription"],
    }),


    // ============   Plan and Pricing  ============
    getPlans: builder.query<GetPlansResponse, void>({
      query: () => ({
        url: "/admin/plans",
        method: "GET",
      }),
      providesTags: ["plan"],
    }),
    createPlan: builder.mutation<CreatePlanResponse, PlanPayload>({
      query: (body) => ({
        url: "/admin/plans/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["plan"],
    }),
    updatePlan: builder.mutation<UpdatePlanResponse, UpdatePlanArgs>({
      query: ({ id, body }) => ({
        url: `/admin/plans/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["plan"],
    }),
    deactivePlan: builder.mutation<DeletePlanResponse, { id: number | string }>({
      query: ({ id }) => ({
        url: `/admin/plans/${id}/status`,
        method: "PATCH",
      }),
      invalidatesTags: ["plan"],
    }),

    // get all features
    getPlanFeatures: builder.query<GetPlanFeaturesResponse, void>({
      query: () => ({
        url: "/admin/plan-features",
        method: "GET",
      }),
      providesTags: ["plan"],
    }),
  }),
});

export const {
  useGetMySubscribersQuery,
  useCancelSubscriptionMutation,
  useGetTransactionStatsQuery,
  useGetTransactionListQuery,
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeactivePlanMutation,
  useGetPlanFeaturesQuery,
} = subscriptionSlice;