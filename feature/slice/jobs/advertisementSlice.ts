import baseApiSlice from "../baseApi";

const advertisementSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdvertisementDashboard: builder.query({
      query: () => {
        return {
          url: "/industry/advertisements/dashboard",
          method: "GET",
        };
      },
      providesTags: ["Advertisement"],
    }),
    getAdvertisementData: builder.query({
      query: (params) => {
        return {
          url: "/industry/advertisements/my-listings",
          method: "GET",
          params,
        };
      },
      providesTags: ["Advertisement"],
    }),
    getAdvertisemetSection: builder.query({
      query: (params) => {
        return {
          url: "/industry/advertisements/sections",
          method: "GET",
          params,
        };
      },
    }),
    getAdvertisemetCategories: builder.query({
      query: (id) => {
        return {
          url: `/industry/advertisements/sections/${id}/categories`,
          method: "GET",
        };
      },
    }),
    getAdvertisemetEdite: builder.query({
      query: (id) => {
        return {
          url: `/industry/advertisements/${id}`,
          method: "GET",
        };
      },
    }),
    createAdvertisement: builder.mutation({
      query: (data) => {
        return {
          url: `/industry/advertisements/create`,
          method: "POST",
          body: data,
        };
      },
        invalidatesTags: ["Advertisement"],
    }),
    updateAdvertisementStatus: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `industry/advertisements/${id}/status`,
          method: "PATCH",
          body: data,
        };
      },
        invalidatesTags: ["Advertisement"],
    }),
    updateAdvertisement: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/industry/advertisements/${id}/update`,
          method: "POST",
          body: data,
        };
      },
        invalidatesTags: ["Advertisement"],
    }),
    deleteAdvertisement: builder.mutation({
      query: ( id  ) => ({
       
          url: `/industry/advertisements/${id}/delete`,
          method: "DELETE",
      }),
      invalidatesTags: ["Advertisement"],
    }),
  }),
});

export const {
  useGetAdvertisementDashboardQuery,
  useGetAdvertisementDataQuery,
  useGetAdvertisemetSectionQuery,
  useUpdateAdvertisementStatusMutation,
  useGetAdvertisemetCategoriesQuery,
  useCreateAdvertisementMutation,
  useUpdateAdvertisementMutation,
  useGetAdvertisemetEditeQuery,
  useDeleteAdvertisementMutation
} = advertisementSlice;
