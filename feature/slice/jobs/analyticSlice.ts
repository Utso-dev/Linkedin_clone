import baseApiSlice from "../baseApi"


const analyticSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder)=> ({
        getJobOverview: builder.query({
            query: (params) => ({
                url: "/industry/analytics/job-overviews",
                method: "GET",
                params,
            }),
            providesTags: ["Analytic"],
        }),
        getAdvertisements: builder.query({
            query: (params) => ({
                url: "/industry/analytics/advertisements",
                method: "GET",
                params,
            }),
            providesTags: ["Analytic"],
        }),
        getProfileInsight: builder.query({
            query: (params) => ({
                url: "/industry/analytics/profile-insights",
                method: "GET",
                params,
            }),
            providesTags: ["Analytic"],
        }),
        getPublicationsInsight: builder.query({
            query: (params) => ({
                url: "/industry/analytics/publications-insights",
                method: "GET",
                params,
            }),
            providesTags: ["Analytic"],
        }),
    }),
});

export const {
    useGetAdvertisementsQuery,
    useGetJobOverviewQuery,
    useGetProfileInsightQuery,
    useGetPublicationsInsightQuery,
} = analyticSlice;

