import "server-only";

import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminSessionToken,
  isAdmin,
  verifyAdminPassword,
} from "@/lib/auth/admin-session";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({ authenticated: await isAdmin() });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ success: false, error: "Invalid request origin." }, { status: 403 });
  }
  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return Response.json({ success: false, error: "Malformed request." }, { status: 400 });
  }
  if (!verifyAdminPassword(password)) {
    return Response.json({ success: false, error: "Invalid credentials." }, { status: 401 });
  }
  (await cookies()).set(ADMIN_COOKIE, createAdminSessionToken(), adminCookieOptions());
  return Response.json({ success: true });
}

export async function DELETE(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ success: false, error: "Invalid request origin." }, { status: 403 });
  }
  (await cookies()).delete(ADMIN_COOKIE);
  return Response.json({ success: true });
}
