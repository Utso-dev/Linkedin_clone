import baseApiSlice from "./baseApi";

const psychologySlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProductFeed: builder.query({
      query: (
        params: {
          network_type?: string;
          industry_type?: string;
          view?: string;
          flat?: boolean | number;
          section_id?: number | null;
          category_id?: number | null;
          search?: string | null;
          per_page?: number;
          cursor?: string | null;
        } = {},
      ) => ({
        url: `/industry/product-feed`,
        method: "GET",
        params: {
          network_type: params.network_type || "psychology",
          industry_type: params.industry_type || "biotechnology",
          ...(params.view ? { view: params.view } : {}),
          ...(params.flat !== undefined ? { flat: params.flat } : {}),
          ...(params.section_id ? { section_id: params.section_id } : {}),
          ...(params.category_id ? { category_id: params.category_id } : {}),
          ...(params.search && params.search.trim()
            ? { search: params.search.trim() }
            : {}),
          ...(params.per_page
            ? { per_page: params.per_page }
            : { per_page: 12 }),
          ...(params.cursor ? { cursor: params.cursor } : {}),
        },
      }),
      providesTags: ["psychology"],
    }),
    getBiotechnology: builder.query({
      query: (arg?: any) => {
        const params = typeof arg === "object" && arg !== null ? arg : {};
        const network_type = params.network_type || "psychology";
        const industry_type =
          params.industry_type ||
          (typeof arg === "string" ? arg : "biotechnology");

        return {
          url: `/industry/product-feed`,
          method: "GET",
          params: {
            network_type,
            industry_type,
            view: "overview",
            ...(params.search && params.search.trim()
              ? { search: params.search.trim() }
              : {}),
            ...(params.cursor ? { cursor: params.cursor } : {}),
            ...(params.per_page ? { per_page: params.per_page } : {}),
          },
        };
      },
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
  useGetProductFeedQuery,
  useGetBiotechnologyQuery,
  useGetBiotechnologyPartnersQuery,
  useGetPublicationsOneQuery,
  useGetPublicationsOnePartnersQuery,
  useGetPsychologyOneQuery,
  useGetPsychologyOnePartnersQuery,
} = psychologySlice;
