"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type MediaItem = { id: string | null; fileName: string | null; baseUrl: string | null };
type Result = { imported: number; skipped: number; failed: string[] };
type Props = { connected: boolean; reconnectRequired?: boolean; projectId?: string; projectSlug?: string; projectTitle?: string; folderId?: string; folderName?: string };
type Polling = { pollInterval?: string; timeoutIn?: string };

async function read<T>(response: Response): Promise<T> {
  const data = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(data.error ?? "Request failed.");
  return data;
}

function duration(value?: string, fallback = 2000) {
  const match = value?.match(/^([0-9]+(?:\.[0-9]+)?)s$/);
  return match ? Number(match[1]) * 1000 : fallback;
}

export function GooglePhotosImporter(props: Props) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [sessionId, setSessionId] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const returnTo = props.folderId ? `/admin/folders/${props.folderId}` : `/admin/projects/${props.projectSlug}/import-images`;

  function fail(reason: unknown) {
    setBusy(false);
    setError(reason instanceof Error ? reason.message : "Something went wrong.");
  }

  async function poll(id: string, config: Polling, deadline: number) {
    if (Date.now() > deadline) throw new Error("The Google Photos selection timed out. Please try again.");
    const status = await read<{ session: { mediaItemsSet?: boolean; pollingConfig?: Polling } }>(
      await fetch(`/api/google/photos/picker/session/${encodeURIComponent(id)}`, { cache: "no-store" }),
    );
    const polling = status.session.pollingConfig ?? config;
    if (!status.session.mediaItemsSet) {
      timer.current = setTimeout(() => void poll(id, polling, deadline).catch(fail), duration(polling.pollInterval));
      return;
    }
    const selected: MediaItem[] = [];
    let pageToken: string | null = null;
    do {
      const query = new URLSearchParams({ sessionId: id, pageSize: "100" });
      if (pageToken) query.set("pageToken", pageToken);
      const page = await read<{ mediaItems: MediaItem[]; nextPageToken: string | null }>(
        await fetch(`/api/google/photos/picker/media-items?${query}`, { cache: "no-store" }),
      );
      selected.push(...page.mediaItems.filter((item) => item.id));
      pageToken = page.nextPageToken;
    } while (pageToken);
    setItems(selected);
    setBusy(false);
    if (!selected.length) setError("No photographs were selected.");
  }

  async function openPicker() {
    setBusy(true); setError(""); setResult(null); setItems([]);
    try {
      const data = await read<{ session: { id: string; pickerUri: string; pollingConfig?: Polling } }>(
        await fetch("/api/google/photos/picker/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }),
      );
      setSessionId(data.session.id);
      const popup = window.open(data.session.pickerUri, "google-photos-picker", "popup,width=1100,height=760");
      if (!popup) throw new Error("Allow pop-ups to open the Google Photos Picker.");
      const config = data.session.pollingConfig ?? {};
      await poll(data.session.id, config, Date.now() + duration(config.timeoutIn, 10 * 60 * 1000));
    } catch (reason) { fail(reason); }
  }

  async function disconnect() {
    if (!window.confirm("Disconnect Google Photos? You can reconnect without affecting imported photographs.")) return;
    try {
      await read(await fetch("/api/google/photos/connection", { method: "DELETE" }));
      window.location.reload();
    } catch (reason) { fail(reason); }
  }

  async function importItems() {
    setBusy(true); setError(""); setResult(null); setProgress({ done: 0, total: items.length });
    const summary: Result = { imported: 0, skipped: 0, failed: [] };
    for (const item of items) {
      try {
        const response = await read<{ duplicate: boolean }>(await fetch("/api/google/photos/picker/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: props.projectId, folderId: props.folderId, sessionId, mediaItemId: item.id, alt: `${props.folderName ?? props.projectTitle ?? "Rajavasantha"} photograph` }),
        }));
        if (response.duplicate) summary.skipped += 1; else summary.imported += 1;
      } catch (reason) {
        summary.failed.push(`${item.fileName ?? "Photograph"}: ${reason instanceof Error ? reason.message : "Import failed."}`);
      }
      setProgress((value) => ({ ...value, done: value.done + 1 }));
    }
    void fetch(`/api/google/photos/picker/session/${encodeURIComponent(sessionId)}`, { method: "DELETE" });
    setResult(summary);
    setBusy(false);
  }

  return (
    <section id="google-photos-import" className="mt-10 scroll-mt-28 border border-gold/25 bg-black/10 p-5 sm:p-7" aria-labelledby="google-import-heading">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Source</p>
      <h2 id="google-import-heading" className="mt-2 font-display text-3xl text-ivory">Import from Google Photos</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-ivory/55">Select photographs securely in Google Photos. They import directly into this project; your Google Photos originals are never changed.</p>

      {!props.connected ? (
        <div className="mt-5">
          <p className="mb-4 text-sm text-ivory/60">{props.reconnectRequired ? "The saved authorization can no longer be opened. Disconnect it, then reconnect Google Photos." : "Connect Google Photos to select photographs."}</p>
          {props.reconnectRequired && <button type="button" onClick={disconnect} className="mr-3 border border-ivory/25 px-5 py-3 text-sm font-semibold text-ivory">Disconnect stale connection</button>}
          {!props.reconnectRequired && <a href={`/api/google/photos/auth?returnTo=${encodeURIComponent(returnTo)}`} className="inline-flex bg-gold px-6 py-3 text-sm font-semibold tracking-[0.1em] text-forest-deep uppercase">Connect Google Photos</a>}
        </div>
      ) : (
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={openPicker} disabled={busy} className="bg-gold px-6 py-3 text-sm font-semibold tracking-[0.1em] text-forest-deep uppercase disabled:opacity-60">{busy && !items.length ? "Waiting for selection…" : "Open Google Photos Picker"}</button>
          <button type="button" onClick={disconnect} className="text-sm text-ivory/55 underline">Disconnect</button>
        </div>
      )}

      {error && <p role="alert" className="mt-5 border border-red-300/30 bg-red-950/30 p-4 text-sm text-red-100">{error}</p>}

      {!!items.length && !result && (
        <div className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Selection tray</p><p className="mt-1 font-display text-2xl text-ivory">{items.length} photographs selected</p></div>
            <button type="button" onClick={() => setItems([])} className="text-sm text-ivory/55 underline">Clear selection</button>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {items.slice(0, 18).map((item) => item.baseUrl && <div key={item.id} className="relative aspect-square overflow-hidden border border-ivory/10 bg-black/20"><Image src={`${item.baseUrl}=w400-h400-c`} alt={item.fileName ?? "Selected photograph"} fill unoptimized className="object-cover" /></div>)}
          </div>
          {items.length > 18 && <p className="mt-3 text-sm text-ivory/50">Showing 18 previews. All {items.length} selected photographs will be imported.</p>}
          <div aria-live="polite">
            {busy ? <div className="mt-6"><p className="text-sm text-ivory">Importing photographs… {progress.done} of {progress.total} processed</p><div className="mt-3 h-1 overflow-hidden bg-ivory/10"><div className="h-full bg-gold transition-[width]" style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }} /></div></div>
              : <div className="mt-6 flex gap-3"><button type="button" onClick={importItems} className="bg-gold px-6 py-3 text-sm font-semibold text-forest-deep">Import into this project</button><button type="button" onClick={() => setItems([])} className="border border-ivory/20 px-6 py-3 text-sm text-ivory">Cancel</button></div>}
          </div>
        </div>
      )}

      {result && <div className="mt-8 border border-gold/25 bg-black/20 p-6 text-ivory" aria-live="polite"><h3 className="font-display text-3xl">Import complete</h3><p className="mt-3">{result.imported} imported · {result.skipped} skipped · {result.failed.length} failed</p>{!!result.failed.length && <ul className="mt-4 space-y-2 text-sm text-red-200">{result.failed.map((message) => <li key={message}>{message}</li>)}</ul>}<Link href={returnTo} className="mt-5 inline-flex font-semibold text-gold underline">Return to folder</Link></div>}
    </section>
  );
}
