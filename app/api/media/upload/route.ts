import "server-only";

import { ingestMedia } from "@/lib/media/ingest-media";
import { requireAdminApi } from "@/lib/auth/admin-session";

export const runtime = "nodejs";

function jsonError(
  message: string,
  status = 400,
) {
  return Response.json(
    {
      success: false,
      error: message,
    },
    { status },
  );
}

export async function POST(request: Request) {
  try {
    const unauthorized = await requireAdminApi(request, true);
    if (unauthorized) return unauthorized;
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return jsonError("Malformed multipart request.", 400);
    }

    const projectIdValue = formData.get("projectId");
    const fileValue = formData.get("file");
    const sourceValue = formData.get("source");
    const altValue = formData.get("alt");
    const captionValue = formData.get("caption");
    const sourceRefValue = formData.get("sourceRef");

    if (
      typeof projectIdValue !== "string" ||
      !projectIdValue.trim()
    ) {
      return jsonError("projectId is required.");
    }

    if (!(fileValue instanceof File)) {
      return jsonError("An image file is required.");
    }

    if (fileValue.size > 20 * 1024 * 1024) {
      return jsonError("Image exceeds the 20 MB upload limit.", 413);
    }

    const projectId = projectIdValue.trim();

    const source =
      typeof sourceValue === "string" &&
      sourceValue.trim()
        ? sourceValue.trim()
        : "local";

    const alt =
      typeof altValue === "string" &&
      altValue.trim()
        ? altValue.trim()
        : "Rajavasantha Welfare Trust project photograph";

    const caption =
      typeof captionValue === "string" &&
      captionValue.trim()
        ? captionValue.trim()
        : null;

    const sourceRef =
      typeof sourceRefValue === "string" &&
      sourceRefValue.trim()
        ? sourceRefValue.trim()
        : null;

    const arrayBuffer = await fileValue.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await ingestMedia({
      projectId,
      buffer,
      mimeType: fileValue.type,
      fileSize: fileValue.size,
      source: source as
        | "local"
        | "google-photos"
        | "icloud"
        | "external",
      alt,
      caption,
      sourceRef,
      originalFilename: fileValue.name.replace(/[\\/\0]/g, "_").slice(0, 255),
    });

    return Response.json(result);
  } catch (error) {
    console.error("Media upload failed:", error);

    const status =
      error instanceof Error &&
      "status" in error &&
      typeof error.status === "number"
        ? error.status
        : 500;

    return jsonError(
      error instanceof Error
        ? error.message
        : "Media upload failed.",
      status,
    );
  }
}
