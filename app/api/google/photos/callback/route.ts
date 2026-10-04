import "server-only";

import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

import { sql } from "@/lib/db";
import { encryptGoogleToken } from "@/lib/google/photos-token";
import { requireAdminApi } from "@/lib/auth/admin-session";

export const runtime = "nodejs";

const GOOGLE_TOKEN_URL =
  "https://oauth2.googleapis.com/token";

export async function GET(request: Request) {
  try {
    const unauthorized = await requireAdminApi(request);
    if (unauthorized) return unauthorized;
    const url = new URL(request.url);

    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    /*
     * Validate the OAuth state stored in the
     * HttpOnly cookie by /api/google/photos/auth.
     */
    const cookieStore = await cookies();

    const storedState = cookieStore.get(
      "google_photos_oauth_state",
    )?.value;

    const suppliedState = Buffer.from(state ?? "");
    const expectedState = Buffer.from(storedState ?? "");
    const validState = suppliedState.length > 0 &&
      suppliedState.length === expectedState.length &&
      timingSafeEqual(suppliedState, expectedState);

    if (!validState) {
      return Response.json(
        {
          success: false,
          error: "Invalid OAuth state.",
        },
        { status: 400 },
      );
    }

    // Consume a valid state before any provider or database work, so it is
    // single-use even if later processing fails.
    cookieStore.delete("google_photos_oauth_state");
    const returnTo = cookieStore.get("google_photos_oauth_return")?.value ?? "/admin";
    cookieStore.delete("google_photos_oauth_return");

    if (error) {
      const redirect = new URL(returnTo, request.url);
      redirect.searchParams.set("google", "error");
      return Response.redirect(redirect);
    }

    if (!code) {
      return Response.json(
        { success: false, error: "Missing Google OAuth code." },
        { status: 400 },
      );
    }

    /*
     * Read Google OAuth configuration.
     */
    const clientId =
      process.env.GOOGLE_PHOTOS_CLIENT_ID;

    const clientSecret =
      process.env.GOOGLE_PHOTOS_CLIENT_SECRET;

    const redirectUri =
      process.env.GOOGLE_PHOTOS_REDIRECT_URI;

    if (
      !clientId ||
      !clientSecret ||
      !redirectUri
    ) {
      return Response.json(
        {
          success: false,
          error:
            "Google Photos OAuth is not configured.",
        },
        { status: 500 },
      );
    }

    /*
     * Exchange the authorization code for
     * Google access + refresh tokens.
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
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
        cache: "no-store",
      },
    );

    const tokenData = await tokenResponse.json();

    /*
     * Google rejected the token exchange.
     */
    if (!tokenResponse.ok) {
      console.error("Google token exchange failed", { status: tokenResponse.status });

      return Response.json(
        {
          success: false,
          error:
            "Google authorization could not be completed.",
        },
        { status: 502 },
      );
    }

    /*
     * We need the refresh token because the application
     * must be able to access Google Photos after the
     * original access token expires.
     */
    const refreshToken =
      typeof tokenData.refresh_token === "string"
        ? tokenData.refresh_token
        : null;

    if (!refreshToken) {
      return Response.json(
        {
          success: false,
          error:
            "Google did not return a refresh token. Re-authorize with consent to obtain one.",
        },
        { status: 502 },
      );
    }

    /*
     * Encrypt the refresh token before storing it.
     *
     * The plaintext Google refresh token is never
     * written to the database.
     */
    const encryptedRefreshToken =
      encryptGoogleToken(refreshToken);

    /*
     * Store the encrypted Google Photos connection.
     *
     * This project currently uses one Google Photos
     * connection for the Rajavasantha media system.
     */
    await sql`
      INSERT INTO google_photos_connections (
        id,
        refresh_token,
        scope,
        token_type,
        created_at,
        updated_at
      )
      VALUES (
        1,
        ${encryptedRefreshToken},
        ${
          typeof tokenData.scope === "string"
            ? tokenData.scope
            : null
        },
        ${
          typeof tokenData.token_type === "string"
            ? tokenData.token_type
            : null
        },
        NOW(),
        NOW()
      )
      ON CONFLICT (id)
      DO UPDATE SET
        refresh_token = EXCLUDED.refresh_token,
        scope = EXCLUDED.scope,
        token_type = EXCLUDED.token_type,
        updated_at = NOW()
    `;

    /*
     * Never return either the access token or
     * refresh token to the browser.
     */
    const redirect = new URL(returnTo, request.url);
    redirect.searchParams.set("google", "connected");
    return Response.redirect(redirect);
  } catch (error) {
    console.error(
      "Google Photos OAuth callback failed:",
      error,
    );

    return Response.json(
      {
        success: false,
        error:
          "Google Photos authorization failed.",
      },
      { status: 500 },
    );
  }
}
