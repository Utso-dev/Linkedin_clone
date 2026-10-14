import baseApiSlice from "../baseApi";

const advertisementSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdvertisementDashboard: builder.query({
      query: () => {
        return {
          url: "/industry/products/dashboard",
          method: "GET",
        };
      },
      providesTags: ["Advertisement"],
    }),
    getAdvertisementData: builder.query({
      query: (params) => {
        return {
          url: "/industry/products/my-listings",
          method: "GET",
          params,
        };
      },
      providesTags: ["Advertisement"],
    }),
    getAdvertisemetSection: builder.query({
      query: (params) => {
        return {
          url: "/industry/products/sections",
          method: "GET",
          params,
        };
      },
    }),
    getAdvertisemetCategories: builder.query({
      query: (id) => {
        return {
          url: `/industry/products/sections/${id}/categories`,
          method: "GET",
        };
      },
    }),
    getAdvertisemetEdite: builder.query({
      query: (id) => {
        return {
          url: `/industry/products/${id}`,
          method: "GET",
        };
      },
    }),
    createAdvertisement: builder.mutation({
      query: (data) => {
        return {
          url: `/industry/products/create`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Advertisement"],
    }),
    updateAdvertisementStatus: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `industry/products/${id}/status`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["Advertisement"],
    }),
    updateAdvertisement: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/industry/products/${id}/update`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Advertisement"],
    }),
    deleteAdvertisement: builder.mutation({
      query: (id) => ({
        url: `/industry/products/${id}/delete`,
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
  useDeleteAdvertisementMutation,
} = advertisementSlice;
