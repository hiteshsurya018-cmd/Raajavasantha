import "server-only";

import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { requireAdminApi } from "@/lib/auth/admin-session";

export const runtime = "nodejs";

const GOOGLE_AUTH_URL =
  "https://accounts.google.com/o/oauth2/v2/auth";

const GOOGLE_PHOTOS_SCOPE =
  "https://www.googleapis.com/auth/photospicker.mediaitems.readonly";

export async function GET(request: Request) {
  try {
    const unauthorized = await requireAdminApi(request);
    if (unauthorized) return unauthorized;
    const clientId =
      process.env.GOOGLE_PHOTOS_CLIENT_ID;

    const redirectUri =
      process.env.GOOGLE_PHOTOS_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      return Response.json(
        {
          success: false,
          error:
            "Google Photos OAuth is not configured.",
        },
        { status: 500 },
      );
    }

    const state = randomBytes(32).toString("hex");
    const returnTo = new URL(request.url).searchParams.get("returnTo") ?? "/admin";
    const safeReturnTo = returnTo === "/admin" || returnTo.startsWith("/admin/")
      ? returnTo
      : "/admin";

    const cookieStore = await cookies();

    cookieStore.set({
      name: "google_photos_oauth_state",
      value: state,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 600,
    });
    cookieStore.set({
      name: "google_photos_oauth_return",
      value: safeReturnTo,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 600,
    });

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: GOOGLE_PHOTOS_SCOPE,
      access_type: "offline",
      prompt: "consent",
      state,
    });

    return Response.redirect(
      `${GOOGLE_AUTH_URL}?${params.toString()}`,
    );
  } catch (error) {
    console.error(
      "Google Photos OAuth start failed:",
      error,
    );

    return Response.json(
      {
        success: false,
        error:
          "Unable to start Google Photos authorization.",
      },
      { status: 500 },
    );
  }
}
