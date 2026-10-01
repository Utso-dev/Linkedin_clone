import baseApiSlice from "../baseApi";

const securitySettingsSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSecurityOverview: builder.query({
      query: () => ({
        url: `/security/overview`,
        method: "GET",
      }),
      providesTags: ["overview"],
    }),

    //change-password
    postChangePassword: builder.mutation({
      query: (payload) => ({
        url: "/profile/change-password",
        method: "POST",
        body: payload,
      }),
    }),

    //activity-session
    getActiveSessions: builder.query({
      query: () => ({
        url: `/security/active-sessions`,
        method: "GET",
      }),
      providesTags: ["activeSessions"],
    }),

    //delte activite session
    DeleteActiveSessions: builder.mutation({
      query: (id) => ({
        url: `/security/sessions/revoke/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["activeSessions"],
    }),

    //Delet all session
    DeletAllSessions: builder.mutation({
      query: () => ({
        url: "/security/sessions/sign-out-all",
        method: "POST",
      }),
      invalidatesTags: ["activeSessions"],
    }),

    //login-activity
    getLoginActivity: builder.query({
      query: (params) => ({
        url: "/security/login-activities",
        method: "GET",
        params,
      }),
      providesTags: ["loginActivities"],
    }),

    //delet alll activity

    DeleteAllLoginActivity: builder.mutation({
      query: () => ({
        url: `/security/login-activities/clear-all`,
        method: "DELETE",
      }),
      invalidatesTags: ["loginActivities"],
    }),

    //delte activite
    DeleteLoginActivity: builder.mutation({
      query: (id) => ({
        url: `/security/sessions/revoke/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["loginActivities"],
    }),

    //logout user
    LogoutActiveSessions: builder.mutation({
      query: (id) => ({
        url: `/security/login-activities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["loginActivities"],
    }),

    //emabele pass
    EnablePassword: builder.mutation({
      query: (payload) => ({
        url: "/2fa/setup",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["overview"],
    }),

    //code send
    ProviderEmailCode: builder.mutation({
      query: (payload) => ({
        url: "/2fa/confirm",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["overview"],
    }),
    // code verify ===
    twoFactorEmailCodeVerify: builder.mutation({
      query: (payload) => ({
        url: "/2fa/verify-login",
        method: "POST",
        body: payload,
      }),
    }),
    // code verify ===
    twoFactorRecoveryEmail: builder.mutation({
      query: (payload) => ({
        url: "/2fa/recovery-init",
        method: "POST",
        body: payload,
      }),
    }),
    twoFactorRecoveryCodeSentEmail: builder.mutation({
      query: (payload) => ({
        url: "/2fa/recovery-send-otp",
        method: "POST",
        body: payload,
      }),
    }),
    twoFactorRecoveryCodeVerifyEmail: builder.mutation({
      query: (payload) => ({
        url: "/2fa/recovery-verify",
        method: "POST",
        body: payload,
      }),
    }),
    generateTwoFactorRecoveryCodeEmail: builder.mutation({
      query: (payload) => ({
        url: "/2fa/recovery/resend-otp",
        method: "POST",
        body: payload,
      }),
    }),

    //desable pass
    DesablePasswd: builder.mutation({
      query: (payload) => ({
        url: "/2fa/disable",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["overview"],
    }),

    //newGenerate Code
    GenerateCode: builder.mutation({
      query: (payload) => ({
        url: "/2fa/regenerate-codes",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["overview"],
    }),

    //email recovery add
    RecoveryEmailUpdate: builder.mutation({
      query: (payload) => ({
        url: "/2fa/recovery-email/update",
        method: "POST",
        body: payload,
      }),
    }),

    //email recovery otp verify
    RecoveryEmailOtpVerify: builder.mutation({
      query: (payload) => ({
        url: "/2fa/recovery-email/confirm",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["overview"],
    }),

    //singele trusted session
    SingeleSessionTrusted: builder.mutation({
      query: (id) => ({
        url: `/security/resolve/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["loginActivities"],
    }),

    //
  }),
});

export const {
  useGetSecurityOverviewQuery,
  usePostChangePasswordMutation,
  useGetActiveSessionsQuery,
  useDeleteActiveSessionsMutation,
  useDeletAllSessionsMutation,
  useDeleteLoginActivityMutation,
  useGetLoginActivityQuery,
  useLogoutActiveSessionsMutation,
  useEnablePasswordMutation,
  useDeleteAllLoginActivityMutation,
  useProviderEmailCodeMutation,
  useTwoFactorEmailCodeVerifyMutation,
  useTwoFactorRecoveryEmailMutation,
  useTwoFactorRecoveryCodeSentEmailMutation,
  useTwoFactorRecoveryCodeVerifyEmailMutation,
  useGenerateTwoFactorRecoveryCodeEmailMutation,
  useDesablePasswdMutation,
  useGenerateCodeMutation,

  useRecoveryEmailOtpVerifyMutation,
  useRecoveryEmailUpdateMutation,
  useSingeleSessionTrustedMutation,
} = securitySettingsSlice;
