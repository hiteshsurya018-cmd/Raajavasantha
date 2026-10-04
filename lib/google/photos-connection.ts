import "server-only";

import { sql } from "@/lib/db";
import { decryptGoogleToken } from "@/lib/google/photos-token";

export async function hasGooglePhotosConnection() {
  const rows = (await sql`
    SELECT id FROM google_photos_connections WHERE id = 1 LIMIT 1
  `) as { id: number }[];
  return rows.length > 0;
}

export async function getGooglePhotosConnectionStatus() {
  const rows = await sql`SELECT refresh_token FROM google_photos_connections WHERE id = 1 LIMIT 1`;
  if (!rows.length) return { connected: false, reconnectRequired: false };
  try {
    decryptGoogleToken(String(rows[0].refresh_token));
    return { connected: true, reconnectRequired: false };
  } catch {
    return { connected: false, reconnectRequired: true };
  }
}
