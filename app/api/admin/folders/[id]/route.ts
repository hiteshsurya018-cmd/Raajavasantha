import { revalidatePath } from "next/cache";
import { cloudinary } from "@/lib/cloudinary";
import { sql } from "@/lib/db";
import { requireAdminApi } from "@/lib/auth/admin-session";
import { getFolderPhotos, getMediaFolderById } from "@/lib/media/library";

export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };

function refreshProject(slug: string) {
  revalidatePath("/admin");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/projects/map");
  revalidatePath("/gallery");
  revalidatePath(`/gallery/${slug}`);
  revalidatePath("/sitemap.xml");
}

export async function GET(request: Request, context: Context) {
  const denied = await requireAdminApi(request); if (denied) return denied;
  const { id } = await context.params; const folder = await getMediaFolderById(id);
  if (!folder) return Response.json({ success: false, error: "Project not found." }, { status: 404 });
  return Response.json({ success: true, folder, photos: await getFolderPhotos(id) });
}

export async function PATCH(request: Request, context: Context) {
  const denied = await requireAdminApi(request, true); if (denied) return denied;
  const { id } = await context.params; const project = await getMediaFolderById(id);
  if (!project) return Response.json({ success: false, error: "Project not found." }, { status: 404 });
  let body: Record<string, unknown>; try { body = await request.json() as Record<string, unknown>; } catch { return Response.json({ success: false, error: "Malformed JSON request." }, { status: 400 }); }
  const name = typeof body.name === "string" ? body.name.trim() : null;
  const description = typeof body.description === "string" ? body.description.trim() : null;
  const category = typeof body.category === "string" ? body.category.trim() : null;
  const location = typeof body.location === "string" ? body.location.trim() : null;
  const coverId = typeof body.coverPhotoId === "string" ? body.coverPhotoId : body.coverPhotoId === null ? null : undefined;
  if (name !== null && (!name || name.length > 120)) return Response.json({ success: false, error: "Invalid project name." }, { status: 400 });
  if (description !== null && description.length > 2000) return Response.json({ success: false, error: "Invalid project description." }, { status: 400 });
  if (category !== null && category.length > 120) return Response.json({ success: false, error: "Invalid category." }, { status: 400 });
  if (location !== null && location.length > 200) return Response.json({ success: false, error: "Invalid location." }, { status: 400 });
  let coverUrl: string | null | undefined; let coverAlt: string | null | undefined;
  if (coverId) {
    const photos = await sql`SELECT src, alt, resource_type FROM project_gallery_images WHERE id = ${coverId} AND project_id = ${id} LIMIT 1`;
    if (!photos.length) return Response.json({ success: false, error: "Cover photograph is not in this project." }, { status: 400 });
    if (photos[0].resource_type === "video") return Response.json({ success: false, error: "Choose a photograph, not a video, as the project cover." }, { status: 400 });
    coverUrl = String(photos[0].src); coverAlt = String(photos[0].alt);
  } else if (coverId === null) { coverUrl = null; coverAlt = null; }
  const rows = await sql`
    UPDATE projects SET
      title = COALESCE(${name}, title),
      description = COALESCE(${description}, description),
      short_description = CASE WHEN ${description}::text IS NULL THEN short_description ELSE left(${description}, 320) END,
      category = COALESCE(${category}, category),
      location = COALESCE(${location}, location),
      is_public = COALESCE(${typeof body.isPublic === "boolean" ? body.isPublic : null}, is_public),
      cover_image = CASE WHEN ${coverId === undefined} THEN cover_image ELSE ${coverUrl ?? null} END,
      cover_image_alt = CASE WHEN ${coverId === undefined} THEN cover_image_alt ELSE ${coverAlt ?? null} END,
      updated_at = now()
    WHERE id = ${id} RETURNING *
  `;
  refreshProject(project.slug);
  return Response.json({ success: true, folder: rows[0] });
}

export async function DELETE(request: Request, context: Context) {
  const denied = await requireAdminApi(request, true); if (denied) return denied;
  const { id } = await context.params; const project = await getMediaFolderById(id);
  if (!project) return Response.json({ success: false, error: "Project not found." }, { status: 404 });
  const assets = await sql`
    SELECT gallery.cloudinary_public_id, gallery.resource_type, legacy.thumbnail_public_id
    FROM project_gallery_images gallery
    LEFT JOIN media_photos legacy ON legacy.id = gallery.id
    WHERE gallery.project_id = ${id}
  `;
  const storedAssets = assets.flatMap((asset) => [
    asset.cloudinary_public_id ? { publicId: String(asset.cloudinary_public_id), resourceType: asset.resource_type === "video" ? "video" : "image" } : null,
    asset.thumbnail_public_id ? { publicId: String(asset.thumbnail_public_id), resourceType: "image" } : null,
  ]).filter((asset): asset is { publicId: string; resourceType: "image" | "video" } => Boolean(asset));
  try { await Promise.all(storedAssets.map((asset) => cloudinary.uploader.destroy(asset.publicId, { resource_type: asset.resourceType, invalidate: true }))); }
  catch { return Response.json({ success: false, error: "Unable to remove stored photographs. Please try again." }, { status: 502 }); }
  await sql`DELETE FROM media_folders WHERE project_id = ${id}`;
  await sql`DELETE FROM projects WHERE id = ${id}`;
  refreshProject(project.slug);
  return Response.json({ success: true });
}
