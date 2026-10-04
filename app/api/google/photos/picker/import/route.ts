import "server-only";

import { sql } from "@/lib/db";
import { decryptGoogleToken } from "@/lib/google/photos-token";
import { ingestMedia } from "@/lib/media/ingest-media";
import { MAX_MEDIA_BYTES, MAX_VIDEO_BYTES } from "@/lib/media/media-utils";
import { requireAdminApi } from "@/lib/auth/admin-session";

export const runtime = "nodejs";
export const maxDuration = 300;

const GOOGLE_TOKEN_URL =
  "https://oauth2.googleapis.com/token";

const GOOGLE_PICKER_MEDIA_ITEMS_URL =
  "https://photospicker.googleapis.com/v1/mediaItems";

const GOOGLE_PHOTOS_SCOPE =
  "https://www.googleapis.com/auth/photospicker.mediaitems.readonly";

type GoogleTokenResponse = {
  access_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
};

type GooglePickerMediaItem = {
  id?: string;
  createTime?: string;
  type?: string;
  mediaFile?: {
    filename?: string;
    mimeType?: string;
    baseUrl?: string;
    mediaFileMetadata?: {
      width?: string;
      height?: string;
      videoMetadata?: {
        processingStatus?: "UNSPECIFIED" | "PROCESSING" | "READY" | "FAILED";
      };
    };
  };
  baseUrl?: string;
  mimeType?: string;
  fileName?: string;
  width?: number;
  height?: number;
};

type GooglePickerMediaItemsResponse = {
  mediaItems?: GooglePickerMediaItem[];
  nextPageToken?: string;
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
};

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
    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return jsonError("Malformed JSON request.", 400);
    }

    const projectId =
      typeof body.projectId === "string"
        ? body.projectId.trim()
        : "";
    const folderId = typeof body.folderId === "string" ? body.folderId.trim() : "";

    const sessionId =
      typeof body.sessionId === "string"
        ? body.sessionId.trim()
        : "";

    const mediaItemId =
      typeof body.mediaItemId === "string"
        ? body.mediaItemId.trim()
        : "";

    const alt =
      typeof body.alt === "string" &&
      body.alt.trim()
        ? body.alt.trim()
        : "Rajavasantha Welfare Trust project photograph";

    const caption =
      typeof body.caption === "string" &&
      body.caption.trim()
        ? body.caption.trim()
        : null;

    if ((!projectId && !folderId) || (projectId && folderId)) {
      return jsonError("Exactly one projectId or folderId is required.");
    }

    if (!sessionId) {
      return jsonError("sessionId is required.");
    }

    if (!mediaItemId) {
      return jsonError("mediaItemId is required.");
    }

    /*
     * Retrieve the encrypted Google Photos
     * refresh token.
     */
    const connectionRows = (await sql`
      SELECT
        id,
        refresh_token
      FROM google_photos_connections
      WHERE id = 1
      LIMIT 1
    `) as {
      id: number;
      refresh_token: string;
    }[];

    if (connectionRows.length === 0) {
      return jsonError(
        "Google Photos is not connected. Authorize Google Photos first.",
        400,
      );
    }

    /*
     * Decrypt the refresh token only on the server.
     */
    let refreshToken: string;
    try { refreshToken = decryptGoogleToken(connectionRows[0].refresh_token); }
    catch { return jsonError("Google Photos authorization expired. Please reconnect.", 409); }

    const clientId =
      process.env.GOOGLE_PHOTOS_CLIENT_ID;

    const clientSecret =
      process.env.GOOGLE_PHOTOS_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return jsonError(
        "Google Photos OAuth credentials are not configured.",
        500,
      );
    }

    /*
     * Exchange the refresh token for a fresh
     * Google access token.
     */
    const tokenResponse = await fetch(
      GOOGLE_TOKEN_URL,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
          scope: GOOGLE_PHOTOS_SCOPE,
        }),
        cache: "no-store",
      },
    );

    const tokenData =
      (await tokenResponse.json()) as GoogleTokenResponse;

    if (
      !tokenResponse.ok ||
      !tokenData.access_token
    ) {
      console.error("Google access-token refresh failed", { status: tokenResponse.status });

      return jsonError(
        "Could not refresh the Google Photos access token.",
        502,
      );
    }

    /*
     * Ask Google Picker for the selected media
     * belonging to this session.
     */
    let selectedItem: GooglePickerMediaItem | undefined;
    let pageToken: string | undefined;
    do {
      const mediaItemsUrl = new URL(GOOGLE_PICKER_MEDIA_ITEMS_URL);
      mediaItemsUrl.searchParams.set("sessionId", sessionId);
      mediaItemsUrl.searchParams.set("pageSize", "100");
      if (pageToken) mediaItemsUrl.searchParams.set("pageToken", pageToken);
      const mediaResponse = await fetch(mediaItemsUrl, {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
        cache: "no-store",
      });
      const mediaData = (await mediaResponse.json()) as GooglePickerMediaItemsResponse;
      if (!mediaResponse.ok) {
        console.error("Google Photos media-items request failed", { status: mediaResponse.status });
        return jsonError("Could not retrieve selected Google Photos media.", mediaResponse.status < 500 ? mediaResponse.status : 502);
      }
      selectedItem = (mediaData.mediaItems ?? []).find((item) => item.id === mediaItemId);
      pageToken = mediaData.nextPageToken;
    } while (!selectedItem && pageToken);

    if (!selectedItem) {
      return jsonError(
        "The selected Google Photos media item was not found in this Picker session.",
        404,
      );
    }

    /*
     * Google Picker may expose the URL either
     * directly or through mediaFile.
     */
    const baseUrl =
      selectedItem.mediaFile?.baseUrl ??
      selectedItem.baseUrl ??
      null;

    if (!baseUrl) {
      return jsonError(
        "Google Photos did not provide a downloadable media URL.",
        502,
      );
    }

    const mimeType =
      selectedItem.mediaFile?.mimeType ??
      selectedItem.mimeType ??
      "image/jpeg";

    const isVideo = selectedItem.type === "VIDEO" || mimeType.startsWith("video/");
    const supported = isVideo
      ? new Set(["video/mp4", "video/quicktime", "video/webm", "video/3gpp", "video/x-msvideo", "video/mpeg"])
      : new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif"]);
    if (!supported.has(mimeType)) {
      return jsonError(`The selected ${isVideo ? "video" : "image"} format is not supported.`, 415);
    }
    const videoStatus = selectedItem.mediaFile?.mediaFileMetadata?.videoMetadata?.processingStatus;
    if (isVideo && videoStatus && videoStatus !== "READY") {
      return jsonError(videoStatus === "PROCESSING"
        ? "This video is still processing in Google Photos. Try again when it is ready."
        : "This video is not available for download from Google Photos.", 409);
    }

    /*
     * The Picker baseUrl is temporary.
     *
     * Append d=true so Google returns the actual
     * downloadable media bytes.
     */
    const downloadUrl = isVideo
      ? `${baseUrl}=dv`
      : `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}d=true`;

    const mediaResponse = await fetch(
      downloadUrl,
      {
        method: "GET",
        headers: {
          Authorization:
            `Bearer ${tokenData.access_token}`,
        },
        cache: "no-store",
        signal: AbortSignal.timeout(isVideo ? 120_000 : 45_000),
      },
    );

    const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_MEDIA_BYTES;
    const declaredLength = Number(mediaResponse.headers.get("content-length") ?? 0);
    if (declaredLength > maxBytes) {
      return jsonError(`${isVideo ? "Video" : "Image"} exceeds the ${maxBytes / 1024 / 1024} MB upload limit.`, 413);
    }

    if (!mediaResponse.ok) {
      console.error(
        "Google Photos media download failed:",
        {
          status: mediaResponse.status,
        },
      );

      return jsonError(
        "Could not download the selected Google Photos media.",
        502,
      );
    }

    /*
     * Convert the downloaded image into a Buffer
     * so the existing ingestMedia() pipeline can
     * process it exactly like a local upload.
     */
    const buffer = await readLimitedBody(mediaResponse, maxBytes);

    if (buffer.length === 0) {
      return jsonError(
        "Google Photos returned an empty media file.",
        502,
      );
    }
    const responseMimeType = mediaResponse.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
    const effectiveMimeType = responseMimeType && supported.has(responseMimeType) ? responseMimeType : mimeType;

    /*
     * Determine the filename.
     */
    const filename =
      selectedItem.mediaFile?.filename ??
      selectedItem.fileName ??
      `google-photos-${mediaItemId}.jpg`;

    /*
     * Store the Google Photos media through the
     * EXISTING Cloudinary + Neon ingestion pipeline.
     */
    const common = { buffer, mimeType: effectiveMimeType, source: "google-photos" as const, alt, caption,
      sourceRef: `google-photos:${mediaItemId}`, originalFilename: filename.replace(/[\\/\0]/g, "_").slice(0, 255) };
    const result = await ingestMedia({
      projectId: folderId || projectId,
      fileSize: buffer.length,
      ...common,
    });

    return Response.json({
      success: true,
      message:
        result.duplicate
          ? "Google Photos media already exists in the project gallery."
          : "Google Photos media imported successfully.",
      duplicate: result.duplicate,
      filename,
      mediaItemId,
      sessionId,
      image: result.image,
      project: "project" in result ? result.project : undefined,
    });
  } catch (error) {
    console.error("Google Photos media import failed", { name: error instanceof Error ? error.name : "unknown" });

    const status = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError") ? 504
      : error instanceof Error && "status" in error && typeof error.status === "number"
      ? error.status
      : 500;
    return jsonError(status === 504 ? "Google Photos media download timed out." : status < 500 && error instanceof Error ? error.message : "Google Photos media import failed.", status);
  }
}

async function readLimitedBody(response: Response, maxBytes: number) {
  if (!response.body) return Buffer.alloc(0);
  const reader = response.body.getReader();
  const chunks: Buffer[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        throw Object.assign(new Error("Selected media exceeds the allowed size."), { status: 413 });
      }
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks, total);
}
