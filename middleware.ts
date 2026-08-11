import { NextResponse, type NextRequest } from "next/server";
import { getLaunchState } from "@/lib/launch";

const PUBLIC_BYPASS_PREFIXES = ["/api", "/admin", "/_next"];
const PUBLIC_BYPASS_FILES = ["/favicon.ico", "/robots.txt", "/sitemap.xml", "/logo.jpeg"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    PUBLIC_BYPASS_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    PUBLIC_BYPASS_FILES.includes(pathname) ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const launchState = getLaunchState({ now: Date.now() });

  if (launchState.launched) {
    if (pathname === "/launch") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  if (pathname === "/launch") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/launch";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
