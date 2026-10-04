import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";
import { requireAdminApi } from "@/lib/auth/admin-session";

export async function GET(request: Request) {
  try {
    const unauthorized = await requireAdminApi(request);
    if (unauthorized) return unauthorized;
    const result = await cloudinary.api.ping();

    return NextResponse.json({
      connected: true,
      status: result.status,
    });
  } catch {
    console.error("Cloudinary health check failed");

    return NextResponse.json(
      {
        connected: false,
        error: "Cloudinary connection failed.",
      },
      { status: 500 },
    );
  }
}
