import { notFound, redirect } from "next/navigation";
import { FolderManager } from "@/components/admin/FolderManager";
import { GooglePhotosImporter } from "@/components/admin/GooglePhotosImporter";
import { isAdmin } from "@/lib/auth/admin-session";
import { getGooglePhotosConnectionStatus } from "@/lib/google/photos-connection";
import { getFolderPhotos, getMediaFolderById, getMediaFolders } from "@/lib/media/library";

export const dynamic = "force-dynamic";

export default async function FolderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await isAdmin())) redirect(`/admin/login?next=${encodeURIComponent(`/admin/folders/${id}`)}`);
  const folder = await getMediaFolderById(id);
  if (!folder) notFound();
  const [photos, connection, availableFolders] = await Promise.all([getFolderPhotos(id), getGooglePhotosConnectionStatus(), getMediaFolders()]);

  return (
    <main className="min-h-screen bg-forest-deep px-5 pb-24 pt-32 text-ivory lg:px-10">
      <div className="mx-auto max-w-[86rem]">
        <FolderManager folder={folder} photos={photos} availableFolders={availableFolders} />
        <GooglePhotosImporter folderId={folder.id} folderName={folder.name} connected={connection.connected} reconnectRequired={connection.reconnectRequired} />
      </div>
    </main>
  );
}
