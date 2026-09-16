import { NextRequest, NextResponse } from "next/server";

async function digest(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default async function proxy(request: NextRequest) {
  const accessKey = process.env.DASHBOARD_ACCESS_KEY;
  if (!accessKey) return NextResponse.next();

  const path = request.nextUrl.pathname;
  if (path === "/login" || path === "/api/session") return NextResponse.next();

  const expected = await digest(accessKey);
  const actual = request.cookies.get("makers_session")?.value;
  if (actual === expected) return NextResponse.next();

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
