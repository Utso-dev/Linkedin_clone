import baseApiSlice from "../baseApi";

const userJobSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserAllJobs: builder.query<any, any | void>({
      query: (params) => ({
        url: `/industry/jobsfeed`,
        method: "GET",
        params,
      }),

      providesTags: ["UserJob"],
    }),
    getUserJobsApplications: builder.query<any, any | void>({
      query: (params) => ({
        url: `/user/my-job-posts/archive`,
        method: "GET",
        params,
      }),
      providesTags: ["UserJob"],
    }),
    getUserSingleJob: builder.query<any, any | void>({
      query: (id) => ({
        url: `/industry/job-post/${id}`,
        method: "GET",
      }),
      providesTags: ["UserJob"],
    }),
    getAllSavedJobs: builder.query<any, any | void>({
      query: (params) => ({
        url: `/industry/saved-jobs`,
        method: "GET",
        params,
      }),
      providesTags: ["UserJob"],
    }),
    getMyJobApplications: builder.query<any, any | void>({
      query: (params) => ({
        url: `/industry/my-job-applications`,
        method: "GET",
        params,
      }),
      providesTags: ["UserJob"],
    }),
    applyUserJob: builder.mutation<any, any | void>({
      query: ({ data, id }) => ({
        url: `/industry/job-post/${id}/apply`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserJob"],
    }),
    likeByUserJobPost: builder.mutation<any, any | void>({
      query: (id) => ({
        url: `/industry/job-post/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: ["UserJob"],
    }),
    saveUserJob: builder.mutation<any, any | void>({
      query: (id) => ({
        url: `/industry/job-post/${id}/save`,
        method: "POST",
      }),
      invalidatesTags: ["UserJob"],
    }),
  }),
});

export const {
  useGetUserAllJobsQuery,
  useGetUserJobsApplicationsQuery,
  useGetUserSingleJobQuery,
  useGetAllSavedJobsQuery,
  useGetMyJobApplicationsQuery,
  useApplyUserJobMutation,
  useLikeByUserJobPostMutation,
  useSaveUserJobMutation,
} = userJobSlice;
