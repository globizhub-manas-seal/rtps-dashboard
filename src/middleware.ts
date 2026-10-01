import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const role = request.cookies.get("demo_rbac_role")?.value || "ASCRTPS_ADMIN";
  const path = request.nextUrl.pathname;

  // Define access rules matching MainHeader
  const routePermissions: Record<string, string[]> = {
    "/": ["ASCRTPS_ADMIN", "DEPARTMENT_ADMIN", "OFFICE_HEAD", "REVIEWER", "DPS", "PUBLIC"],
    "/dashboard": ["ASCRTPS_ADMIN", "DEPARTMENT_ADMIN"],
    "/sla-monitor": ["ASCRTPS_ADMIN", "DEPARTMENT_ADMIN", "OFFICE_HEAD"],
    "/dps": ["ASCRTPS_ADMIN", "DEPARTMENT_ADMIN", "OFFICE_HEAD", "DPS"],
    "/offices": ["ASCRTPS_ADMIN", "DEPARTMENT_ADMIN", "OFFICE_HEAD"],
    "/departments": ["ASCRTPS_ADMIN", "DEPARTMENT_ADMIN"],
    "/reviews": ["ASCRTPS_ADMIN", "REVIEWER"],
    "/recognition": ["ASCRTPS_ADMIN", "DEPARTMENT_ADMIN"],
    "/data-integration": ["ASCRTPS_ADMIN"],
    "/settings/sla-rules": ["ASCRTPS_ADMIN"],
    "/audit": ["ASCRTPS_ADMIN"],
    "/about": ["ASCRTPS_ADMIN", "DEPARTMENT_ADMIN", "OFFICE_HEAD", "REVIEWER", "DPS", "PUBLIC"],
    "/public-performance": ["ASCRTPS_ADMIN", "DEPARTMENT_ADMIN", "OFFICE_HEAD", "REVIEWER", "DPS", "PUBLIC"],
  };

  // Find if path matches exactly or starts with (for nested routes like /departments/[id])
  const matchingRoute = Object.keys(routePermissions).find((route) => {
    if (route === "/") return path === "/";
    return path.startsWith(route);
  });

  if (matchingRoute) {
    const allowedRoles = routePermissions[matchingRoute];
    if (!allowedRoles.includes(role)) {
      // Redirect unauthorized to a safe page (or home, but if home is restricted, redirect to about/public)
      if (role === "PUBLIC") {
        return NextResponse.redirect(new URL("/public-performance", request.url));
      }
      return NextResponse.redirect(new URL("/about", request.url)); // About is open to all internal roles
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - logo/ (images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|logo|images|assam_districts.geojson).*)',
  ],
};
