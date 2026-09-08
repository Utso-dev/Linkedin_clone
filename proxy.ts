import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://vin.apphero.agency/api";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, images, API and public assets
  if (
    pathname === "/favicon.ico" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/public")
  ) {
    return NextResponse.next();
  }

  const tokenQuery = request.nextUrl.searchParams.get("auth");
  const cookieToken = request.cookies.get("accessToken")?.value;

  // Login redirects clear auth cookies; home redirects keep the current token.
  const redirectToLogin = () => {
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("accessToken");
    res.cookies.delete("accessTokenIssuedAt");
    return res;
  };

  const redirectToHome = () => {
    const res = NextResponse.redirect(new URL("/mu/home", request.url));
    if (currentToken)
      res.cookies.set("accessToken", currentToken, { path: "/" });
    return res;
  };

  // If token came as query param, decode and set cookie on the response
  let response = NextResponse.next();
  let currentToken = cookieToken || null;

  if (tokenQuery) {
    try {
      // Expecting the `auth` param to be base64(JSON) like: btoa(JSON.stringify({ token }))
      const decoded = JSON.parse(atob(tokenQuery));

      if (decoded && decoded.token) {
        currentToken = decoded.token;
        response.cookies.set("accessToken", currentToken, { path: "/" });
      }
    } catch (e) {
      return redirectToLogin();
    }
  }

  // If no token, allow access to auth and onboarding pages, otherwise redirect to login
  if (!currentToken) {
    if (
      pathname === "/" ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/sign-up") ||
      pathname.startsWith("/forgot-password") ||
      pathname.startsWith("/privecy-policy") ||
      pathname.startsWith("/tearm-condition") ||
      pathname.startsWith("/onboarding")
    ) {
      return response;
    }

    return redirectToLogin();
  }

  // If token exists, block access to auth pages immediately (no need to wait for API)
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/forgot-password")
  ) {
    return redirectToHome();
  }

  // Validate token and get user info
  try {
    const userResponse = await fetch(`${API_BASE_URL}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${currentToken}`,
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (userResponse.status === 401) {
      return redirectToLogin();
    }

    const userData = await userResponse.json();

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
          return redirectToHome();
        }
      }
    }
  } catch (error) {
    // On failure to validate, allow the request to continue (or you may prefer to redirect)
    console.error("Middleware: failed to validate token:", error);
  }

  return response;
}

export const config = {
  matcher: [
    // apply middleware to all routes except next/static, images and public assets
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
