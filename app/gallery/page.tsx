import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublicMediaFolders } from "@/lib/media/library";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Gallery", description: "Moments from our work, community programmes and field initiatives.", alternates: { canonical: "/gallery" } };
export default async function GalleryPage() {
  const folders = await getPublicMediaFolders();
  return <section className="min-h-screen bg-ivory px-5 pt-36 pb-24 lg:px-10"><div className="mx-auto max-w-[76rem]"><p className="eyebrow">Our archive</p><h1 className="display-lg mt-6 text-forest-deep">Gallery</h1><p className="mt-5 max-w-2xl text-lg text-muted-foreground">Moments from our work, community programmes and field initiatives.</p>
    {!folders.length ? <p className="mt-16 border-y border-forest-deep/15 py-14 font-display text-2xl text-forest-deep">Photographs will appear here as our public archive grows.</p>
    : <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">{folders.map((folder) => <Link key={folder.id} href={`/gallery/${folder.slug}`} className="group"><div className="relative aspect-[4/3] overflow-hidden bg-forest-deep/5">{folder.cover_url && <Image src={folder.cover_url} alt={folder.cover_alt ?? `${folder.name} gallery`} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" />}</div><div className="border-b border-forest-deep/20 py-5"><h2 className="font-display text-3xl text-forest-deep">{folder.name}</h2>{folder.description && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{folder.description}</p>}<p className="mt-4 text-sm font-semibold">{folder.photo_count} photographs · View gallery →</p></div></Link>)}</div>}
  </div></section>;
}
