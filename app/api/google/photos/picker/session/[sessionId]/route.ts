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
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
};

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      sessionId: string;
    }>;
  },
) {
  try {
    const unauthorized = await requireAdminApi(request);
    if (unauthorized) return unauthorized;
    const { sessionId } = await context.params;

    if (!sessionId?.trim()) {
      return Response.json(
        {
          success: false,
          error: "sessionId is required.",
        },
        { status: 400 },
      );
    }

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

    const refreshToken = decryptGoogleToken(
      rows[0].refresh_token,
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

      return Response.json(
        {
          success: false,
          error:
            "Could not refresh the Google Photos access token.",
        },
        { status: 502 },
      );
    }

    const sessionResponse = await fetch(
      `${GOOGLE_PICKER_SESSIONS_URL}/${encodeURIComponent(
        sessionId.trim(),
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
        cache: "no-store",
      },
    );

    const sessionData =
      (await sessionResponse.json()) as GooglePickerSessionResponse;

    if (!sessionResponse.ok) {
      console.error("Google Photos Picker session lookup failed", { status: sessionResponse.status });

      return Response.json(
        {
          success: false,
          error:
            sessionData.error?.message ||
            "Could not retrieve Google Photos Picker session.",
        },
        {
          status:
            sessionResponse.status >= 400 &&
            sessionResponse.status < 500
              ? sessionResponse.status
              : 502,
        },
      );
    }

    return Response.json({
      success: true,
      session: {
        id: sessionData.id ?? sessionId,
        pickerUri:
          sessionData.pickerUri ?? null,
        mediaItemsSet:
          sessionData.mediaItemsSet ?? false,
        expireTime:
          sessionData.expireTime ?? null,
        pollingConfig:
          sessionData.pollingConfig ?? null,
        pickingConfig:
          sessionData.pickingConfig ?? null,
      },
    });
  } catch (error) {
    console.error(
      "Google Photos Picker session status failed:",
      error,
    );

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Google Photos Picker session status failed.",
      },
      { status: 500 },
    );
  }
}
