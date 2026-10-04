import "server-only";

import { Readable } from "stream";
import { randomUUID } from "crypto";
import sharp from "sharp";
import { sql } from "@/lib/db";
import { cloudinary } from "@/lib/cloudinary";
import { detectImageType, fingerprintMedia, MAX_MEDIA_BYTES, sanitizeFilename } from "@/lib/media/media-utils";

type Upload = { asset_id?: string; public_id: string; secure_url: string; width?: number; height?: number; bytes?: number };
function fail(message: string, status: number) { return Object.assign(new Error(message), { status }); }
function upload(buffer: Buffer, folder: string, suffix: string): Promise<Upload> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder, resource_type: "image", format: "webp", public_id: suffix,
      unique_filename: true, overwrite: false }, (error, result) => error ? reject(error) : result ? resolve(result as Upload) : reject(new Error("No upload result.")));
    Readable.from(buffer).pipe(stream);
  });
}
async function destroy(publicId?: string) { if (publicId) try { await cloudinary.uploader.destroy(publicId, { invalidate: true }); } catch {} }

export async function ingestLibraryMedia(input: { folderId: string; buffer: Buffer; mimeType: string; originalFilename: string;
  source: "local" | "google-photos"; sourceRef?: string | null; alt?: string; caption?: string | null }) {
  if (!input.folderId) throw fail("Folder is required.", 400);
  if (!input.buffer.length) throw fail("The photograph is empty.", 400);
  if (input.buffer.length > MAX_MEDIA_BYTES) throw fail("Image exceeds the allowed size.", 413);
  const detected = detectImageType(input.buffer);
  if (!detected) throw fail("Unsupported image format.", 415);
  const folders = await sql`SELECT id, slug, name FROM media_folders WHERE id = ${input.folderId} LIMIT 1`;
  if (!folders.length) throw fail("Folder not found.", 404);
  const fingerprint = fingerprintMedia(input.buffer);
  const duplicate = input.sourceRef
    ? await sql`SELECT id FROM media_photos WHERE (source = ${input.source} AND source_ref = ${input.sourceRef}) OR media_fingerprint = ${fingerprint} LIMIT 1`
    : await sql`SELECT id FROM media_photos WHERE media_fingerprint = ${fingerprint} LIMIT 1`;
  if (duplicate.length) return { duplicate: true, image: duplicate[0] };

  let mainUpload: Upload | undefined; let thumbUpload: Upload | undefined;
  try {
    const image = sharp(input.buffer, { failOn: "warning" }).rotate();
    const mainBuffer = await image.clone().resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 84 }).toBuffer();
    const thumbBuffer = await image.clone().resize({ width: 600, height: 600, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 78 }).toBuffer();
    const folder = `rajavasantha/media/${folders[0].slug}`;
    [mainUpload, thumbUpload] = await Promise.all([
      upload(mainBuffer, folder, `photo-${fingerprint.slice(0, 16)}-${randomUUID()}`),
      upload(thumbBuffer, `${folder}/thumbnails`, `thumb-${fingerprint.slice(0, 16)}-${randomUUID()}`),
    ]);
    try {
      const rows = await sql`INSERT INTO media_photos (folder_id, original_filename, mime_type, original_bytes, width, height,
        cloudinary_public_id, cloudinary_asset_id, cloudinary_url, thumbnail_public_id, thumbnail_url,
        media_fingerprint, source, source_ref, alt, caption)
        VALUES (${input.folderId}, ${sanitizeFilename(input.originalFilename)}, ${detected}, ${input.buffer.length},
        ${mainUpload.width ?? null}, ${mainUpload.height ?? null}, ${mainUpload.public_id}, ${mainUpload.asset_id ?? null},
        ${mainUpload.secure_url}, ${thumbUpload.public_id}, ${thumbUpload.secure_url}, ${fingerprint}, ${input.source},
        ${input.sourceRef ?? null}, ${input.alt?.trim().slice(0, 300) || `${folders[0].name} photograph`}, ${input.caption?.trim().slice(0, 1000) || null}) RETURNING *`;
      await sql`UPDATE media_folders SET updated_at = now() WHERE id = ${input.folderId}`;
      return { duplicate: false, image: rows[0] };
    } catch (error) {
      const winner = await sql`SELECT id FROM media_photos WHERE media_fingerprint = ${fingerprint} LIMIT 1`;
      await Promise.all([destroy(mainUpload.public_id), destroy(thumbUpload.public_id)]);
      if (winner.length) return { duplicate: true, image: winner[0] };
      throw error;
    }
  } catch (error) {
    await Promise.all([destroy(mainUpload?.public_id), destroy(thumbUpload?.public_id)]);
    if (error instanceof Error && "status" in error) throw error;
    console.error("Media library ingestion failed", { error: error instanceof Error ? error.name : "unknown" });
    throw fail("Unable to save photograph. Please try again.", 500);
  }
}
