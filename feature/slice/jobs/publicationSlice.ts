import baseApiSlice from "../baseApi";

const publicationSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyPublications: builder.query<
      any,
      { page?: number; per_page?: number; [key: string]: any } | void
    >({
      query: (params) => ({
        url: "/publications/my-listings",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["publications"],
    }),
    getAllPublications: builder.query<
      any,
      { page?: number; per_page?: number; [key: string]: any } | void
    >({
      query: (params) => ({
        url: "/publications/feed",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["publications"],
    }),
    getSinglePublication: builder.query<any, string | number>({
      query: (id) => ({
        url: `/publications/${id}/details`,
        method: "GET",
      }),
      providesTags: ["publications"],
    }),
    likeSinglePublication: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `/publications/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: ["publications"],
    }),
    publicationCreate: builder.mutation<any, FormData>({
      query: (body) => ({
        url: `/publications/create`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["publications"],
    }),
    publicationUpdate: builder.mutation<
      any,
      { id: string | number; body: any }
    >({
      query: ({ id, body }) => ({
        url: `/publications/${id}/update`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["publications"],
    }),
    publicationStatusUpdate: builder.mutation<
      any,
      { id: string | number; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/publications/${id}/status`,
        method: "POST",
        body: { status },
      }),
      invalidatesTags: ["publications"],
    }),
    publicationDelete: builder.mutation<any, string | number>({
      query: (id) => ({
        url: `/publications/${id}/delete`,
        method: "DELETE",
      }),
      invalidatesTags: ["publications"],
    }),
  }),
});

export const {
  useGetMyPublicationsQuery,
  useGetAllPublicationsQuery,
  useGetSinglePublicationQuery,
  useLikeSinglePublicationMutation,
  usePublicationUpdateMutation,
  usePublicationStatusUpdateMutation,
  usePublicationCreateMutation,
  usePublicationDeleteMutation,
} = publicationSlice;
