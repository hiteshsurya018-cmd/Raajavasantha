import "server-only";

import { sql } from "@/lib/db";
import { requireAdminApi } from "@/lib/auth/admin-session";

type RouteContext = {
  params: Promise<{
    projectId: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const unauthorized = await requireAdminApi(request);
    if (unauthorized) return unauthorized;
    const { projectId } = await params;

    if (!projectId) {
      return Response.json(
        {
          success: false,
          error: "Project ID is required.",
        },
        { status: 400 },
      );
    }

    const rows = await sql`
      SELECT
        id,
        project_id,
        src,
        alt,
        caption,
        source,
        sort_order,
        cloudinary_public_id,
        cloudinary_asset_id,
        media_fingerprint,
        resource_type,
        format,
        width,
        height,
        bytes,
        source_ref,
        created_at
      FROM project_gallery_images
      WHERE project_id = ${projectId}
      ORDER BY sort_order ASC, created_at ASC
    `;

    return Response.json({
      success: true,
      projectId,
      count: rows.length,
      images: rows,
    });
  } catch (error) {
    console.error("Project media fetch failed:", error);

    return Response.json(
      {
        success: false,
        error: "Failed to load project media.",
      },
      { status: 500 },
    );
  }
}
