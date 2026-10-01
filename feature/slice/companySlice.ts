import baseApiSlice from "./baseApi";

const companySlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCompany: builder.mutation({
      query: (data) => ({
        url: "/industry/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Company"],
    }),
    updateCompany: builder.mutation({
      query: (data) => ({
        url: "/industry/update",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Company"],
    }),
    followCompany: builder.mutation({
      query: ({ data, companyId }) => ({
        url: `/industry/follow/${companyId}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Company"],
    }),
    getCompany: builder.query({
      query: (companyId) => ({
        url: `/industry/show/${companyId}`,
        method: "GET",
      }),
      providesTags: ["Company"],
    }),
  }),
});

export const { useCreateCompanyMutation, useGetCompanyQuery, useUpdateCompanyMutation, useFollowCompanyMutation } = companySlice;
