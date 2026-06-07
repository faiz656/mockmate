import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const protectedRoutes = ["/dashboard", "/interview"];
  const isProtected = protectedRoutes.some(r =>
    request.nextUrl.pathname.startsWith(r)
  );

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("sb-access-token") ||
                request.cookies.get("sb-ymgtdjgqgkakkexythbk-auth-token");

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
