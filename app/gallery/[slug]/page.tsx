import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFolderPhotos, getPublicMediaFolderBySlug } from "@/lib/media/library";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const folder = await getPublicMediaFolderBySlug(slug); if (!folder) return {};
  return { title: folder.name, description: folder.description ?? `${folder.name} photographs from Rajavasantha Welfare Trust.`, alternates: { canonical: `/gallery/${folder.slug}` }, openGraph: folder.cover_url ? { images: [{ url: folder.cover_url, alt: folder.cover_alt ?? folder.name }] } : undefined };
}
export default async function GalleryFolderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const folder = await getPublicMediaFolderBySlug(slug); if (!folder) notFound(); const photos = await getFolderPhotos(folder.id, true); if (!photos.length) notFound();
  return <section className="min-h-screen bg-card px-5 pt-36 pb-24 lg:px-10"><div className="mx-auto max-w-[76rem]"><Link href="/gallery" className="text-sm font-semibold text-forest-soft">← Gallery</Link><p className="eyebrow mt-10">Public archive</p><h1 className="display-lg mt-5 text-forest-deep">{folder.name}</h1>{folder.description && <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">{folder.description}</p>}<p className="mt-4 text-sm">{photos.length} photographs</p>
    <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">{photos.map((photo) => <figure key={photo.id} className="relative mb-4 break-inside-avoid overflow-hidden bg-forest-deep/5" style={{ aspectRatio: photo.width && photo.height ? `${photo.width}/${photo.height}` : "4/3" }}>{photo.resource_type === "video" ? <video controls preload="metadata" playsInline aria-label={photo.alt || `${folder.name} video`} className="h-full w-full object-contain"><source src={photo.cloudinary_url} type={photo.mime_type} /></video> : <Image src={photo.cloudinary_url} alt={photo.alt || `${folder.name} photograph`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />}</figure>)}</div>
  </div></section>;
}
