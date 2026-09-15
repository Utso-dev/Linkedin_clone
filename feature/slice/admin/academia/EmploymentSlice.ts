import baseApiSlice from "../../baseApi";

const EmploymentSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmployment: builder.query({
      query: (params) => ({
        url: `/admin/academia/jobs`,
        method: "GET",
        params,
      }),
      providesTags: ["Employment"],
    }),

    //create
    createEmployment: builder.mutation({
      query: (payload) => ({
        url: "/admin/academia/job/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Employment"],
    }),

    //edit
    editEmployment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/academia/job/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Employment"],
    }),

    //logout user
    deleteEmployment: builder.mutation({
      query: (id) => ({
        url: `/admin/academia/job/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Employment"],
    }),

    //
  }),
});

export const {
  useGetEmploymentQuery,
  useCreateEmploymentMutation,
  useEditEmploymentMutation,
  useDeleteEmploymentMutation,
} = EmploymentSlice;
