import { requireAdminApi } from "@/lib/auth/admin-session";
import { getGooglePhotosAccessToken, googleErrorResponse } from "@/lib/google/photos-access";

export const runtime = "nodejs";
type Context = { params: Promise<{ sessionId: string }> };
export async function GET(request: Request, context: Context) {
  const denied = await requireAdminApi(request); if (denied) return denied;
  try { const { sessionId } = await context.params; if (!sessionId) return Response.json({ success: false, error: "sessionId is required." }, { status: 400 });
    const token = await getGooglePhotosAccessToken(); const response = await fetch(`https://photospicker.googleapis.com/v1/sessions/${encodeURIComponent(sessionId)}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    const data = await response.json(); if (!response.ok) return Response.json({ success: false, error: "Could not retrieve Google Photos Picker session." }, { status: response.status < 500 ? response.status : 502 }); return Response.json({ success: true, session: data });
  } catch (error) { return googleErrorResponse(error, "Google Photos Picker session lookup failed."); }
}
export async function DELETE(request: Request, context: Context) {
  const denied = await requireAdminApi(request, true); if (denied) return denied;
  try { const { sessionId } = await context.params; const token = await getGooglePhotosAccessToken(); const response = await fetch(`https://photospicker.googleapis.com/v1/sessions/${encodeURIComponent(sessionId)}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!response.ok && response.status !== 404) return Response.json({ success: false, error: "Could not close Google Photos Picker session." }, { status: 502 }); return Response.json({ success: true });
  } catch (error) { return googleErrorResponse(error, "Could not close Google Photos Picker session."); }
}
