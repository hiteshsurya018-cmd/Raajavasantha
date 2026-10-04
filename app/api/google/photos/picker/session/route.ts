import { requireAdminApi } from "@/lib/auth/admin-session";
import { getGooglePhotosAccessToken, googleErrorResponse } from "@/lib/google/photos-access";

export const runtime = "nodejs";
export async function POST(request: Request) {
  const denied = await requireAdminApi(request, true); if (denied) return denied;
  try {
    const token = await getGooglePhotosAccessToken();
    const response = await fetch("https://photospicker.googleapis.com/v1/sessions", { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: "{}", cache: "no-store" });
    const data = await response.json() as { id?: string; pickerUri?: string; expireTime?: string; mediaItemsSet?: boolean; pollingConfig?: { pollInterval?: string; timeoutIn?: string } };
    if (!response.ok || !data.id || !data.pickerUri) { console.error("Google Picker session creation failed", { status: response.status }); return Response.json({ success: false, error: "Google Photos Picker session could not be created." }, { status: 502 }); }
    return Response.json({ success: true, session: { ...data, pickerUri: `${data.pickerUri.replace(/\/$/, "")}/autoclose` } });
  } catch (error) { return googleErrorResponse(error, "Google Photos Picker session could not be created."); }
}
