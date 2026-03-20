import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isSuperAdminRoute = nextUrl.pathname.startsWith("/superadmin");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isBannedPage = nextUrl.pathname === "/banned";
  const isMaintenancePage = nextUrl.pathname === "/maintenance";

  const role = req.auth?.user?.originalRole || req.auth?.user?.role;
  const isAdmin = role === "ADMIN" || role === "SUPERADMIN";

  // Maintenance mode check via cookie
  const isMaintenanceActive = req.cookies.get("platform_maintenance")?.value === "1";
  
  if (isMaintenanceActive && !isAdmin && !isMaintenancePage && !isApiAuthRoute) {
    return NextResponse.redirect(new URL("/maintenance", nextUrl));
  }

  // Redirect banned users
  if (!isApiAuthRoute && !isBannedPage && !isMaintenancePage && req.auth?.user?.isBanned) {
    return NextResponse.redirect(new URL("/banned", nextUrl));
  }

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isSuperAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }

    const role = req.auth?.user?.originalRole || req.auth?.user?.role;
    if (role !== "ADMIN" && role !== "SUPERADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  if (isDashboardRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
