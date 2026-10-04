"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Eye, EyeOff, FolderOpen, ImagePlus, Images, Plus, Trash2 } from "lucide-react";
import type { MediaFolder } from "@/lib/media/library";

type Connection = { connected: boolean; reconnectRequired?: boolean };
type GoogleItem = { id: string | null; fileName: string | null; baseUrl: string | null };
type Polling = { pollInterval?: string; timeoutIn?: string };
type ImportResult = { imported: number; skipped: number; failed: string[] };

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
  const [busyId, setBusyId] = useState("");
  const [importFolderName, setImportFolderName] = useState("");
  const [creatingImportFolder, setCreatingImportFolder] = useState(false);
  const [sourceView, setSourceView] = useState<"photos" | "albums">("photos");
  const [googleItems, setGoogleItems] = useState<GoogleItem[]>([]);
  const [pickerSessionId, setPickerSessionId] = useState("");
  const [pickerUri, setPickerUri] = useState("");
  const [pickerPreparing, setPickerPreparing] = useState(false);
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
  const importDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => () => { if (pollTimer.current) clearTimeout(pollTimer.current); }, []);
  useEffect(() => { googleItemsRef.current = googleItems; }, [googleItems]);
  useEffect(() => {
    if (connection.connected && sourceView === "photos" && !pickerUri && !googleItems.length) preparePickerRef.current();
  }, [connection.connected, googleItems.length, pickerUri, sourceView]);

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
    setPickerPreparing(false);
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
    setSourceView("photos");
    if (!selected.length) setError("No photographs were selected.");
  }

  async function preparePicker(force = false) {
    if (!connection.connected || preparingPicker.current) return;
    if (!force && activePickerSession.current && pickerUri) return;
    preparingPicker.current = true;
    setPickerPreparing(true);
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
    finally { preparingPicker.current = false; setPickerPreparing(false); }
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
    const summary: ImportResult = { imported: 0, skipped: 0, failed: [] };
    for (const item of googleItems) {
      try {
        const response = await read<{ duplicate: boolean }>(await fetch("/api/google/photos/picker/import", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folderId: projectId, sessionId: pickerSessionId, mediaItemId: item.id, alt: `${project.name} photograph` }),
        }));
        if (response.duplicate) summary.skipped += 1; else summary.imported += 1;
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

  async function createImportFolder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setCreatingImportFolder(true);
    try {
      const response = await fetch("/api/admin/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: importFolderName }),
      });
      const data = await response.json() as { folder?: MediaFolder; error?: string };
      if (!response.ok || !data.folder) throw new Error(data.error ?? "Unable to create the folder.");
      window.location.assign(`/admin/folders/${data.folder.id}#google-photos-import`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to create the folder.");
      setCreatingImportFolder(false);
    }
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
              <button type="button" onClick={() => importDialog.current?.showModal()} className="inline-flex items-center gap-2 bg-gold px-5 py-3 text-sm font-semibold text-forest-deep">
                <ImagePlus size={17} aria-hidden="true" /> Import Google Photos folder
              </button>
              <button type="button" onClick={() => createDialog.current?.showModal()} className="inline-flex items-center gap-2 border border-ivory/20 px-5 py-3 text-sm font-semibold text-ivory hover:border-gold">
                <Plus size={17} aria-hidden="true" /> New project
              </button>
            </div>
          </div>
        </header>

        {error && <p role="alert" className="mt-6 border border-red-300/30 bg-red-950/30 p-4 text-sm text-red-100">{error}</p>}

        <div className="mt-8 grid items-start gap-px border border-gold/25 bg-gold/25 lg:grid-cols-2">
          <aside className="min-w-0 bg-forest/80 lg:sticky lg:top-28" aria-label="Google Photos source workspace">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gold/20 px-5 py-5 sm:px-6">
              <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Source</p><h2 className="mt-2 font-display text-3xl text-ivory">Google Photos workspace</h2></div>
              <span className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${connection.connected ? "text-emerald-300" : "text-ivory/50"}`}><span className={`h-2 w-2 rounded-full ${connection.connected ? "bg-emerald-400" : "bg-ivory/30"}`} />{connection.connected ? "Connected" : "Not connected"}</span>
            </div>

            <div className="grid min-h-[31rem] sm:grid-cols-[8.5rem_minmax(0,1fr)]">
              <nav aria-label="Google Photos sections" className="flex border-b border-gold/20 bg-black/10 p-2 sm:flex-col sm:border-b-0 sm:border-r sm:p-3">
                <p className="hidden px-3 pb-4 pt-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ivory/35 sm:block">Google Photos</p>
                <button type="button" onClick={() => setSourceView("photos")} aria-pressed={sourceView === "photos"} className={`flex-1 px-3 py-3 text-left text-sm font-semibold transition-colors sm:flex-none ${sourceView === "photos" ? "bg-gold text-forest-deep" : "text-ivory/65 hover:bg-ivory/5 hover:text-ivory"}`}>Photos</button>
                <button type="button" onClick={() => setSourceView("albums")} aria-pressed={sourceView === "albums"} className={`flex-1 px-3 py-3 text-left text-sm font-semibold transition-colors sm:flex-none ${sourceView === "albums" ? "bg-gold text-forest-deep" : "text-ivory/65 hover:bg-ivory/5 hover:text-ivory"}`}>Albums</button>
              </nav>

              <div className="min-w-0 p-5 sm:p-6">
                {sourceView === "photos" ? (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Photos</p>
                    <h3 className="mt-2 font-display text-3xl text-ivory">Select from Google Photos</h3>
                    <p className="mt-3 text-sm leading-6 text-ivory/55">Open Google’s secure Picker, choose photographs, then import them into an existing or newly named Rajavasantha project.</p>
                    {!googleItems.length ? <div className="mt-6 grid min-h-52 place-items-center border border-gold/30 bg-black/10 px-5 text-center" aria-live="polite">
                      <div><Images className="mx-auto text-gold" size={38} aria-hidden="true" /><p className="mt-4 font-display text-2xl text-ivory">{!connection.connected ? "Connect Google Photos" : pickerPreparing ? "Preparing Google Photos…" : pickerUri ? "Google Photos Picker ready" : "Preparing secure Picker…"}</p><p className="mx-auto mt-2 max-w-sm text-sm text-ivory/45">{!connection.connected ? "Connect your account once to select photographs securely." : pickerUri ? "Google requires Picker to open in its own secure window. Your session is ready and selection updates will appear here automatically." : "Creating a secure selection session automatically. No photographs are shared until you choose them."}</p>{connection.connected && pickerUri && <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold"><span className="h-2 w-2 rounded-full bg-gold" />Session ready</span>}</div>
                    </div> : <div className="mt-6" draggable={!pickerBusy} onDragStart={(event) => { event.dataTransfer.effectAllowed = "copy"; event.dataTransfer.setData("application/x-rajavasantha-google-selection", pickerSessionId); }}><div className="flex items-center justify-between gap-3"><p className="font-semibold text-ivory">{googleItems.length} selected from Google Photos</p><button type="button" onClick={clearGoogleSelection} className="text-xs text-ivory/55 underline">Clear</button></div><div className="mt-3 grid grid-cols-3 gap-2">{googleItems.slice(0, 12).map((item) => item.baseUrl && <div key={item.id} className="relative aspect-square overflow-hidden border border-ivory/10"><Image src={`${item.baseUrl}=w300-h300-c`} alt={item.fileName ?? "Selected photograph"} fill unoptimized className="object-cover" /></div>)}</div>{googleItems.length > 12 && <p className="mt-2 text-xs text-ivory/45">+ {googleItems.length - 12} more selected</p>}<p className="mt-3 text-xs text-gold">Drag this selection onto a project card, or choose a destination below.</p></div>}
                    {!googleItems.length ? <button type="button" onClick={openPicker} disabled={connection.connected && !pickerUri} className="mt-6 flex w-full items-center justify-between bg-gold px-5 py-4 text-left text-sm font-semibold text-forest-deep disabled:opacity-60"><span>{!connection.connected ? "Connect Google Photos" : pickerUri ? "Continue in Google Photos" : "Preparing Picker…"}</span><ArrowRight size={17} aria-hidden="true" /></button>
                      : <div className="mt-5"><label className="block text-xs font-semibold uppercase tracking-wider text-ivory/50">Import to<select value={destinationId} onChange={(event) => setDestinationId(event.target.value)} className="mt-2 w-full border border-gold/25 bg-forest-deep px-3 py-3 text-sm font-normal normal-case tracking-normal text-ivory"><option value="">Choose a project…</option>{folders.map((folder) => <option key={folder.id} value={folder.id}>{folder.name}</option>)}</select></label><button type="button" disabled={!destinationId || pickerBusy} onClick={() => void importToProject(destinationId)} className="mt-3 w-full bg-gold px-5 py-3 text-sm font-semibold text-forest-deep disabled:opacity-50">{pickerBusy ? `Importing ${importProgress.done} / ${importProgress.total}` : "Import selected photographs"}</button>{pickerBusy && <div className="mt-3 h-1 bg-ivory/10"><div className="h-full bg-gold" style={{ width: `${importProgress.total ? importProgress.done / importProgress.total * 100 : 0}%` }} /></div>}{importResult && <div className="mt-4 border border-gold/25 bg-black/15 p-4 text-sm" aria-live="polite"><p className="font-semibold text-ivory">Import complete</p><p className="mt-1 text-ivory/60">{importResult.imported} imported · {importResult.skipped} skipped · {importResult.failed.length} failed</p>{destinationId && <Link href={`/admin/folders/${destinationId}`} className="mt-3 inline-flex text-gold underline">View project</Link>}</div>}</div>}
                  </>
                ) : (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Albums</p>
                    <h3 className="mt-2 font-display text-3xl text-ivory">Choose an album in Picker</h3>
                    <p className="mt-3 text-sm leading-6 text-ivory/55">Google’s Picker does not expose a persistent album list to this website. Open Picker, find the album or collection there, and select the photographs you want to import.</p>
                    <div className="mt-6 border border-gold/20 bg-black/10 p-5"><p className="text-sm font-semibold text-ivory">Supported album workflow</p><ol className="mt-4 space-y-3 text-sm text-ivory/55"><li><span className="mr-3 text-gold">01</span>Name or choose the destination project</li><li><span className="mr-3 text-gold">02</span>Open Google Photos Picker</li><li><span className="mr-3 text-gold">03</span>Find the album and select its photos</li><li><span className="mr-3 text-gold">04</span>Review and import the selection</li></ol></div>
                    <button type="button" onClick={openPicker} disabled={connection.connected && !pickerUri} className="mt-6 flex w-full items-center justify-between bg-gold px-5 py-4 text-left text-sm font-semibold text-forest-deep disabled:opacity-60"><span>{!connection.connected ? "Connect Google Photos" : pickerUri ? "Continue in Picker for album selection" : "Preparing Picker…"}</span><ArrowRight size={17} aria-hidden="true" /></button>
                  </>
                )}
              </div>
            </div>
          </aside>

          <section aria-labelledby="library-heading" className="min-w-0 bg-forest-deep p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Destination</p>
                <h2 id="library-heading" className="mt-2 font-display text-3xl text-ivory">Projects & folders</h2>
              </div>
              <div className="flex items-center gap-4"><p className="text-sm text-ivory/50">{folders.length} {folders.length === 1 ? "project" : "projects"}</p><button type="button" onClick={() => createDialog.current?.showModal()} className="inline-flex items-center gap-2 border border-ivory/20 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ivory hover:border-gold"><Plus size={14} /> New project</button></div>
            </div>

            {!folders.length ? (
              <div className="mt-8 border border-dashed border-gold/35 px-6 py-14 text-center">
                <FolderOpen className="mx-auto text-gold" size={34} aria-hidden="true" />
                <p className="mt-5 font-display text-3xl">No projects yet</p>
                <p className="mx-auto mt-2 max-w-md text-sm text-ivory/55">Create a project, or import a named collection from Google Photos.</p>
                <button type="button" onClick={() => importDialog.current?.showModal()} className="mt-6 bg-gold px-5 py-3 text-sm font-semibold text-forest-deep">Import your first collection</button>
              </div>
            ) : (
              <div className="mt-7 grid gap-5 xl:grid-cols-2">
                {folders.map((folder) => (
                  <article key={folder.id}
                    onDragOver={(event) => { if (googleItems.length) { event.preventDefault(); event.dataTransfer.dropEffect = "copy"; setDragOverId(folder.id); } }}
                    onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragOverId(""); }}
                    onDrop={(event) => { event.preventDefault(); setDragOverId(""); if (event.dataTransfer.getData("application/x-rajavasantha-google-selection") === pickerSessionId) void importToProject(folder.id); }}
                    className={`group relative overflow-hidden border bg-ivory text-forest-deep transition-all ${dragOverId === folder.id ? "border-gold ring-4 ring-gold/30" : "border-ivory/10 hover:border-gold/70"}`}>
                    {dragOverId === folder.id && <div className="absolute inset-0 z-20 grid place-items-center bg-forest-deep/90 text-center text-ivory"><div><ImagePlus className="mx-auto text-gold" /><p className="mt-2 font-display text-2xl">Drop photos here</p><p className="text-xs text-ivory/60">Import into {folder.name}</p></div></div>}
                    <Link href={`/admin/folders/${folder.id}`} className="block">
                      <div className="relative aspect-[16/10] overflow-hidden bg-forest/10">
                        {folder.cover_url ? <Image src={folder.cover_url} alt={folder.cover_alt ?? `${folder.name} cover`} fill sizes="(min-width: 768px) 32vw, 90vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" /> : <Images className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-forest/25" size={42} aria-hidden="true" />}
                        <span className={`absolute right-3 top-3 inline-flex items-center gap-1.5 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider ${folder.is_public ? "bg-forest-deep text-ivory" : "bg-ivory text-forest-deep"}`}>
                          {folder.is_public ? <Eye size={12} aria-hidden="true" /> : <EyeOff size={12} aria-hidden="true" />}
                          {folder.is_public ? "Public" : "Private"}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="font-display text-2xl">{folder.name}</h3>
                        {folder.description && <p className="mt-2 line-clamp-2 text-sm text-forest-deep/65">{folder.description}</p>}
                        <p className="mt-4 text-xs text-forest-deep/50">{folder.photo_count} photographs · Updated {new Date(folder.updated_at).toLocaleDateString()}</p>
                      </div>
                    </Link>
                    <div className="grid grid-cols-2 border-t border-forest-deep/10">
                      <Link href={`/admin/folders/${folder.id}`} className="inline-flex items-center justify-center gap-2 border-b border-r border-forest-deep/10 px-3 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-forest-deep hover:text-ivory"><FolderOpen size={14} /> Open</Link>
                      <Link href={`/admin/folders/${folder.id}#google-photos-import`} className="inline-flex items-center justify-center gap-2 border-b border-forest-deep/10 bg-gold px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider hover:bg-gold-soft"><ImagePlus size={14} /> Import</Link>
                      <button type="button" disabled={busyId === folder.id} onClick={() => void toggleVisibility(folder)} className="inline-flex items-center justify-center gap-2 border-r border-forest-deep/10 px-3 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-forest-deep hover:text-ivory disabled:opacity-50">{folder.is_public ? <EyeOff size={14} /> : <Eye size={14} />}{folder.is_public ? "Unpublish" : "Publish"}</button>
                      <button type="button" disabled={busyId === folder.id} onClick={() => void deleteFolder(folder)} className="inline-flex items-center justify-center gap-2 px-3 py-3 text-xs font-semibold uppercase tracking-wider text-red-800 hover:bg-red-50 disabled:opacity-50"><Trash2 size={14} /> Delete</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <dialog ref={importDialog} className="w-[min(40rem,calc(100%-2rem))] border border-gold/30 bg-forest-deep p-0 text-ivory backdrop:bg-black/70">
          <div className="p-7">
            <div className="flex items-start gap-4"><ImagePlus className="mt-1 text-gold" aria-hidden="true" /><div><h2 className="font-display text-3xl">Import a Google Photos collection</h2><p className="mt-2 text-sm leading-6 text-ivory/60">Create a named Rajavasantha project, then select its photographs using Google’s secure Picker.</p></div></div>
            <form onSubmit={createImportFolder} className="mt-7">
              <label className="block text-sm font-semibold">Project or folder name *<input value={importFolderName} onChange={(event) => setImportFolderName(event.target.value)} required maxLength={120} className="mt-2 w-full border border-gold/30 bg-black/20 px-4 py-3 font-normal text-ivory" /></label>
              <button disabled={creatingImportFolder} className="mt-4 inline-flex items-center gap-2 bg-gold px-6 py-3 text-sm font-semibold text-forest-deep disabled:opacity-60">{creatingImportFolder ? "Creating…" : "Create and continue"}<ArrowRight size={16} /></button>
            </form>
            <div className="my-7 border-t border-ivory/10" />
            <h3 className="font-display text-2xl">Import into an existing project</h3>
            <div className="mt-4 grid max-h-56 gap-2 overflow-y-auto">
              {folders.map((folder) => <Link key={folder.id} href={`/admin/folders/${folder.id}#google-photos-import`} className="flex items-center justify-between border border-ivory/10 px-4 py-3 font-semibold hover:border-gold"><span>{folder.name}</span><ArrowRight size={16} aria-hidden="true" /></Link>)}
            </div>
            {error && <p role="alert" className="mt-4 text-sm text-red-200">{error}</p>}
            <button type="button" onClick={() => importDialog.current?.close()} className="mt-6 border border-ivory/20 px-6 py-3 text-sm">Cancel</button>
          </div>
        </dialog>

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
