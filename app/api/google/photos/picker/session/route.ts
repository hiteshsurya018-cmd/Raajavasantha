import "server-only";

import { sql } from "@/lib/db";
import { decryptGoogleToken } from "@/lib/google/photos-token";
import { requireAdminApi } from "@/lib/auth/admin-session";

export const runtime = "nodejs";

const GOOGLE_TOKEN_URL =
  "https://oauth2.googleapis.com/token";

const GOOGLE_PICKER_SESSIONS_URL =
  "https://photospicker.googleapis.com/v1/sessions";

const GOOGLE_PHOTOS_SCOPE =
  "https://www.googleapis.com/auth/photospicker.mediaitems.readonly";

type GoogleTokenResponse = {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
};

type GooglePickerSessionResponse = {
  id?: string;
  pickerUri?: string;
  pollingConfig?: {
    pollInterval?: string;
    timeoutIn?: string;
  };
  expireTime?: string;
  pickingConfig?: {
    maxItemCount?: string;
  };
  mediaItemsSet?: boolean;
};

export async function POST(request: Request) {
  try {
    const unauthorized = await requireAdminApi(request, true);
    if (unauthorized) return unauthorized;
    /*
     * The request body is optional.
     *
     * We currently allow the caller to specify the
     * maximum number of photos that can be selected.
     */
    let maxItemCount = 100;

    try {
      const body = await request.json();

      if (
        body &&
        typeof body.maxItemCount === "number" &&
        Number.isFinite(body.maxItemCount)
      ) {
        maxItemCount = Math.min(
          Math.max(Math.floor(body.maxItemCount), 1),
          100,
        );
      }
    } catch {
      /*
       * Empty request body is allowed.
       */
    }

    /*
     * Retrieve the single Rajavasantha Google Photos
     * connection from Neon.
     */
    const rows = (await sql`
      SELECT
        id,
        refresh_token,
        scope,
        token_type,
        created_at,
        updated_at
      FROM google_photos_connections
      WHERE id = 1
      LIMIT 1
    `) as {
      id: number;
      refresh_token: string;
      scope: string | null;
      token_type: string | null;
      created_at: string;
      updated_at: string;
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

    const connection = rows[0];

    /*
     * Decrypt the refresh token.
     *
     * The plaintext token only exists in memory while
     * communicating with Google's OAuth endpoint.
     */
    const refreshToken = decryptGoogleToken(
      connection.refresh_token,
    );

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
     * short-lived access token.
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

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Google access-token refresh failed", { status: tokenResponse.status });

      return Response.json(
        {
          success: false,
          error:
            "Could not obtain a Google Photos access token. Re-authorize Google Photos.",
        },
        { status: 502 },
      );
    }

    /*
     * Create a new Google Photos Picker session.
     *
     * Google recommends creating a fresh session whenever
     * the user wants to make a new selection.
     */
    const pickerResponse = await fetch(
      GOOGLE_PICKER_SESSIONS_URL,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pickingConfig: {
            maxItemCount: maxItemCount.toString(),
          },
        }),
        cache: "no-store",
      },
    );

    const pickerData =
      (await pickerResponse.json()) as GooglePickerSessionResponse & {
        error?: {
          code?: number;
          message?: string;
          status?: string;
        };
      };

    if (
      !pickerResponse.ok ||
      !pickerData.id ||
      !pickerData.pickerUri
    ) {
      console.error("Google Photos Picker session creation failed", { status: pickerResponse.status });

      return Response.json(
        {
          success: false,
          error:
            "Google Photos Picker session could not be created.",
        },
        { status: 502 },
      );
    }

    /*
     * The pickerUri cannot be embedded in an iframe.
     *
     * For a web application we append /autoclose so the
     * Google Photos tab/window closes after selection.
     */
    const pickerUri =
      pickerData.pickerUri.endsWith("/")
        ? `${pickerData.pickerUri}autoclose`
        : `${pickerData.pickerUri}/autoclose`;

    return Response.json({
      success: true,
      session: {
        id: pickerData.id,
        pickerUri,
        expireTime:
          pickerData.expireTime ?? null,
        pollingConfig:
          pickerData.pollingConfig ?? null,
        mediaItemsSet:
          pickerData.mediaItemsSet ?? false,
      },
    });
  } catch (error) {
    console.error(
      "Google Photos Picker session creation failed:",
      error,
    );

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Google Photos Picker session creation failed.",
      },
      { status: 500 },
    );
  }
}
