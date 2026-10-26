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
  }),
});

export const { useGetBoostingPlanQuery, useGetBoostingPostsQuery } =
  boostingSlice;
