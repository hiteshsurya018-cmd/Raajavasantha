"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type MediaItem = { id: string | null; fileName: string | null; mimeType: string | null; baseUrl: string | null };
type Result = { imported: number; skipped: number; failed: string[] };

async function json<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T & { error?: string };
  if (!response.ok) throw new Error(data.error ?? "Request failed.");
  return data;
}

export function GooglePhotosImporter({ projectId, projectSlug, projectTitle, connected }: {
  projectId: string; projectSlug: string; projectTitle: string; connected: boolean;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [sessionId, setSessionId] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function poll(id: string, attempt = 0) {
    if (attempt > 120) throw new Error("The Google Photos selection timed out. Please try again.");
    const status = await json<{ session: { mediaItemsSet: boolean } }>(await fetch(`/api/google/photos/picker/session/${encodeURIComponent(id)}`, { cache: "no-store" }));
    if (!status.session.mediaItemsSet) {
      timer.current = setTimeout(() => void poll(id, attempt + 1).catch(fail), 2000);
      return;
    }
    const selected: MediaItem[] = [];
    let pageToken: string | null = null;
    do {
      const query = new URLSearchParams({ sessionId: id, pageSize: "100" });
      if (pageToken) query.set("pageToken", pageToken);
      const page = await json<{ mediaItems: MediaItem[]; nextPageToken: string | null }>(await fetch(`/api/google/photos/picker/media-items?${query}`, { cache: "no-store" }));
      selected.push(...page.mediaItems.filter((item) => item.id));
      pageToken = page.nextPageToken;
    } while (pageToken);
    setItems(selected);
    setBusy(false);
    if (selected.length === 0) setError("No photographs were selected.");
  }

  function fail(reason: unknown) {
    setBusy(false);
    setError(reason instanceof Error ? reason.message : "Something went wrong.");
  }

  async function openPicker() {
    setBusy(true); setError(""); setResult(null); setItems([]);
    try {
      const data = await json<{ session: { id: string; pickerUri: string } }>(await fetch("/api/google/photos/picker/session", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ maxItemCount: 100 }),
      }));
      setSessionId(data.session.id);
      const popup = window.open(data.session.pickerUri, "google-photos-picker", "popup,width=1100,height=760");
      if (!popup) throw new Error("Allow pop-ups to open the Google Photos Picker.");
      await poll(data.session.id);
    } catch (reason) { fail(reason); }
  }

  async function importItems() {
    setBusy(true); setError(""); setResult(null); setProgress({ done: 0, total: items.length });
    const summary: Result = { imported: 0, skipped: 0, failed: [] };
    for (const item of items) {
      try {
        const response = await json<{ duplicate: boolean }>(await fetch("/api/google/photos/picker/import", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId, sessionId, mediaItemId: item.id, alt: `${projectTitle} project photograph` }),
        }));
        if (response.duplicate) summary.skipped += 1; else summary.imported += 1;
      } catch (reason) {
        summary.failed.push(`${item.fileName ?? "Photograph"}: ${reason instanceof Error ? reason.message : "Import failed."}`);
      }
      setProgress((value) => ({ ...value, done: value.done + 1 }));
    }
    setResult(summary); setBusy(false);
  }

  const returnTo = `/admin/projects/${projectSlug}/import-images`;
  return (
    <div className="mt-10">
      {!connected && items.length === 0 ? (
        <a href={`/api/google/photos/auth?returnTo=${encodeURIComponent(returnTo)}`} className="inline-flex bg-forest-deep px-6 py-3 text-sm font-semibold tracking-[0.12em] text-ivory uppercase">Connect Google Photos</a>
      ) : (
        <button type="button" onClick={openPicker} disabled={busy} className="bg-forest-deep px-6 py-3 text-sm font-semibold tracking-[0.12em] text-ivory uppercase disabled:opacity-60">
          {busy && items.length === 0 ? "Waiting for selection…" : "Select photographs"}
        </button>
      )}
      {error && <p role="alert" className="mt-5 border border-red-700/20 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
      {items.length > 0 && !result && (
        <div className="mt-10">
          <p className="font-display text-2xl text-forest-deep">{items.length} selected</p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {items.slice(0, 12).map((item) => item.baseUrl && (
              <div key={item.id} className="relative aspect-square overflow-hidden bg-forest-deep/5">
                <Image src={`${item.baseUrl}=w400-h400-c`} alt={item.fileName ?? "Selected photograph"} fill unoptimized className="object-cover" />
              </div>
            ))}
          </div>
          {busy ? <p className="mt-6 text-sm text-muted-foreground">Importing photographs… {progress.done} of {progress.total} processed</p> : (
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={importItems} className="bg-gold px-6 py-3 text-sm font-semibold text-forest-deep">Import photographs</button>
              <button type="button" onClick={() => { setItems([]); setSessionId(""); }} className="border border-forest-deep/20 px-6 py-3 text-sm text-forest-deep">Cancel</button>
            </div>
          )}
        </div>
      )}
      {result && (
        <div className="mt-10 border border-forest-deep/15 bg-ivory p-6">
          <h2 className="font-display text-3xl text-forest-deep">Import complete</h2>
          <p className="mt-4 text-sm">{result.imported} imported · {result.skipped} skipped · {result.failed.length} failed</p>
          {result.failed.length > 0 && <ul className="mt-4 space-y-2 text-sm text-red-800">{result.failed.map((message) => <li key={message}>{message}</li>)}</ul>}
          <Link href={`/projects/${projectSlug}`} className="mt-6 inline-flex text-sm font-semibold text-forest-deep underline">View project gallery</Link>
        </div>
      )}
    </div>
  );
}
