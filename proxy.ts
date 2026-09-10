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
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

function clearAuthCookie(response: NextResponse) {
  response.cookies.delete("accessToken");
  return response;
}

function isOnboardedFromUser(userData: {
  success?: boolean;
  is_onboarding?: boolean;
  data?: { is_onboarding?: boolean; user?: { role?: string } };
  user?: { role?: string };
}) {
  return userData?.data?.is_onboarding ?? userData?.is_onboarding ?? false;
}

function isAdminFromUser(userData: {
  user?: { role?: string };
  data?: { user?: { role?: string } };
}) {
  return (
    userData?.user?.role === "admin" || userData?.data?.user?.role === "admin"
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const createNextResponse = () => {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-current-path", pathname);
    const segments = pathname.split("/").filter(Boolean);
    const lastParam = segments.length > 0 ? segments[segments.length - 1] : "";
    requestHeaders.set("x-current-params", lastParam);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  };
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

  if (tokenQuery) {
    try {
      const decoded = JSON.parse(atob(tokenQuery));
      if (decoded?.token) {
        currentToken = decoded.token;
        tokenFromQuery = decoded.token;
      }
    } catch {
      console.error("Token decoding failed");
    }
  }

  const withQueryTokenCookie = (response: NextResponse) => {
    if (tokenFromQuery) {
      setAuthCookie(response, tokenFromQuery);
    }
    return response;
  };

  const redirectForOnboarding = (isOnboarded: boolean, isAdmin: boolean) => {
    if (!isOnboarded && !isAdmin && !pathname.startsWith("/onboarding")) {
      return withQueryTokenCookie(
        NextResponse.redirect(new URL("/onboarding", request.url)),
      );
    }

    if ((isOnboarded || isAdmin) && pathname.startsWith("/onboarding")) {
      return withQueryTokenCookie(
        NextResponse.redirect(new URL("/mu/home", request.url)),
      );
    }

    return null;
  };

  const isPublicPath = PUBLIC_PATHS.some((path) =>
    path === "/"
      ? pathname === "/"
      : pathname === path || pathname.startsWith(`${path}/`),
  );

  if (!currentToken) {
    if (isPublicPath || pathname.startsWith("/onboarding")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    isPublicPath &&
    (pathname === "/login" || pathname === "/" || pathname === "/sign-up")
  ) {
    return withQueryTokenCookie(
      NextResponse.redirect(new URL("/mu/home", request.url)),
    );
  }

  try {
    const userResponse = await fetch(`${API_BASE_URL}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${currentToken}`,
        Accept: "application/json",
      },
    });

    if (userResponse.status === 401) {
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
              const redirect = redirectForOnboarding(
                isOnboardedFromUser(userData),
                isAdminFromUser(userData),
              );
              if (redirect) {
                return setAuthCookie(redirect, newToken);
              }
            }

            return setAuthCookie(response, newToken);
          }
        }

        if (refreshResponse.status === 401 || refreshResponse.status === 403) {
          return clearAuthCookie(
            NextResponse.redirect(new URL("/login", request.url)),
          );
        }
      } catch {
        console.error("Network error during refresh, session preserved.");
        return NextResponse.next();
      }
    }

    if (userResponse.ok) {
      const userData = await userResponse.json();
      const redirect = redirectForOnboarding(
        isOnboardedFromUser(userData),
        isAdminFromUser(userData),
      );
      if (redirect) return redirect;
    }
  } catch (error) {
    console.error("Middleware Auth Fetch Error:", error);
    return NextResponse.next();
  }

  return withQueryTokenCookie(createNextResponse());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
