import baseApiSlice from "../baseApi";

const jobSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query<any, any | void>({
      query: (params) => ({
        url: `/industry/my-job-posts`,
        method: "GET",
        params,
      }),
      providesTags: ["Job"],
    }),
    getJobsArchive: builder.query<any, any | void>({
      query: (params) => ({
        url: `/industry/my-archived-job-posts`,
        method: "GET",
        params,
      }),
      providesTags: ["Job"],
    }),
    getStateByCity: builder.query({
      query: (code) => ({
        url: `/states/${code}/cities`,
        method: "GET",
      }),
      providesTags: ["Job"],
    }),
    getJobDetails: builder.query({
      query: (id) => ({
        url: `/industry/job-post/${id}`,
        method: "GET",
      }),
      providesTags: ["Job"],
    }),
    getJobApplicants: builder.query({
      query: ({ applicantId, status }) => ({
        url: `/industry/job-applications/${applicantId}`,
        method: "GET",
        params: status ? { status } : {},
      }),
      providesTags: ["Job"],
    }),
    getAllJobApplicants: builder.query<any, any>({
      query: (arg) => {
        const id = typeof arg === "object" ? arg.id : arg;
        const params = typeof arg === "object" ? arg.params : undefined;
        return {
          url: `/industry/job-post/${id}/applicants`,
          method: "GET",
          params,
        };
      },
      providesTags: ["Job"],
    }),
    CreateJobs: builder.mutation({
      query: (data) => ({
        url: `/industry/job-post/create`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Job"],
    }),
    statusUpdateForJobs: builder.mutation({
      query: ({ data, id }) => ({
        url: `/industry/job-post/${id}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Job"],
    }),
    statusUpdateForApplicants: builder.mutation({
      query: ({ data, application_id }) => ({
        url: `/industry/job-application/${application_id}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Job"],
    }),
    UpdateJobs: builder.mutation({
      query: ({ data, id }) => ({
        url: `/industry/job-post/${id}/update`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Job"],
    }),
    DeleteJobs: builder.mutation({
      query: (id) => ({
        url: `/industry/job-post/${id}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["Job"],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetJobsArchiveQuery,
  useGetJobDetailsQuery,
  useCreateJobsMutation,
  useGetAllJobApplicantsQuery,
  useGetJobApplicantsQuery,
  useStatusUpdateForApplicantsMutation,
  useStatusUpdateForJobsMutation,
  useGetStateByCityQuery,
  useUpdateJobsMutation,
  useDeleteJobsMutation,
} = jobSlice;
