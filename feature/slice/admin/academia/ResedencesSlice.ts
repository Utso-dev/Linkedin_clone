import baseApiSlice from "../../baseApi";

const universitySlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllResidencies: builder.query({
      query: (params) => ({
        url: `/admin/academia/residencies`,
        method: "GET",
        params,
      }),
      providesTags: ["residencies"],
    }),

    //create
    createResedency: builder.mutation({
      query: (payload) => ({
        url: "/admin/academia/residency/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["residencies"],
    }),

    //edit
    editResedency: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/academia/residency/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["residencies"],
    }),

    //logout user
    deleteResedency: builder.mutation({
      query: (id) => ({
        url: `/admin/academia/residency/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["residencies"],
    }),

    //
  }),
});

export const {
  useGetAllResidenciesQuery,
  useCreateResedencyMutation,
  useEditResedencyMutation,
  useDeleteResedencyMutation,
} = universitySlice;
