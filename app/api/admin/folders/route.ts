import { requireAdminApi } from "@/lib/auth/admin-session";
import { createMediaFolder, getMediaFolders } from "@/lib/media/library";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const denied = await requireAdminApi(request); if (denied) return denied;
  return Response.json({ success: true, folders: await getMediaFolders() });
}

export async function POST(request: Request) {
  const denied = await requireAdminApi(request, true); if (denied) return denied;
  let body: Record<string, unknown>;
  try { body = await request.json() as Record<string, unknown>; } catch { return Response.json({ success: false, error: "Malformed JSON request." }, { status: 400 }); }
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const location = typeof body.location === "string" ? body.location.trim() : "";
  if (!name || name.length > 120) return Response.json({ success: false, error: "Folder name is required and must be 120 characters or fewer." }, { status: 400 });
  if (description.length > 2000) return Response.json({ success: false, error: "Project description must be 2,000 characters or fewer." }, { status: 400 });
  if (category.length > 120) return Response.json({ success: false, error: "Project category must be 120 characters or fewer." }, { status: 400 });
  if (location.length > 200) return Response.json({ success: false, error: "Project location must be 200 characters or fewer." }, { status: 400 });
  const folder = await createMediaFolder({ name, description, category, location, isPublic: body.isPublic === true });
  return Response.json({ success: true, folder }, { status: 201 });
}
