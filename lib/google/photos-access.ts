import "server-only";

import { sql } from "@/lib/db";
import { decryptGoogleToken } from "@/lib/google/photos-token";

export const PICKER_SCOPE = "https://www.googleapis.com/auth/photospicker.mediaitems.readonly";

export class GooglePhotosConnectionError extends Error {
  constructor(message: string, public status = 409) { super(message); }
}

export async function getGooglePhotosAccessToken() {
  const rows = await sql`SELECT refresh_token FROM google_photos_connections WHERE id = 1 LIMIT 1`;
  if (!rows.length) throw new GooglePhotosConnectionError("Google Photos is not connected. Connect Google Photos first.");
  let refreshToken: string;
  try { refreshToken = decryptGoogleToken(String(rows[0].refresh_token)); }
  catch { throw new GooglePhotosConnectionError("Google Photos authorization expired. Please reconnect."); }
  const clientId = process.env.GOOGLE_PHOTOS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_PHOTOS_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new GooglePhotosConnectionError("Google Photos OAuth is not configured.", 500);
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, cache: "no-store",
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: "refresh_token" }),
  });
  const data = await response.json() as { access_token?: string };
  if (!response.ok || !data.access_token) {
    console.error("Google access-token refresh failed", { status: response.status });
    throw new GooglePhotosConnectionError("Google Photos authorization expired. Please reconnect.");
  }
  return data.access_token;
}

export function googleErrorResponse(error: unknown, fallback: string) {
  const status = error instanceof GooglePhotosConnectionError ? error.status : 500;
  return Response.json({ success: false, error: status < 500 && error instanceof Error ? error.message : fallback }, { status });
}
