import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "rajavasantha_admin";
const SESSION_LIFETIME_SECONDS = 8 * 60 * 60;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters.");
  }
  return value;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function verifyAdminPassword(candidate: string) {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected && safeEqual(candidate, expected));
}

export function createAdminSessionToken() {
  const payload = Buffer.from(
    JSON.stringify({ role: "admin", exp: Date.now() + SESSION_LIFETIME_SECONDS * 1000 }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSessionToken(token?: string) {
  if (!token) return false;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra || !safeEqual(signature, sign(payload))) return false;
  try {
    const value = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      role?: string;
      exp?: number;
    };
    return value.role === "admin" && typeof value.exp === "number" && value.exp > Date.now();
  } catch {
    return false;
  }
}

export async function isAdmin() {
  return verifyAdminSessionToken((await cookies()).get(ADMIN_COOKIE)?.value);
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // Lax is required for the top-level redirect back from Google OAuth.
    // State validation protects that callback; mutations also enforce Origin.
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_LIFETIME_SECONDS,
  };
}

export async function requireAdminApi(request: Request, mutation = false) {
  if (!(await isAdmin())) {
    return Response.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }
  if (mutation) {
    const origin = request.headers.get("origin");
    const expectedOrigin = new URL(request.url).origin;
    if (origin && origin !== expectedOrigin) {
      return Response.json({ success: false, error: "Invalid request origin." }, { status: 403 });
    }
  }
  return null;
}
