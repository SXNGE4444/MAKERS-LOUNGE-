import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function POST(request: Request) {
  const configured = process.env.DASHBOARD_ACCESS_KEY;
  if (!configured) return NextResponse.redirect(new URL("/", request.url), 303);

  const data = await request.formData();
  const supplied = String(data.get("key") || "");
  const expectedBuffer = Buffer.from(digest(configured));
  const suppliedBuffer = Buffer.from(digest(supplied));
  const valid = expectedBuffer.length === suppliedBuffer.length && timingSafeEqual(expectedBuffer, suppliedBuffer);

  if (!valid) return NextResponse.redirect(new URL("/login?error=1", request.url), 303);

  const response = NextResponse.redirect(new URL("/", request.url), 303);
  response.cookies.set("makers_session", digest(configured), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 18
  });
  return response;
}
