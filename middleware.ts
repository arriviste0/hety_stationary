import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isRouteAllowed } from "@/lib/rbac";
import { verifyAdminToken } from "@/lib/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_token")?.value;
  const payload = await verifyAdminToken(token);

  if (!payload) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!isRouteAllowed(payload.role, pathname)) {
    return NextResponse.redirect(new URL("/admin/denied", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
