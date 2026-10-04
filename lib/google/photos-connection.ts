import "server-only";

import { sql } from "@/lib/db";

export async function hasGooglePhotosConnection() {
  const rows = (await sql`
    SELECT id FROM google_photos_connections WHERE id = 1 LIMIT 1
  `) as { id: number }[];
  return rows.length > 0;
}
