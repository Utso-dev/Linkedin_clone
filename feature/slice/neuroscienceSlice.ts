import baseApiSlice from "./baseApi";

const neuroscienceSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNeuroscienceBiotechnology: builder.query({
      query: ({ query }) => ({
        url: `/neuroscience-network/industry/biotech`,
        method: "GET",
      }),
      providesTags: ["neuroscience"],
    }),
    getNeuroscienceBiotechnologyPartners: builder.query({
      query: ({ query }) => ({
        url: `neuroscience-network/industry/biotech-partners`,
        method: "GET",
      }),
      providesTags: ["neuroscience"],
    }),
    getNeuroscienceOne: builder.query({
      query: ({ query }) => ({
        url: `/neuroscience-network/industry/pharma`,
        method: "GET",
      }),

      providesTags: ["neuroscience"],
    }),
    getNeuroscienceOnePartners: builder.query({
      query: ({ query }) => ({
        url: `/neuroscience-network/industry/pharma-partners`,
        method: "GET",
      }),

      providesTags: ["neuroscience"],
    }),
    getNeurosciencePublicationsOne: builder.query({
      query: (
        params: {
          query?: string;
          cursor?: string | null;
          per_page?: number;
        } = {},
      ) => ({
        url: "/publications/feed",
        method: "GET",
        params: {
          network_type: "neuroscience",
          ...(params.cursor ? { cursor: params.cursor } : {}),
          ...(params.per_page ? { per_page: params.per_page } : {}),
        },
      }),

      providesTags: ["neuroscience"],
    }),
    getNeurosciencePublicationsOnePartners: builder.query({
      query: ({ query }) => ({
        url: `/neuroscience-network/industry/pub-partners`,
        method: "GET",
      }),

      providesTags: ["neuroscience"],
    }),
  }),
});

export const {
  useGetNeuroscienceBiotechnologyQuery,
  useGetNeuroscienceBiotechnologyPartnersQuery,
  useGetNeurosciencePublicationsOneQuery,
  useGetNeurosciencePublicationsOnePartnersQuery,
  useGetNeuroscienceOneQuery,
  useGetNeuroscienceOnePartnersQuery,
} = neuroscienceSlice;
