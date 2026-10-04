import { requireAdminApi } from "@/lib/auth/admin-session";
import { cloudinary } from "@/lib/cloudinary";
import { sql } from "@/lib/db";

export const runtime = "nodejs";
export async function PATCH(request: Request, context: { params: Promise<{ id: string; photoId: string }> }) {
  const denied = await requireAdminApi(request, true); if (denied) return denied;
  const { id, photoId } = await context.params;
  let body: Record<string, unknown>; try { body = await request.json() as Record<string, unknown>; } catch { return Response.json({ success: false, error: "Malformed JSON request." }, { status: 400 }); }
  const latitude = body.latitude === null || body.latitude === "" ? null : typeof body.latitude === "number" ? body.latitude : undefined;
  const longitude = body.longitude === null || body.longitude === "" ? null : typeof body.longitude === "number" ? body.longitude : undefined;
  const visibility = typeof body.locationVisibility === "string" ? body.locationVisibility : undefined;
  const locationLabel = body.locationLabel === null ? null : typeof body.locationLabel === "string" ? body.locationLabel.trim() || null : undefined;
  const locationVerified = typeof body.locationVerified === "boolean" ? body.locationVerified : undefined;
  if ((latitude === undefined) !== (longitude === undefined) || (latitude === null) !== (longitude === null)) return Response.json({ success: false, error: "Latitude and longitude must be supplied together." }, { status: 400 });
  if (typeof latitude === "number" && (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)) return Response.json({ success: false, error: "Invalid latitude." }, { status: 400 });
  if (typeof longitude === "number" && (!Number.isFinite(longitude) || longitude < -180 || longitude > 180)) return Response.json({ success: false, error: "Invalid longitude." }, { status: 400 });
  if (latitude === 0 && longitude === 0) return Response.json({ success: false, error: "0,0 is not accepted." }, { status: 400 });
  if (visibility !== undefined && !["exact", "approximate", "area", "hidden"].includes(visibility)) return Response.json({ success: false, error: "Invalid location visibility." }, { status: 400 });
  if (locationLabel !== undefined && locationLabel !== null && locationLabel.length > 250) return Response.json({ success: false, error: "Location label is too long." }, { status: 400 });
  if ("locationVerified" in body && locationVerified === undefined) return Response.json({ success: false, error: "Location verification must be a boolean." }, { status: 400 });
  const clearsLocation = latitude === null && longitude === null && locationLabel === null;
  const locationSource = clearsLocation ? null : (latitude !== undefined || locationLabel !== undefined ? "admin" : undefined);
  const locationPrecision = clearsLocation ? "unknown" : typeof latitude === "number" && typeof longitude === "number" ? "exact" : locationLabel ? "area" : undefined;
  const rows = await sql`
    UPDATE project_gallery_images SET
      latitude = CASE WHEN ${latitude !== undefined} THEN ${latitude ?? null} ELSE latitude END,
      longitude = CASE WHEN ${longitude !== undefined} THEN ${longitude ?? null} ELSE longitude END,
      location_visibility = COALESCE(${visibility ?? null}, location_visibility)
      , location_label = CASE WHEN ${locationLabel !== undefined} THEN ${locationLabel ?? null} ELSE location_label END
      , location_source = CASE WHEN ${locationSource !== undefined} THEN ${locationSource ?? null} ELSE location_source END
      , location_precision = COALESCE(${locationPrecision ?? null}, location_precision)
      , location_verified = CASE WHEN ${clearsLocation} THEN false ELSE COALESCE(${locationVerified ?? null}, location_verified) END
    WHERE id = ${photoId} AND project_id = ${id}
    RETURNING id, latitude, longitude, location_visibility, location_label, location_source, location_precision, location_verified
  `;
  if (!rows.length) return Response.json({ success: false, error: "Media not found." }, { status: 404 });
  return Response.json({ success: true, photo: rows[0] });
}
export async function DELETE(request: Request, context: { params: Promise<{ id: string; photoId: string }> }) {
  const denied = await requireAdminApi(request, true); if (denied) return denied;
  const { id, photoId } = await context.params; const rows = await sql`
    SELECT gallery.cloudinary_public_id, gallery.resource_type, gallery.src, legacy.thumbnail_public_id
    FROM project_gallery_images gallery
    LEFT JOIN media_photos legacy ON legacy.id = gallery.id
    WHERE gallery.id = ${photoId} AND gallery.project_id = ${id}
    LIMIT 1
  `;
  if (!rows.length) return Response.json({ success: false, error: "Photograph not found." }, { status: 404 });
  const assets = [
    rows[0].cloudinary_public_id ? { publicId: String(rows[0].cloudinary_public_id), resourceType: rows[0].resource_type === "video" ? "video" : "image" } : null,
    rows[0].thumbnail_public_id ? { publicId: String(rows[0].thumbnail_public_id), resourceType: "image" } : null,
  ].filter((asset): asset is { publicId: string; resourceType: "image" | "video" } => Boolean(asset));
  try { await Promise.all(assets.map((asset) => cloudinary.uploader.destroy(asset.publicId, { resource_type: asset.resourceType, invalidate: true }))); }
  catch { return Response.json({ success: false, error: "Unable to remove the stored photograph." }, { status: 502 }); }
  await sql`DELETE FROM media_photos WHERE id = ${photoId}`;
  await sql`DELETE FROM project_gallery_images WHERE id = ${photoId} AND project_id = ${id}`;
  await sql`UPDATE projects SET updated_at = now(), cover_image = CASE WHEN cover_image = ${rows[0].src} THEN null ELSE cover_image END WHERE id = ${id}`;
  return Response.json({ success: true });
}
