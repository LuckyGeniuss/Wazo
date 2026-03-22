import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.originalRole || req.auth?.user?.role;

  const isApiAuthRoute = pathname.startsWith("/api/auth");
  const isSuperAdminRoute = pathname.startsWith("/superadmin");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAccountRoute = pathname.startsWith("/account");
  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  const isBannedPage = pathname === "/banned";
  const isMaintenancePage = pathname === "/maintenance";

  const isAdmin = userRole === "ADMIN" || userRole === "SUPERADMIN";
  const isSeller = userRole === "SELLER" || userRole === "ADMIN" || userRole === "SUPERADMIN";

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

  // SuperAdmin route - тільки для SUPERADMIN або ADMIN
  if (isSuperAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (userRole !== "ADMIN" && userRole !== "SUPERADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  // Dashboard route - для SELLER, ADMIN, SUPERADMIN
  if (isDashboardRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (!isSeller) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  // Account route - для всіх авторизованих
  if (isAccountRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
  }

  // Redirect from login/register if already logged in
  if (isLoggedIn && (isLoginPage || isRegisterPage)) {
    if (userRole === "SUPERADMIN") {
      return NextResponse.redirect(new URL("/superadmin", nextUrl));
    }
    if (isSeller) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    // Для звичайних USER - на головну
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
