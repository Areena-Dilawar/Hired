import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuth = !!token;
  const role = token?.role;

  // Admin routes — admin only
  if (pathname.startsWith("/admin")) {
    if (!isAuth || role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Employer only routes
  if (pathname.startsWith("/dashboard") || pathname === "/jobs/new") {
    if (!isAuth) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
    if (role !== "employer" && role !== "admin") {
      return NextResponse.redirect(new URL("/jobs", req.url));
    }
    return NextResponse.next();
  }

  // Any authenticated user
  if (pathname.startsWith("/saved") || pathname.startsWith("/profile")) {
    if (!isAuth) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/jobs/new",
    "/saved/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
};