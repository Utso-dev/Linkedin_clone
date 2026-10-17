import baseApiSlice from "./baseApi";

const psychologySlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBiotechnology: builder.query({
      query: ({ query }) => ({
        url: `/psychology-network/industry/biotech`,
        method: "GET",
      }),
      providesTags: ["psychology"],
    }),
    getBiotechnologyPartners: builder.query({
      query: ({ query }) => ({
        url: `psychology-network/industry/biotech-partners`,
        method: "GET",
      }),
      providesTags: ["psychology"],
    }),
    getPsychologyOne: builder.query({
      query: ({ query }) => ({
        url: `/psychology-network/industry/pharma`,
        method: "GET",
      }),

      providesTags: ["psychology"],
    }),
    getPsychologyOnePartners: builder.query({
      query: ({ query }) => ({
        url: `/psychology-network/industry/pharma-partners`,
        method: "GET",
      }),

      providesTags: ["psychology"],
    }),
    getPublicationsOne: builder.query({
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
          network_type: "psychology",
          ...(params.cursor ? { cursor: params.cursor } : {}),
          ...(params.per_page ? { per_page: params.per_page } : {}),
        },
      }),

      providesTags: ["psychology"],
    }),
    getPublicationsOnePartners: builder.query({
      query: ({ query }) => ({
        url: `/psychology-network/industry/pub-partners`,
        method: "GET",
      }),

      providesTags: ["psychology"],
    }),
  }),
});

export const {
  useGetBiotechnologyQuery,
  useGetBiotechnologyPartnersQuery,
  useGetPublicationsOneQuery,
  useGetPublicationsOnePartnersQuery,
  useGetPsychologyOneQuery,
  useGetPsychologyOnePartnersQuery,
} = psychologySlice;
