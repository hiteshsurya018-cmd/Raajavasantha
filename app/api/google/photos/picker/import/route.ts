import "server-only";

import { sql } from "@/lib/db";
import { decryptGoogleToken } from "@/lib/google/photos-token";
import { ingestMedia } from "@/lib/media/ingest-media";
import { requireAdminApi } from "@/lib/auth/admin-session";

export const runtime = "nodejs";

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

    if (!projectId) {
      return jsonError("projectId is required.");
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
    const refreshToken = decryptGoogleToken(
      connectionRows[0].refresh_token,
    );

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

    if (!mimeType.startsWith("image/")) {
      return jsonError("The selected item is not a supported image.", 415);
    }

    /*
     * The Picker baseUrl is temporary.
     *
     * Append d=true so Google returns the actual
     * downloadable media bytes.
     */
    const downloadUrl =
      `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}d=true`;

    const imageResponse = await fetch(
      downloadUrl,
      {
        method: "GET",
        headers: {
          Authorization:
            `Bearer ${tokenData.access_token}`,
        },
        cache: "no-store",
      },
    );

    const declaredLength = Number(imageResponse.headers.get("content-length") ?? 0);
    if (declaredLength > 20 * 1024 * 1024) {
      return jsonError("Image exceeds the 20 MB upload limit.", 413);
    }

    if (!imageResponse.ok) {
      console.error(
        "Google Photos image download failed:",
        {
          status: imageResponse.status,
        },
      );

      return jsonError(
        "Could not download the selected Google Photos image.",
        502,
      );
    }

    /*
     * Convert the downloaded image into a Buffer
     * so the existing ingestMedia() pipeline can
     * process it exactly like a local upload.
     */
    const arrayBuffer =
      await imageResponse.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      return jsonError(
        "Google Photos returned an empty image.",
        502,
      );
    }

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
    const result = await ingestMedia({
      projectId,
      buffer,
      mimeType,
      fileSize: buffer.length,
      source: "google-photos",
      alt,
      caption,
      sourceRef:
        `google-photos:${mediaItemId}`,
      originalFilename: filename.replace(/[\\/\0]/g, "_").slice(0, 255),
    });

    return Response.json({
      success: true,
      message:
        result.duplicate
          ? "Google Photos image already exists in the project gallery."
          : "Google Photos image imported successfully.",
      duplicate: result.duplicate,
      filename,
      mediaItemId,
      sessionId,
      image: result.image,
      project: result.project,
    });
  } catch (error) {
    console.error(
      "Google Photos media import failed:",
      error,
    );

    const status = error instanceof Error && "status" in error && typeof error.status === "number"
      ? error.status
      : 500;
    return jsonError(status < 500 && error instanceof Error ? error.message : "Google Photos media import failed.", status);
  }
}
