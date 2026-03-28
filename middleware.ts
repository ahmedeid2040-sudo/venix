import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedPath = [
    "/overview",
    "/courses",
    "/sales-team",
    "/registrations",
    "/collections",
    "/collection-fees",
    "/refunds",
    "/registration-transfers",
    "/cash-transfers",
    "/expenses",
    "/accounts",
    "/parties",
    "/reports",
    "/settings"
  ].some((route) => pathname === route || pathname.startsWith(`${route}/`));

  const hasSession = Boolean(request.cookies.get("venix_session")?.value);

  if (protectedPath && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && hasSession) {
    return NextResponse.redirect(new URL("/overview", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|.*\\..*).*)"]
};
