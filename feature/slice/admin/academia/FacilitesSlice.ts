import baseApiSlice from "../../baseApi";

const FacilitesSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllFacilities: builder.query({
      query: (params) => ({
        url: `/admin/academia/facilities`,
        method: "GET",
        params,
      }),
      providesTags: ["facilities"],
    }),

    //create
    createFacilities: builder.mutation({
      query: (payload) => ({
        url: "/admin/academia/facility/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["facilities"],
    }),

    //edit
    editFacilities: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/academia/facility/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["facilities"],
    }),

    //logout user
    deleteFacilities: builder.mutation({
      query: (id) => ({
        url: `/admin/academia/facility/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["facilities"],
    }),

    //
  }),
});

export const {
  useGetAllFacilitiesQuery,
  useCreateFacilitiesMutation,
  useEditFacilitiesMutation,
  useDeleteFacilitiesMutation,
} = FacilitesSlice;
