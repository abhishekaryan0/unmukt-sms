import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. Enterprise Security Headers (Allow SAMEORIGIN in dev so Next.js error overlay iframe functions)
  if (process.env.NODE_ENV === "production") {
    response.headers.set("X-Frame-Options", "DENY");
  } else {
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
  }

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  );

  // 2. Client vs Admin Route Segregation
  const adminSessionCookie = request.cookies.get("smsunmukt_admin_session");
  const clientSessionCookie = request.cookies.get("smsunmukt_client_session");

  // Protect Admin Pages
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (adminSessionCookie && adminSessionCookie.value === "unauthorized") {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect Client Pages
  const clientProtectedPaths = [
    "/dashboard",
    "/send-sms",
    "/whatsapp",
    "/contacts",
    "/groups",
    "/campaigns",
    "/templates",
    "/wallet",
    "/transactions",
    "/invoices",
    "/reports",
    "/support",
    "/settings",
  ];

  const isClientProtected = clientProtectedPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (isClientProtected && clientSessionCookie && clientSessionCookie.value === "unauthorized") {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next (Next.js internals, HMR, error overlays, static chunks, etc.)
     * - api (API routes)
     * - static image and icon files
     */
    "/((?!_next|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
