import { redirect } from "next/navigation";
import { MediaLibraryAdmin } from "@/components/admin/MediaLibraryAdmin";
import { isAdmin } from "@/lib/auth/admin-session";
import { getGooglePhotosConnectionStatus } from "@/lib/google/photos-connection";
import { getMediaFolders } from "@/lib/media/library";

export const dynamic = "force-dynamic";
export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const [folders, connection] = await Promise.all([getMediaFolders(), getGooglePhotosConnectionStatus()]);
  return <MediaLibraryAdmin initialFolders={folders} connection={connection} />;
}
