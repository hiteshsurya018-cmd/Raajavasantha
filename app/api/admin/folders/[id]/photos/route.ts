import { requireAdminApi } from "@/lib/auth/admin-session";
import { ingestMedia } from "@/lib/media/ingest-media";
import { MAX_MEDIA_BYTES } from "@/lib/media/media-utils";
import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";

export const runtime = "nodejs";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const denied = await requireAdminApi(request, true); if (denied) return denied;
  const { id } = await context.params; const form = await request.formData(); const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ success: false, error: "A photograph is required." }, { status: 400 });
  if (file.size > MAX_MEDIA_BYTES) return Response.json({ success: false, error: "Image exceeds the allowed size." }, { status: 413 });
  try {
    const result = await ingestMedia({ projectId: id, buffer: Buffer.from(await file.arrayBuffer()), mimeType: file.type, fileSize: file.size, originalFilename: file.name, source: "local", alt: String(form.get("alt") ?? "") || "Rajavasantha Welfare Trust project photograph" });
    return Response.json(result);
  } catch (error) { const status = error instanceof Error && "status" in error ? Number(error.status) : 500; return Response.json({ success: false, error: status < 500 && error instanceof Error ? error.message : "Unable to save photograph." }, { status }); }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const denied = await requireAdminApi(request, true); if (denied) return denied;
  const { id: sourceProjectId } = await context.params;
  if (!UUID_PATTERN.test(sourceProjectId)) return Response.json({ success: false, error: "Invalid source project." }, { status: 400 });
  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; }
  catch { return Response.json({ success: false, error: "Malformed JSON request." }, { status: 400 }); }
  const destinationProjectId = typeof body.destinationProjectId === "string" ? body.destinationProjectId.trim() : "";
  const photoIds = Array.isArray(body.photoIds)
    ? Array.from(new Set(body.photoIds.filter((value): value is string => typeof value === "string" && UUID_PATTERN.test(value))))
    : [];
  if (!destinationProjectId || !UUID_PATTERN.test(destinationProjectId)) return Response.json({ success: false, error: "A valid destination project is required." }, { status: 400 });
  if (destinationProjectId === sourceProjectId) return Response.json({ success: false, error: "Choose a different destination project." }, { status: 400 });
  if (!photoIds.length || photoIds.length > 500) return Response.json({ success: false, error: "Select between 1 and 500 photographs." }, { status: 400 });

  const projects = await sql.query("SELECT id, slug FROM projects WHERE id = ANY($1::uuid[])", [[sourceProjectId, destinationProjectId]]) as { id: string; slug: string }[];
  if (projects.length !== 2) return Response.json({ success: false, error: "Source or destination project was not found." }, { status: 404 });
  const selected = await sql.query("SELECT id FROM project_gallery_images WHERE project_id = $1 AND id = ANY($2::uuid[])", [sourceProjectId, photoIds]);
  if (selected.length !== photoIds.length) return Response.json({ success: false, error: "One or more selected photographs do not belong to the source project." }, { status: 409 });

  const moved = await sql.query(`
    WITH destination_order AS (
      SELECT COALESCE(MAX(sort_order), -1) AS maximum
      FROM project_gallery_images WHERE project_id = $2
    ), requested AS (
      SELECT value::uuid AS id, ordinality::integer AS position
      FROM unnest($3::text[]) WITH ORDINALITY AS selected(value, ordinality)
    )
    UPDATE project_gallery_images AS gallery
    SET project_id = $2, sort_order = destination_order.maximum + requested.position
    FROM requested, destination_order
    WHERE gallery.id = requested.id AND gallery.project_id = $1
    RETURNING gallery.id
  `, [sourceProjectId, destinationProjectId, photoIds]);
  await sql.query(`
    UPDATE media_photos AS photo SET folder_id = destination.id, updated_at = now()
    FROM media_folders AS destination
    WHERE photo.id = ANY($1::uuid[]) AND destination.project_id = $2
  `, [photoIds, destinationProjectId]);
  await sql.query(`
    UPDATE projects SET updated_at = now(),
      cover_image = CASE WHEN id = $1 AND cover_image IN (
        SELECT src FROM project_gallery_images WHERE id = ANY($3::uuid[])
      ) THEN null ELSE cover_image END
    WHERE id = ANY($2::uuid[])
  `, [sourceProjectId, [sourceProjectId, destinationProjectId], photoIds]);

  for (const project of projects) {
    revalidatePath(`/projects/${project.slug}`);
    revalidatePath(`/gallery/${project.slug}`);
    revalidatePath(`/admin/folders/${project.id}`);
  }
  revalidatePath("/admin"); revalidatePath("/projects"); revalidatePath("/projects/map"); revalidatePath("/gallery"); revalidatePath("/sitemap.xml");
  return Response.json({ success: true, moved: moved.length, destinationProjectId });
}
