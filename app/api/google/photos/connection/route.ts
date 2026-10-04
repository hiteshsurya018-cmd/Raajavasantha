import { requireAdminApi } from "@/lib/auth/admin-session";
import { sql } from "@/lib/db";
import { getGooglePhotosConnectionStatus } from "@/lib/google/photos-connection";

export async function GET(request: Request) { const denied = await requireAdminApi(request); if (denied) return denied; return Response.json({ success: true, ...(await getGooglePhotosConnectionStatus()) }); }
export async function DELETE(request: Request) { const denied = await requireAdminApi(request, true); if (denied) return denied; await sql`DELETE FROM google_photos_connections WHERE id = 1`; return Response.json({ success: true }); }
