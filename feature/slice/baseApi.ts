import { getToken } from "@/lib/token";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://vini.pixelstack.cloud/api",
  credentials: "include",
  prepareHeaders: async (headers) => {
    const token = await getToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    headers.set("Accept", "application/json");
    return headers;
  },
});

export const baseApiSlice = createApi({
  reducerPath: "api",
  baseQuery: rawBaseQuery,
  endpoints: () => ({}),
  tagTypes: [
    "User",
    "Post",
    "Notifications",
    "conversationList",
    "getConversationList",
    "message",
    "loginActivities",
    "activeSessions",
    "overview",
    "connect",
    "psychology",
    "follow",
    "group",
    "neuroscience",
    "Comment",
    "Like",
    "experience",
    "study",
    "subscription",
    "plan",
  ],
});

export default baseApiSlice;
