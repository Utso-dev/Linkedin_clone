import baseApiSlice from "../../baseApi";

const universitySlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUniversity: builder.query({
      query: (params) => ({
        url: `/admin/academia/universities`,
        method: "GET",
        params,
      }),
      providesTags: ["university"],
    }),

    //all sate list

    getAllState: builder.query({
      query: () => ({
        url: `/admin/academia/state`,
        method: "GET",
      }),
      providesTags: ["state"],
    }),

    //change-password
    createUniversity: builder.mutation({
      query: (payload) => ({
        url: "/admin/academia/university/create",
        method: "POST",
        body: payload,
      }),
    }),

    editUniversity: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `admin/academia/university/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["university"],
    }),

    //logout user
    deleteUniversity: builder.mutation({
      query: (id) => ({
        url: `/admin/academia/university/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["university"],
    }),

    //
  }),
});

export const {
  useGetUniversityQuery,
  useGetAllStateQuery,
  useCreateUniversityMutation,
  useDeleteUniversityMutation,

  useEditUniversityMutation,
} = universitySlice;
