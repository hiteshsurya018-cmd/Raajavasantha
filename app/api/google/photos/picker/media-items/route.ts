import "server-only";

import { NextRequest } from "next/server";

import { sql } from "@/lib/db";
import { decryptGoogleToken } from "@/lib/google/photos-token";
import { requireAdminApi } from "@/lib/auth/admin-session";

export const runtime = "nodejs";

const GOOGLE_TOKEN_URL =
  "https://oauth2.googleapis.com/token";

const GOOGLE_PICKER_MEDIA_ITEMS_URL =
  "https://photospicker.googleapis.com/v1/mediaItems";

const GOOGLE_PHOTOS_SCOPE =
  "https://www.googleapis.com/auth/photospicker.mediaitems.readonly";

/**
 * Google OAuth token response.
 */
type GoogleTokenResponse = {
  access_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
};

/**
 * Google Picker media item.
 *
 * The Picker API returns PickedMediaItem objects.
 */
type GooglePickedMediaItem = {
  id?: string;
  createTime?: string;
  type?: string;
  mediaFile?: {
    fileName?: string;
    mimeType?: string;
    mediaFileMetadata?: {
      width?: number;
      height?: number;
    };
    baseUrl?: string;
  };
};

/**
 * Google Picker mediaItems.list response.
 */
type GooglePickerMediaItemsResponse = {
  mediaItems?: GooglePickedMediaItem[];
  nextPageToken?: string;
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
};

/**
 * GET
 *
 * Example:
 *
 * /api/google/photos/picker/media-items
 *   ?sessionId=SESSION_ID
 *
 * Optional:
 *
 * &pageSize=10
 * &pageToken=...
 */
export async function GET(
  request: NextRequest,
) {
  try {
    const unauthorized = await requireAdminApi(request);
    if (unauthorized) return unauthorized;
    const { searchParams } =
      new URL(request.url);

    const sessionId =
      searchParams.get("sessionId")?.trim();

    const pageToken =
      searchParams.get("pageToken")?.trim();

    const pageSizeParam =
      searchParams.get("pageSize");

    /*
     * sessionId is required by Google's
     * mediaItems.list endpoint.
     */
    if (!sessionId) {
      return Response.json(
        {
          success: false,
          error:
            "sessionId query parameter is required.",
        },
        { status: 400 },
      );
    }

    /*
     * Validate pageSize if supplied.
     *
     * Google allows 1–100.
     */
    let pageSize: number | undefined;

    if (pageSizeParam) {
      const parsed =
        Number(pageSizeParam);

      if (
        !Number.isInteger(parsed) ||
        parsed < 1 ||
        parsed > 100
      ) {
        return Response.json(
          {
            success: false,
            error:
              "pageSize must be an integer between 1 and 100.",
          },
          { status: 400 },
        );
      }

      pageSize = parsed;
    }

    /*
     * Retrieve the encrypted Google Photos
     * refresh token from Neon.
     */
    const rows = (await sql`
      SELECT
        id,
        refresh_token,
        scope,
        token_type
      FROM google_photos_connections
      WHERE id = 1
      LIMIT 1
    `) as {
      id: number;
      refresh_token: string;
      scope: string | null;
      token_type: string | null;
    }[];

    if (rows.length === 0) {
      return Response.json(
        {
          success: false,
          error:
            "Google Photos is not connected. Authorize Google Photos first.",
        },
        { status: 400 },
      );
    }

    /*
     * Decrypt the refresh token.
     *
     * This happens only on the server.
     */
    const refreshToken =
      decryptGoogleToken(
        rows[0].refresh_token,
      );

    /*
     * Read Google OAuth credentials.
     */
    const clientId =
      process.env.GOOGLE_PHOTOS_CLIENT_ID;

    const clientSecret =
      process.env.GOOGLE_PHOTOS_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return Response.json(
        {
          success: false,
          error:
            "Google Photos OAuth credentials are not configured.",
        },
        { status: 500 },
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

    /*
     * Google rejected the refresh-token request.
     */
    if (
      !tokenResponse.ok ||
      !tokenData.access_token
    ) {
      console.error("Google access-token refresh failed", { status: tokenResponse.status });

      return Response.json(
        {
          success: false,
          error:
            "Could not refresh the Google Photos access token.",
        },
        { status: 502 },
      );
    }

    /*
     * Build Google's mediaItems.list URL.
     *
     * IMPORTANT:
     *
     * The Picker API uses:
     *
     * GET /v1/mediaItems
     *
     * with sessionId as a query parameter.
     */
    const googleUrl =
      new URL(
        GOOGLE_PICKER_MEDIA_ITEMS_URL,
      );

    googleUrl.searchParams.set(
      "sessionId",
      sessionId,
    );

    if (pageSize !== undefined) {
      googleUrl.searchParams.set(
        "pageSize",
        String(pageSize),
      );
    }

    if (pageToken) {
      googleUrl.searchParams.set(
        "pageToken",
        pageToken,
      );
    }

    /*
     * Request the selected media items from
     * Google Photos Picker.
     */
    const mediaResponse =
      await fetch(
        googleUrl.toString(),
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },

          cache: "no-store",
        },
      );

    const mediaData =
      (await mediaResponse.json()) as GooglePickerMediaItemsResponse;

    /*
     * Google returned an error.
     */
    if (!mediaResponse.ok) {
      console.error("Google Photos Picker mediaItems.list failed", { status: mediaResponse.status });

      /*
       * 400-level Google errors are forwarded
       * where reasonable.
       */
      const status =
        mediaResponse.status >= 400 &&
        mediaResponse.status < 500
          ? mediaResponse.status
          : 502;

      return Response.json(
        {
          success: false,
          error:
            "Could not retrieve selected Google Photos media items.",
        },
        { status },
      );
    }

    /*
     * Normalize the media items before returning
     * them to the frontend.
     *
     * We intentionally expose only the fields
     * needed by the application.
     */
    const mediaItems =
      (mediaData.mediaItems || []).map(
        (item) => ({
          id: item.id ?? null,

          createTime:
            item.createTime ?? null,

          type:
            item.type ?? null,

          fileName:
            item.mediaFile?.fileName ?? null,

          mimeType:
            item.mediaFile?.mimeType ?? null,

          width:
            item.mediaFile
              ?.mediaFileMetadata
              ?.width ?? null,

          height:
            item.mediaFile
              ?.mediaFileMetadata
              ?.height ?? null,

          baseUrl:
            item.mediaFile?.baseUrl ?? null,
        }),
      );

    /*
     * Return the selected media items.
     *
     * NOTE:
     *
     * Google Picker base URLs are temporary.
     * They should not be treated as permanent
     * storage URLs.
     */
    return Response.json({
      success: true,

      sessionId,

      mediaItems,

      count: mediaItems.length,

      nextPageToken:
        mediaData.nextPageToken ?? null,
    });
  } catch (error) {
    console.error(
      "Google Photos Picker media items request failed:",
      error,
    );

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Google Photos Picker media items request failed.",
      },
      { status: 500 },
    );
  }
}
