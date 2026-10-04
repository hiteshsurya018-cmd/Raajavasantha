"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { CheckCircle2, EllipsisVertical, Eye, EyeOff, FolderOpen, ImagePlus, Plus, Star, Trash2 } from "lucide-react";
import type { MediaFolder } from "@/lib/media/library";

type Connection = { connected: boolean; reconnectRequired?: boolean };
type GoogleItem = { id: string | null; fileName: string | null; baseUrl: string | null };
type Polling = { pollInterval?: string; timeoutIn?: string };
type DuplicateDetail = { filename: string; reason?: string; existingProjectId?: string; existingProjectName?: string };
type ImportResult = { imported: number; alreadyImported: DuplicateDetail[]; failed: string[] };
type ImportResponse = { duplicate: boolean; duplicateReason?: string; existingProjectId?: string; existingProjectName?: string };

async function read<T>(response: Response): Promise<T> {
  const data = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(data.error ?? "Request failed.");
  return data;
}
function duration(value?: string, fallback = 2000) {
  const match = value?.match(/^([0-9]+(?:\.[0-9]+)?)s$/);
  return match ? Number(match[1]) * 1000 : fallback;
}

export function MediaLibraryAdmin({ initialFolders, connection }: { initialFolders: MediaFolder[]; connection: Connection }) {
  const [folders, setFolders] = useState(initialFolders);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState("");
  const [googleItems, setGoogleItems] = useState<GoogleItem[]>([]);
  const [pickerSessionId, setPickerSessionId] = useState("");
  const [pickerUri, setPickerUri] = useState("");
  const [pickerBusy, setPickerBusy] = useState(false);
  const [destinationId, setDestinationId] = useState("");
  const [dragOverId, setDragOverId] = useState("");
  const [importProgress, setImportProgress] = useState({ done: 0, total: 0 });
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activePickerSession = useRef("");
  const preparingPicker = useRef(false);
  const pickerRecoveryAttempted = useRef(false);
  const preparePickerRef = useRef<(force?: boolean) => void>(() => undefined);
  const googleItemsRef = useRef<GoogleItem[]>([]);
  const createDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => () => { if (pollTimer.current) clearTimeout(pollTimer.current); }, []);
  useEffect(() => { googleItemsRef.current = googleItems; }, [googleItems]);
  useEffect(() => {
    if (connection.connected && !pickerUri && !googleItems.length) preparePickerRef.current();
  }, [connection.connected, googleItems.length, pickerUri]);

  async function createFolder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        description: form.get("description"),
        category: form.get("category"),
        location: form.get("location"),
        isPublic: form.get("isPublic") === "on",
      }),
    });
    const data = await response.json() as { folder?: MediaFolder; error?: string };
    if (!response.ok || !data.folder) {
      setError(data.error ?? "Unable to create folder.");
      return;
    }
    setFolders((items) => [data.folder!, ...items]);
    setDestinationId(data.folder.id);
    createDialog.current?.close();
    event.currentTarget.reset();
  }

  function pickerFailure(reason: unknown) {
    setError(reason instanceof Error ? reason.message : "Google Photos selection failed.");
  }

  function pickerPollFailure(id: string, reason: unknown) {
    if (activePickerSession.current !== id) return;
    if (!googleItemsRef.current.length && !pickerRecoveryAttempted.current) {
      pickerRecoveryAttempted.current = true;
      setError("Refreshing the Google Photos Picker session…");
      void preparePicker(true);
      return;
    }
    pickerFailure(reason);
  }

  async function pollPicker(id: string, config: Polling, deadline: number) {
    if (activePickerSession.current !== id) return;
    if (Date.now() > deadline) {
      if (!googleItemsRef.current.length) void preparePicker(true);
      return;
    }
    const data = await read<{ session: { mediaItemsSet?: boolean; pollingConfig?: Polling } }>(await fetch(`/api/google/photos/picker/session/${encodeURIComponent(id)}`, { cache: "no-store" }));
    if (activePickerSession.current !== id) return;
    pickerRecoveryAttempted.current = false;
    const polling = data.session.pollingConfig ?? config;
    if (!data.session.mediaItemsSet) {
      pollTimer.current = setTimeout(() => void pollPicker(id, polling, deadline).catch((reason) => pickerPollFailure(id, reason)), duration(polling.pollInterval));
      return;
    }
    const selected: GoogleItem[] = [];
    let pageToken: string | null = null;
    do {
      const query = new URLSearchParams({ sessionId: id, pageSize: "100" });
      if (pageToken) query.set("pageToken", pageToken);
      const page = await read<{ mediaItems: GoogleItem[]; nextPageToken: string | null }>(await fetch(`/api/google/photos/picker/media-items?${query}`, { cache: "no-store" }));
      selected.push(...page.mediaItems.filter((item) => item.id && item.baseUrl));
      pageToken = page.nextPageToken;
    } while (pageToken);
    googleItemsRef.current = selected;
    setGoogleItems(selected);
    if (!selected.length) setError("No photographs were selected.");
  }

  async function preparePicker(force = false) {
    if (!connection.connected || preparingPicker.current) return;
    if (!force && activePickerSession.current && pickerUri) return;
    preparingPicker.current = true;
    setError("");
    try {
      if (pollTimer.current) clearTimeout(pollTimer.current);
      const previousId = activePickerSession.current;
      activePickerSession.current = "";
      if (force && previousId) void fetch(`/api/google/photos/picker/session/${encodeURIComponent(previousId)}`, { method: "DELETE" });
      const data = await read<{ session: { id: string; pickerUri: string; expireTime?: string; pollingConfig?: Polling } }>(await fetch("/api/google/photos/picker/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }));
      activePickerSession.current = data.session.id;
      setPickerSessionId(data.session.id);
      setPickerUri(data.session.pickerUri);
      const polling = data.session.pollingConfig ?? {};
      const timeoutDeadline = Date.now() + duration(polling.timeoutIn, 10 * 60 * 1000);
      const parsedExpiry = data.session.expireTime ? Date.parse(data.session.expireTime) - 1000 : Number.NaN;
      const expiryDeadline = Number.isFinite(parsedExpiry) ? parsedExpiry : timeoutDeadline;
      void pollPicker(data.session.id, polling, Math.min(timeoutDeadline, expiryDeadline)).catch((reason) => pickerPollFailure(data.session.id, reason));
    } catch (reason) { pickerFailure(reason); }
    finally { preparingPicker.current = false; }
  }
  preparePickerRef.current = preparePicker;

  function openPicker() {
    if (!connection.connected) {
      window.location.assign(`/api/google/photos/auth?returnTo=${encodeURIComponent("/admin")}`);
      return;
    }
    if (!pickerUri) {
      void preparePicker();
      return;
    }
    setError("");
    setImportResult(null);
    const popup = window.open(pickerUri, "google-photos-picker", "popup,width=1100,height=760");
    if (!popup) setError("Allow pop-ups to open the Google Photos Picker.");
  }

  async function importToProject(projectId: string) {
    if (!googleItems.length || !pickerSessionId || pickerBusy) return;
    const project = folders.find((item) => item.id === projectId);
    if (!project) { setError("Choose a valid destination project."); return; }
    setDestinationId(projectId); setPickerBusy(true); setError(""); setImportResult(null);
    setImportProgress({ done: 0, total: googleItems.length });
    const summary: ImportResult = { imported: 0, alreadyImported: [], failed: [] };
    for (const item of googleItems) {
      try {
        const response = await read<ImportResponse>(await fetch("/api/google/photos/picker/import", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folderId: projectId, sessionId: pickerSessionId, mediaItemId: item.id, alt: `${project.name} photograph` }),
        }));
        if (response.duplicate) summary.alreadyImported.push({ filename: item.fileName ?? "Photograph", reason: response.duplicateReason, existingProjectId: response.existingProjectId, existingProjectName: response.existingProjectName });
        else summary.imported += 1;
      } catch (reason) { summary.failed.push(`${item.fileName ?? "Photograph"}: ${reason instanceof Error ? reason.message : "Import failed."}`); }
      setImportProgress((value) => ({ ...value, done: value.done + 1 }));
    }
    void fetch(`/api/google/photos/picker/session/${encodeURIComponent(pickerSessionId)}`, { method: "DELETE" });
    activePickerSession.current = "";
    setPickerSessionId("");
    setPickerUri("");
    setFolders((items) => items.map((item) => item.id === projectId ? { ...item, photo_count: item.photo_count + summary.imported, updated_at: new Date().toISOString() } : item));
    setImportResult(summary); setPickerBusy(false);
    void preparePicker(true);
  }

  function clearGoogleSelection() {
    if (pickerSessionId) void fetch(`/api/google/photos/picker/session/${encodeURIComponent(pickerSessionId)}`, { method: "DELETE" });
    activePickerSession.current = "";
    googleItemsRef.current = [];
    setGoogleItems([]); setPickerSessionId(""); setPickerUri(""); setImportResult(null); setImportProgress({ done: 0, total: 0 });
    void preparePicker(true);
  }

  async function toggleVisibility(folder: MediaFolder) {
    setBusyId(folder.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/folders/${folder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !folder.is_public }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Unable to update project visibility.");
      setFolders((items) => items.map((item) => item.id === folder.id
        ? { ...item, is_public: !item.is_public, updated_at: new Date().toISOString() }
        : item));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to update project visibility.");
    } finally {
      setBusyId("");
    }
  }

  async function toggleFeatured(folder: MediaFolder) {
    setBusyId(folder.id);
    setError("");
    setNotice("");
    try {
      const data = await read<{ folder: MediaFolder }>(await fetch(`/api/admin/folders/${folder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !folder.featured }),
      }));
      setFolders((items) => items.map((item) => item.id === folder.id ? { ...item, featured: data.folder.featured, updated_at: data.folder.updated_at } : item));
      setNotice(`${folder.name} is now ${data.folder.featured ? "featured" : "not featured"}.`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to update featured status.");
    } finally {
      setBusyId("");
    }
  }

  async function deleteFolder(folder: MediaFolder) {
    if (!window.confirm(`Delete folder "${folder.name}"? This removes its website project and stored gallery photographs. Original Google Photos media will not be changed.`)) return;
    setBusyId(folder.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/folders/${folder.id}`, { method: "DELETE" });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Unable to delete folder.");
      setFolders((items) => items.filter((item) => item.id !== folder.id));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to delete folder.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <main className="min-h-screen bg-forest-deep px-5 pb-24 pt-32 text-ivory lg:px-10">
      <div className="mx-auto max-w-[86rem]">
        <header className="border-b border-gold/20 pb-8">
          <p className="eyebrow">Administration</p>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="display-lg text-ivory">Rajavasantha Media Studio</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-ivory/60">
                Select photographs from Google Photos, organise them into existing Rajavasantha projects, and control what appears publicly.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={openPicker} disabled={connection.connected && !pickerUri} className="inline-flex items-center gap-2 bg-gold px-5 py-3 text-sm font-semibold text-forest-deep disabled:opacity-50">
                <ImagePlus size={17} aria-hidden="true" /> Import from Google Photos
              </button>
              <button type="button" onClick={() => createDialog.current?.showModal()} className="inline-flex items-center gap-2 border border-ivory/20 px-5 py-3 text-sm font-semibold text-ivory hover:border-gold">
                <Plus size={17} aria-hidden="true" /> New project
              </button>
            </div>
          </div>
        </header>

        {error && <p role="alert" className="mt-6 border border-red-300/30 bg-red-950/30 p-4 text-sm text-red-100">{error}</p>}
        {notice && <p role="status" className="mt-6 border border-gold/25 bg-gold/10 px-4 py-3 text-sm text-ivory">{notice}</p>}

        {!!googleItems.length && (
          <section className="mt-5 border border-gold/30 bg-black/15 p-4 sm:p-5" aria-label="Selected Google Photos media">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div draggable={!pickerBusy} onDragStart={(event) => { event.dataTransfer.effectAllowed = "copy"; event.dataTransfer.setData("application/x-rajavasantha-google-selection", pickerSessionId); }} className="flex min-w-0 items-center gap-4">
                <div className="flex shrink-0 -space-x-2">
                  {googleItems.slice(0, 4).map((item) => item.baseUrl && <div key={item.id} className="relative h-12 w-12 overflow-hidden border-2 border-forest-deep bg-forest"><Image src={item.baseUrl + "=w160-h160-c"} alt="" fill unoptimized className="object-cover" /></div>)}
                  {googleItems.length > 4 && <span className="grid h-12 w-12 place-items-center border-2 border-forest-deep bg-gold text-xs font-bold text-forest-deep">+{googleItems.length - 4}</span>}
                </div>
                <div><p className="font-semibold text-ivory">{googleItems.length} {googleItems.length === 1 ? "item" : "items"} selected</p><p className="mt-1 text-xs text-ivory/45">Drag this selection onto a project or choose a destination.</p></div>
              </div>
              <div className="flex flex-1 flex-wrap items-end justify-end gap-3">
                <label className="min-w-[12rem] flex-1 text-[0.65rem] font-semibold uppercase tracking-wider text-ivory/45 lg:max-w-xs">Destination<select value={destinationId} onChange={(event) => setDestinationId(event.target.value)} className="mt-1.5 w-full border border-ivory/15 bg-forest-deep px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-ivory"><option value="">Select project…</option>{folders.map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}</select></label>
                <button type="button" disabled={!destinationId || pickerBusy} onClick={() => void importToProject(destinationId)} className="bg-gold px-4 py-2.5 text-sm font-semibold text-forest-deep disabled:opacity-50">{pickerBusy ? "Importing " + importProgress.done + "/" + importProgress.total : "Import " + googleItems.length + " " + (googleItems.length === 1 ? "item" : "items")}</button>
                <button type="button" disabled={pickerBusy} onClick={clearGoogleSelection} className="border border-ivory/20 px-4 py-2.5 text-sm text-ivory disabled:opacity-50">Clear</button>
              </div>
            </div>
            {pickerBusy && <div className="mt-4 h-1 bg-ivory/10"><div className="h-full bg-gold transition-[width]" style={{ width: String(importProgress.total ? importProgress.done / importProgress.total * 100 : 0) + "%" }} /></div>}
            {importResult && <div className="mt-4 border-t border-ivory/10 pt-4 text-sm" aria-live="polite"><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-ivory/65"><span className="font-semibold text-ivory">Import complete:</span> {importResult.imported} imported · {importResult.alreadyImported.length} already imported · {importResult.failed.length} failed</p>{destinationId && <Link href={"/admin/folders/" + destinationId} className="font-semibold text-gold underline">View project</Link>}</div>{importResult.alreadyImported.map((item, index) => <p key={item.filename + index} className="mt-2 text-xs text-gold">{item.filename}: already imported{item.existingProjectName ? " in " + item.existingProjectName : ""}{item.reason === "SAME_FILE" ? " (same file)" : item.reason === "SAME_GOOGLE_ITEM" ? " (same Google Photos item)" : item.reason === "RACE_CONDITION" ? " (another import completed first)" : ""}.</p>)}</div>}
          </section>
        )}

        <section aria-labelledby="library-heading" className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gold/20 pb-4">
            <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Media library</p><h2 id="library-heading" className="mt-2 font-display text-4xl text-ivory">Projects & folders</h2></div>
            <p className="text-sm text-ivory/50">{folders.length} {folders.length === 1 ? "project" : "projects"}</p>
          </div>

          {!folders.length ? (
            <div className="mx-auto mt-12 max-w-xl border border-dashed border-gold/35 px-6 py-14 text-center">
              <FolderOpen className="mx-auto text-gold" size={34} aria-hidden="true" />
              <p className="mt-5 font-display text-3xl">Create your first project</p>
              <p className="mx-auto mt-3 text-sm leading-6 text-ivory/55">Projects organise the photographs and media that appear across the Rajavasantha website.</p>
              <button type="button" onClick={() => createDialog.current?.showModal()} className="mt-6 inline-flex items-center gap-2 bg-gold px-5 py-3 text-sm font-semibold text-forest-deep"><Plus size={16} /> New project</button>
            </div>
          ) : (
            <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {folders.map((folder) => (
                <article key={folder.id}
                  onDragOver={(event) => { if (googleItems.length) { event.preventDefault(); event.dataTransfer.dropEffect = "copy"; setDragOverId(folder.id); } }}
                  onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragOverId(""); }}
                  onDrop={(event) => { event.preventDefault(); setDragOverId(""); if (event.dataTransfer.getData("application/x-rajavasantha-google-selection") === pickerSessionId) void importToProject(folder.id); }}
                  className={"group relative min-w-0 overflow-visible border bg-ivory text-forest-deep shadow-[0_8px_24px_rgba(0,0,0,.07)] transition-all duration-200 " + (dragOverId === folder.id ? "scale-[1.02] border-gold ring-4 ring-gold/25" : "border-ivory/10 hover:-translate-y-0.5 hover:border-gold/70")}>
                  {dragOverId === folder.id && <div className="absolute inset-0 z-30 grid place-items-center bg-forest-deep/92 text-center text-ivory"><div><ImagePlus className="mx-auto text-gold" /><p className="mt-2 font-display text-xl">Drop to import</p></div></div>}
                  <Link href={"/admin/folders/" + folder.id} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#e7e1d0]">
                      {folder.cover_url ? <Image src={folder.cover_url} alt={folder.cover_alt ?? folder.name + " cover"} fill sizes="(min-width:1536px) 18vw, (min-width:1280px) 23vw, (min-width:768px) 31vw, 48vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" /> : <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(145deg,rgba(13,61,45,.04),rgba(184,153,63,.12))]"><div className="text-center"><FolderOpen className="mx-auto text-forest/25" size={36} aria-hidden="true" /><span className="mt-2 block text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-forest/35">Rajavasantha</span></div></div>}
                      <span className={"absolute right-2 top-2 inline-flex items-center gap-1 px-2 py-1 text-[0.58rem] font-bold uppercase tracking-wider " + (folder.is_public ? "bg-forest-deep text-ivory" : "bg-ivory/95 text-forest-deep")}>{folder.is_public ? <Eye size={10} aria-hidden="true" /> : <EyeOff size={10} aria-hidden="true" />}{folder.is_public ? "Public" : "Private"}</span>
                      {folder.featured && <span className="absolute left-2 top-2 inline-flex items-center gap-1 bg-gold px-2 py-1 text-[0.58rem] font-bold uppercase tracking-wider text-forest-deep"><Star size={10} fill="currentColor" aria-hidden="true" /> Featured</span>}
                    </div>
                    <div className="min-w-0 pb-4 pl-3 pr-12 pt-3 sm:pl-4 sm:pt-4">
                      <h3 className="truncate font-display text-xl sm:text-2xl">{folder.name}</h3>
                      <p className="mt-2 text-[0.68rem] text-forest-deep/55">{folder.photo_count} {folder.photo_count === 1 ? "item" : "items"}</p>
                      <p className="mt-1 text-[0.65rem] text-forest-deep/45">Updated {new Date(folder.updated_at).toLocaleDateString()}</p>
                    </div>
                  </Link>
                  <details className="absolute bottom-2 right-2 z-20">
                    <summary aria-label={"More actions for " + folder.name} className="grid h-9 w-9 cursor-pointer list-none place-items-center border border-forest-deep/10 bg-ivory hover:bg-forest-deep hover:text-ivory [&::-webkit-details-marker]:hidden"><EllipsisVertical size={16} /></summary>
                    <div className="absolute bottom-10 right-0 z-40 w-40 border border-gold/25 bg-forest-deep p-1 text-ivory shadow-xl">
                      <button type="button" disabled={busyId === folder.id} onClick={() => void toggleFeatured(folder)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-ivory/10 disabled:opacity-50"><Star size={13} fill={folder.featured ? "currentColor" : "none"} />{folder.featured ? "Unfeature" : "Feature"}</button>
                      <button type="button" disabled={busyId === folder.id} onClick={() => void toggleVisibility(folder)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-ivory/10 disabled:opacity-50">{folder.is_public ? <EyeOff size={13} /> : <Eye size={13} />}{folder.is_public ? "Unpublish" : "Publish"}</button>
                      <button type="button" disabled={busyId === folder.id} onClick={() => void deleteFolder(folder)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-200 hover:bg-red-950/40 disabled:opacity-50"><Trash2 size={13} /> Delete</button>
                    </div>
                  </details>
                </article>
              ))}
            </div>
          )}
        </section>
        <dialog ref={createDialog} className="w-[min(36rem,calc(100%-2rem))] border border-gold/30 bg-forest-deep p-0 text-ivory backdrop:bg-black/70">
          <form onSubmit={createFolder} className="p-7">
            <div className="flex items-start gap-4"><Plus className="mt-1 text-gold" aria-hidden="true" /><div><h2 className="font-display text-3xl">Create project</h2><p className="mt-2 text-sm text-ivory/60">Only the project name is required. Details can be added later.</p></div></div>
            <label className="mt-6 block text-sm font-semibold">Project name *<input name="name" required maxLength={120} className="mt-2 w-full border border-gold/30 bg-black/20 px-4 py-3 font-normal text-ivory" /></label>
            <label className="mt-5 block text-sm font-semibold">Description<textarea name="description" maxLength={2000} rows={3} className="mt-2 w-full border border-gold/30 bg-black/20 px-4 py-3 font-normal text-ivory" /></label>
            <div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold">Category<input name="category" maxLength={120} className="mt-2 w-full border border-gold/30 bg-black/20 px-4 py-3 font-normal text-ivory" /></label><label className="block text-sm font-semibold">Location<input name="location" maxLength={200} className="mt-2 w-full border border-gold/30 bg-black/20 px-4 py-3 font-normal text-ivory" /></label></div>
            <label className="mt-5 flex items-center gap-3 text-sm"><input name="isPublic" type="checkbox" className="accent-gold" /> Publish on the public projects page</label>
            {error && <p role="alert" className="mt-4 text-sm text-red-200">{error}</p>}
            <div className="mt-7 flex flex-wrap gap-3"><button className="inline-flex items-center gap-2 bg-gold px-6 py-3 font-semibold text-forest-deep"><CheckCircle2 size={16} /> Create project</button><button type="button" onClick={() => createDialog.current?.close()} className="border border-ivory/20 px-6 py-3">Cancel</button></div>
          </form>
        </dialog>
      </div>
    </main>
  );
}
