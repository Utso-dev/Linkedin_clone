// import { NextRequest, NextResponse } from "next/server";

// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "https://vin.apphero.agency/api";

// const PUBLIC_PATHS = [
//   "/",
//   "/login",
//   "/sign-up",
//   "/forgot-password",
//   "/privecy-policy",
//   "/tearm-condition",
// ];

// export async function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Skip middleware for static files, images, API and public assets
//   if (
//     pathname === "/favicon.ico" ||
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/api/") ||
//     pathname.startsWith("/public")
//   ) {
//     return NextResponse.next();
//   }

//   const requestHeaders = new Headers(request.headers);
//   requestHeaders.set("x-pathname", pathname);

//   const tokenQuery = request.nextUrl.searchParams.get("auth");
//   const cookieToken = request.cookies.get("accessToken")?.value;

//   const redirectToLogin = () => {
//     const res = NextResponse.redirect(new URL("/login", request.url));
//     res.cookies.delete("accessToken");
//     res.cookies.delete("accessTokenIssuedAt");
//     return res;
//   };

//   const redirectToHome = () => {
//     const res = NextResponse.redirect(new URL("/mu/home", request.url));
//     if (currentToken)
//       res.cookies.set("accessToken", currentToken, { path: "/", maxAge: 7 * 24 * 60 * 60 });
//     return res;
//   };

//   let response = NextResponse.next({
//     request: {
//       headers: requestHeaders,
//     },
//   });

//   let currentToken = cookieToken || null;

//   if (tokenQuery) {
//     try {
//       const decoded = JSON.parse(atob(tokenQuery));
//       if (decoded?.token) {
//         currentToken = decoded.token;
//         response.cookies.set("accessToken", currentToken, {
//           path: "/",
//           maxAge: 7 * 24 * 60 * 60,
//           sameSite: "lax",
//           secure: process.env.NODE_ENV === "production",
//         });
//       }
//     } catch {
//       return redirectToLogin();
//     }
//   }

//   if (!currentToken) {
//     const isPublic = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path));
//     if (isPublic || pathname.startsWith("/onboarding")) {
//       return response;
//     }
//     return redirectToLogin();
//   }

//   if (PUBLIC_PATHS.some((path) => pathname === path)) {
//     return redirectToHome();
//   }

//   try {
//     const userResponse = await fetch(`${API_BASE_URL}/me`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${currentToken}`,
//         Accept: "application/json",
//       },
//       credentials: "include",
//     });

//     if (userResponse.ok) {
//       const userData = await userResponse.json();
//       if (userData?.success) {
//         if (!userData?.is_onboarding) {
//           if (!pathname.startsWith("/onboarding")) {
//             const res = NextResponse.redirect(new URL("/onboarding", request.url));
//             if (currentToken)
//               res.cookies.set("accessToken", currentToken, { path: "/", maxAge: 7 * 24 * 60 * 60 });
//             return res;
//           }
//         } else {
//           if (pathname.startsWith("/onboarding")) {
//             return redirectToHome();
//           }
//         }
//       }
//     }

//   } catch (error) {
//     console.error("Middleware token check bypassed on error:", error);
//   }

//   return response;
// }

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
// };

import { NextRequest, NextResponse } from "next/server";
import { COOKIE_MAX_AGE } from "./lib/token";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://vini.pixelstack.cloud/api";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/sign-up",
  "/forgot-password",
  "/privecy-policy",
  "/tearm-condition",
  "/two-factor",
  "/backup-codes",
  "/recovery-email",
  "/email-verify-code",
  "/account-recovery",
];

function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set("accessToken", token, {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
    secure: true,
  });
  return response;
}

function clearAuthCookie(response: NextResponse) {
  response.cookies.delete("accessToken");
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static / internal / api routes — skip middleware entirely
  if (
    pathname === "/favicon.ico" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  const cookieToken = request.cookies.get("accessToken")?.value;
  const tokenQuery = request.nextUrl.searchParams.get("auth");
  let currentToken = cookieToken || null;
  let tokenFromQuery: string | null = null;

  // Token came from social-login redirect (?auth=base64(...))
  if (tokenQuery) {
    try {
      const decoded = JSON.parse(atob(tokenQuery));
      if (decoded?.token) {
        currentToken = decoded.token;
        tokenFromQuery = decoded.token;
      }
    } catch (e) {
      console.error("Token decoding failed");
    }
  }

  // Helper: attach the query-token cookie (if present) to ANY outgoing response,
  // including redirects. This is what was missing before — redirects returned
  // early without ever calling finalResponse.cookies.set(), so first-time
  // social-login users lost their token on the way to /onboarding.
  const withQueryTokenCookie = (response: NextResponse) => {
    if (tokenFromQuery) {
      setAuthCookie(response, tokenFromQuery);
    }
    return response;
  };

  // Prefix-match public paths so nested screens under a public flow
  // (e.g. "/forgot-password/otp", "/two-factor/verify") are also treated
  // as public. "/" is kept as an EXACT match only — startsWith("/") would
  // match literally every path and make everything public.
  const isPublicPath = PUBLIC_PATHS.some((path) =>
    path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`)
  );

  // ── No token at all ─────────────────────────────────────────────
  if (!currentToken) {
    if (isPublicPath || pathname.startsWith("/onboarding")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Logged-in user hitting login/signup/home ("/") → send to home
  if (isPublicPath && pathname !== "/onboarding") {
    if (pathname === "/login" || pathname === "/" || pathname === "/sign-up") {
      return withQueryTokenCookie(
        NextResponse.redirect(new URL("/mu/home", request.url))
      );
    }
  }

  // ── Validate token against /me ──────────────────────────────────
  try {
    const userResponse = await fetch(`${API_BASE_URL}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${currentToken}`,
        Accept: "application/json",
      },
    });

    // Token expired → try refresh
    if (userResponse.status === 401) {
      console.log("Access token expired, attempting refresh...");

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/refresh`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${currentToken}`,
            Accept: "application/json",
          },
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const newToken = refreshData?.data?.token || refreshData?.token;

          if (newToken) {
            // Re-check onboarding status with the NEW token before deciding
            // where this request should land.
            const meWithNewToken = await fetch(`${API_BASE_URL}/me`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${newToken}`,
                Accept: "application/json",
              },
            });

            let response = NextResponse.next();

            if (meWithNewToken.ok) {
              const userData = await meWithNewToken.json();
              const isOnboarded =
                userData?.data?.is_onboarding ?? userData?.is_onboarding;

              if (!isOnboarded && !pathname.startsWith("/onboarding")) {
                response = NextResponse.redirect(
                  new URL("/onboarding", request.url)
                );
              } else if (isOnboarded && pathname.startsWith("/onboarding")) {
                response = NextResponse.redirect(
                  new URL("/mu/home", request.url)
                );
              }
            }

            return setAuthCookie(response, newToken);
          }
        }

        // Refresh failed → force re-login, clear stale cookie
        if (refreshResponse.status === 401 || refreshResponse.status === 403) {
          const res = NextResponse.redirect(new URL("/login", request.url));
          return clearAuthCookie(res);
        }
      } catch (refreshErr) {
        console.error("Network error during refresh, session preserved.");
        return NextResponse.next();
      }
    }

    // Token valid → check onboarding status
    if (userResponse.ok) {
      const userData = await userResponse.json();
      const isOnboarded =
        userData?.data?.is_onboarding ?? userData?.is_onboarding;

    if (userData && userData.success) {
      const isAdmin = userData?.user?.role === "admin";
      const isOnboardingComplete = userData?.is_onboarding;
    
      // Incomplete onboarding → force to /onboarding (skip for admins)
      if (!isOnboardingComplete && !isAdmin) {
        if (!pathname.startsWith("/onboarding")) {
          const res = NextResponse.redirect(new URL("/onboarding", request.url));
          if (currentToken) {
            res.cookies.set("accessToken", currentToken, { path: "/" });
          }
          return res;
        }
      } else {
        // Onboarding complete OR admin → block /onboarding pages
        if (pathname.startsWith("/onboarding")) {
          return withQueryTokenCookie(
            NextResponse.redirect(new URL("/mu/home", request.url))
          );
        }
      }
    }
  } catch (error) {
    console.error("Middleware Auth Fetch Error:", error);
    return NextResponse.next();
  }

  // ── Default: continue, persisting query-token cookie if present ──
  return withQueryTokenCookie(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
