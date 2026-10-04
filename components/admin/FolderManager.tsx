"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowLeft, CheckSquare, Eye, EyeOff, ImagePlus, Images, Square, Star, Trash2, X } from "lucide-react";
import type { MediaFolder, MediaPhoto } from "@/lib/media/library";

export function FolderManager({ folder, photos: initial, availableFolders }: { folder: MediaFolder; photos: MediaPhoto[]; availableFolders: MediaFolder[] }) {
  const router = useRouter();
  const [photos, setPhotos] = useState(initial);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [moveDestination, setMoveDestination] = useState("");

  async function mutate(body: object) {
    setError("");
    const response = await fetch(`/api/admin/folders/${folder.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!response.ok) {
      const data = await response.json() as { error?: string };
      setError(data.error ?? "Unable to update project.");
      return false;
    }
    router.refresh();
    return true;
  }

  function togglePhoto(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected(selected.size === photos.length ? new Set() : new Set(photos.map((photo) => photo.id)));
  }

  async function removePhotos(ids: string[]) {
    if (!ids.length) return;
    const label = ids.length === 1 ? "this photograph" : `${ids.length} photographs`;
    if (!window.confirm(`Delete ${label} from "${folder.name}"? They are removed from this website only; Google Photos is not changed.`)) return;
    setBusy(true); setError("");
    const removed: string[] = [];
    try {
      for (const id of ids) {
        const response = await fetch(`/api/admin/folders/${folder.id}/photos/${id}`, { method: "DELETE" });
        if (!response.ok) {
          const data = await response.json() as { error?: string };
          throw new Error(data.error ?? "Unable to delete one of the photographs.");
        }
        removed.push(id);
      }
      setPhotos((items) => items.filter((photo) => !removed.includes(photo.id)));
      setSelected(new Set());
      router.refresh();
    } catch (reason) {
      if (removed.length) setPhotos((items) => items.filter((photo) => !removed.includes(photo.id)));
      setSelected((current) => new Set([...current].filter((id) => !removed.includes(id))));
      setError(reason instanceof Error ? reason.message : "Unable to delete photographs.");
    } finally { setBusy(false); }
  }

  async function removeFolder() {
    if (!window.confirm(`Delete folder "${folder.name}" and its stored website photographs? Original Google Photos media will not be changed.`)) return;
    setBusy(true);
    const response = await fetch(`/api/admin/folders/${folder.id}`, { method: "DELETE" });
    if (response.ok) router.push("/admin");
    else {
      const data = await response.json() as { error?: string };
      setError(data.error ?? "Unable to delete folder.");
      setBusy(false);
    }
  }

  async function moveSelected() {
    if (!selected.size || !moveDestination) return;
    const destination = availableFolders.find((item) => item.id === moveDestination);
    if (!destination || !window.confirm(`Move ${selected.size} photographs from "${folder.name}" to "${destination.name}"? The media IDs and Cloudinary assets will remain unchanged.`)) return;
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/admin/folders/${folder.id}/photos`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoIds: [...selected], destinationProjectId: moveDestination }),
      });
      const data = await response.json() as { moved?: number; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Unable to move photographs.");
      setPhotos((items) => items.filter((photo) => !selected.has(photo.id)));
      setSelected(new Set()); setMoveDestination(""); router.refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to move photographs."); }
    finally { setBusy(false); }
  }

  function saveDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    void mutate({ name: data.get("name"), description: data.get("description"), category: data.get("category"), location: data.get("location") });
  }

  return (
    <>
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-soft"><ArrowLeft size={16} /> All projects</Link>
      <header className="mt-7 border-b border-gold/20 pb-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{folder.is_public ? "Public project" : "Private project"}</p>
            <h1 className="display-lg mt-3 text-ivory">{folder.name}</h1>
            {folder.description && <p className="mt-3 max-w-2xl text-sm leading-6 text-ivory/60">{folder.description}</p>}
            <p className="mt-3 text-sm text-ivory/50">{[folder.category, folder.location, `${photos.length} photographs`].filter(Boolean).join(" · ")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#google-photos-import" className="inline-flex items-center gap-2 bg-gold px-5 py-3 text-sm font-semibold text-forest-deep"><ImagePlus size={17} /> Import from Google Photos</a>
            <button disabled={busy} onClick={() => void mutate({ isPublic: !folder.is_public })} className="inline-flex items-center gap-2 border border-ivory/20 px-5 py-3 text-sm font-semibold text-ivory hover:border-gold disabled:opacity-50">{folder.is_public ? <EyeOff size={16} /> : <Eye size={16} />}{folder.is_public ? "Unpublish" : "Publish"}</button>
            <button disabled={busy} onClick={() => void removeFolder()} className="inline-flex items-center gap-2 border border-red-300/30 px-5 py-3 text-sm font-semibold text-red-200 hover:bg-red-950/30 disabled:opacity-50"><Trash2 size={16} /> Delete folder</button>
          </div>
        </div>
      </header>

      <details className="mt-6 border border-ivory/10 bg-black/10 p-5">
        <summary className="cursor-pointer text-sm font-semibold text-ivory">Edit project details</summary>
        <form className="mt-5 max-w-2xl" onSubmit={saveDetails}>
          <label className="block text-sm font-semibold">Name *<input name="name" defaultValue={folder.name} required maxLength={120} className="mt-2 w-full border border-gold/25 bg-black/20 px-4 py-3 font-normal text-ivory" /></label>
          <label className="mt-4 block text-sm font-semibold">Description<textarea name="description" defaultValue={folder.description ?? ""} maxLength={2000} rows={3} className="mt-2 w-full border border-gold/25 bg-black/20 px-4 py-3 font-normal text-ivory" /></label>
          <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Category<input name="category" defaultValue={folder.category} maxLength={120} className="mt-2 w-full border border-gold/25 bg-black/20 px-4 py-3 font-normal text-ivory" /></label><label className="block text-sm font-semibold">Location<input name="location" defaultValue={folder.location} maxLength={200} className="mt-2 w-full border border-gold/25 bg-black/20 px-4 py-3 font-normal text-ivory" /></label></div>
          <button className="mt-4 bg-gold px-5 py-3 text-sm font-semibold text-forest-deep">Save changes</button>
        </form>
      </details>

      {error && <p role="alert" className="mt-5 border border-red-300/30 bg-red-950/30 p-4 text-sm text-red-100">{error}</p>}

      <section className="mt-10" aria-labelledby="photos-heading">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gold/20 pb-4">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Archive</p><h2 id="photos-heading" className="mt-2 font-display text-3xl text-ivory">Photographs</h2></div>
          {!!photos.length && <div className="flex items-center gap-4"><span className="text-sm text-ivory/50">{selected.size ? `${selected.size} selected` : `${photos.length} photos`}</span><button type="button" onClick={toggleAll} className="inline-flex items-center gap-2 text-sm font-semibold text-ivory hover:text-gold">{selected.size === photos.length ? <CheckSquare size={17} /> : <Square size={17} />}{selected.size === photos.length ? "Clear selection" : "Select all"}</button></div>}
        </div>

        {!photos.length ? (
          <div className="mt-6 border border-dashed border-gold/30 py-14 text-center"><Images className="mx-auto text-gold" size={34} /><p className="mt-4 font-display text-2xl text-ivory">No photographs yet</p><p className="mt-2 text-sm text-ivory/50">Use Google Photos below to add photographs to this project.</p><a href="#google-photos-import" className="mt-5 inline-flex bg-gold px-5 py-3 text-sm font-semibold text-forest-deep">Import photographs</a></div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {photos.map((photo) => {
              const isSelected = selected.has(photo.id);
              return <article key={photo.id} className={`group relative overflow-hidden border-2 bg-black/20 ${isSelected ? "border-gold shadow-[0_0_24px_rgba(184,153,63,.25)]" : "border-transparent"}`}>
                <button type="button" onClick={() => togglePhoto(photo.id)} aria-pressed={isSelected} aria-label={`${isSelected ? "Deselect" : "Select"} ${photo.alt}`} className="relative block aspect-square w-full">
                  {photo.resource_type === "video" ? <video src={photo.cloudinary_url} muted preload="metadata" playsInline aria-hidden="true" className="h-full w-full object-cover" /> : <Image src={photo.thumbnail_url} alt={photo.alt} fill sizes="(min-width:1280px) 18vw, (min-width:768px) 24vw, 48vw" className="object-cover" />}
                  <span className={`absolute left-2 top-2 grid h-6 w-6 place-items-center border ${isSelected ? "border-gold bg-gold text-forest-deep" : "border-white/70 bg-black/35 text-transparent"}`}><CheckSquare size={15} /></span>
                </button>
                <div className="p-3"><p className="truncate text-xs font-semibold text-ivory">{photo.original_filename}</p><p className="mt-1 text-[0.68rem] uppercase tracking-wide text-ivory/45">{photo.source} · {new Date(photo.created_at).toLocaleDateString()}</p><div className="mt-3 flex justify-between gap-2">{photo.resource_type !== "video" && <button onClick={() => void mutate({ coverPhotoId: photo.id })} className="inline-flex items-center gap-1 text-xs font-semibold text-gold hover:text-gold-soft"><Star size={13} /> Cover</button>}<button onClick={() => void removePhotos([photo.id])} className="text-xs font-semibold text-red-200 hover:text-red-100">Delete</button></div></div>
              </article>;
            })}
          </div>
        )}
      </section>

      {!!selected.size && <div className="sticky bottom-4 z-20 mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-between gap-4 border border-gold/40 bg-forest px-5 py-4 shadow-2xl" role="region" aria-label="Selected photograph actions"><div><p className="font-semibold text-ivory">{selected.size} selected</p><p className="text-xs text-ivory/50">Move preserves media IDs and does not affect Google Photos.</p></div><div className="flex flex-1 flex-wrap justify-end gap-2"><select value={moveDestination} onChange={(event) => setMoveDestination(event.target.value)} aria-label="Move selected photographs to project" className="min-w-40 border border-ivory/20 bg-forest-deep px-3 py-2 text-sm text-ivory"><option value="">Move to project…</option>{availableFolders.filter((item) => item.id !== folder.id).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><button type="button" disabled={busy || !moveDestination} onClick={() => void moveSelected()} className="bg-gold px-4 py-2 text-sm font-semibold text-forest-deep disabled:opacity-50">Move</button><button type="button" onClick={() => setSelected(new Set())} className="inline-flex items-center gap-2 border border-ivory/20 px-4 py-2 text-sm text-ivory"><X size={15} /> Clear</button><button type="button" disabled={busy} onClick={() => void removePhotos([...selected])} className="inline-flex items-center gap-2 bg-red-800 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"><Trash2 size={15} /> Delete</button></div></div>}
    </>
  );
}
