import { requireAdminApi } from "@/lib/auth/admin-session";
import { cloudinary } from "@/lib/cloudinary";
import { sql } from "@/lib/db";

export const runtime = "nodejs";
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
