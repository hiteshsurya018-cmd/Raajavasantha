import "server-only";

import { createHash } from "crypto";
import { Readable } from "stream";
import { parse as parseExif } from "exifr";

import { sql } from "@/lib/db";
import { cloudinary } from "@/lib/cloudinary";
import { detectMediaType, MAX_MEDIA_BYTES, MAX_VIDEO_BYTES } from "@/lib/media/media-utils";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/3gpp",
  "video/x-msvideo",
  "video/mpeg",
]);

function inputError(message: string, status: number) {
  const error = new Error(message) as Error & { status: number };
  error.status = status;
  return error;
}

type CloudinaryUploadResult = {
  asset_id?: string;
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
  width?: number;
  height?: number;
  bytes?: number;
};

export type MediaSource =
  | "local"
  | "google-photos"
  | "icloud"
  | "external";

type IngestMediaInput = {
  projectId: string;
  buffer: Buffer;
  mimeType: string;
  fileSize?: number;
  source?: MediaSource;
  alt?: string;
  caption?: string | null;
  sourceRef?: string | null;
  originalFilename?: string | null;
};

export type DuplicateReason =
  | "SAME_GOOGLE_ITEM"
  | "SAME_FILE"
  | "RACE_CONDITION"
  | "UNKNOWN_DUPLICATE";

function duplicateResult(reason: DuplicateReason, row: Record<string, unknown>, message: string) {
  console.info("Media import duplicate", {
    duplicateReason: reason,
    existingMediaId: row.id,
    existingProjectId: row.project_id,
    fingerprintPrefix: typeof row.media_fingerprint === "string" ? row.media_fingerprint.slice(0, 12) : undefined,
  });
  return {
    success: true as const,
    duplicate: true as const,
    duplicateReason: reason,
    message,
    existingMediaId: String(row.id),
    existingProjectId: String(row.project_id),
    existingProjectName: row.project_name ? String(row.project_name) : undefined,
    image: row,
  };
}

function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  resourceType: "image" | "video",
  format?: "jpg" | "mp4",
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        ...(format ? { format } : {}),
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary returned no upload result."));
          return;
        }

        resolve(result as CloudinaryUploadResult);
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

export async function ingestMedia({
  projectId,
  buffer,
  mimeType,
  fileSize,
  source = "local",
  alt = "Rajavasantha Welfare Trust project photograph",
  caption = null,
  sourceRef = null,
  originalFilename = null,
}: IngestMediaInput) {
  if (!projectId.trim()) {
    throw inputError("projectId is required.", 400);
  }

  if (!ALLOWED_TYPES.has(mimeType)) {
    throw inputError(
      `Unsupported image type: ${mimeType || "unknown"}.`,
      415,
    );
  }

  const isVideo = mimeType.startsWith("video/");
  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_MEDIA_BYTES;
  if (buffer.length > maxBytes) {
    throw inputError(`${isVideo ? "Video" : "Image"} exceeds the ${maxBytes / 1024 / 1024} MB upload limit.`, 413);
  }

  const detectedType = detectMediaType(buffer);
  const heifFamily = mimeType === "image/heic" || mimeType === "image/heif";
  const isoVideoFamily = isVideo && (detectedType === "video/mp4" || detectedType === "video/quicktime" || detectedType === "video/3gpp");
  if (!detectedType || (detectedType !== mimeType && !(heifFamily && detectedType === "image/heic") && !isoVideoFamily)) {
    throw inputError("The file contents do not match a supported media format.", 415);
  }

  const projectRows = (await sql`
    SELECT
      id,
      slug,
      title
    FROM projects
    WHERE id = ${projectId}
    LIMIT 1
  `) as {
    id: string;
    slug: string;
    title: string;
  }[];

  if (projectRows.length === 0) {
    const error = new Error("Project not found.");
    (error as Error & { status?: number }).status = 404;
    throw error;
  }

  const project = projectRows[0];

  /*
   * Fingerprint the actual image bytes.
   *
   * This is intentionally independent of source.
   *
   * Therefore:
   * local + Google Photos + iCloud
   * all resolve to the same fingerprint for identical bytes.
   */
  const mediaFingerprint = createHash("sha256")
    .update(buffer)
    .digest("hex");

  let latitude: number | null = null;
  let longitude: number | null = null;
  let capturedAt: Date | null = null;
  let locationAccuracy: number | null = null;
  let cameraMake: string | null = null;
  let cameraModel: string | null = null;
  let lensModel: string | null = null;
  let aperture: number | null = null;
  let exposureTime: string | null = null;
  let iso: number | null = null;
  let focalLength: number | null = null;
  if (!isVideo) {
    try {
      const metadata = await parseExif(buffer, { gps: true, pick: ["latitude", "longitude", "GPSHPositioningError", "DateTimeOriginal", "Make", "Model", "LensModel", "FNumber", "ExposureTime", "ISO", "FocalLength"] }) as {
        latitude?: number; longitude?: number; DateTimeOriginal?: Date; Make?: string; Model?: string;
        GPSHPositioningError?: number; LensModel?: string; FNumber?: number; ExposureTime?: number | string; ISO?: number; FocalLength?: number;
      } | undefined;
      const candidateLatitude = Number(metadata?.latitude);
      const candidateLongitude = Number(metadata?.longitude);
      if (Number.isFinite(candidateLatitude) && Number.isFinite(candidateLongitude) && candidateLatitude >= -90 && candidateLatitude <= 90 && candidateLongitude >= -180 && candidateLongitude <= 180 && !(candidateLatitude === 0 && candidateLongitude === 0)) {
        latitude = candidateLatitude; longitude = candidateLongitude;
        locationAccuracy = Number.isFinite(metadata?.GPSHPositioningError) ? Number(metadata?.GPSHPositioningError) : null;
      }
      if (metadata?.DateTimeOriginal instanceof Date && !Number.isNaN(metadata.DateTimeOriginal.getTime())) capturedAt = metadata.DateTimeOriginal;
      cameraMake = metadata?.Make?.trim() || null;
      cameraModel = metadata?.Model?.trim() || null;
      lensModel = metadata?.LensModel?.trim() || null;
      aperture = Number.isFinite(metadata?.FNumber) ? Number(metadata?.FNumber) : null;
      exposureTime = metadata?.ExposureTime === undefined ? null : String(metadata.ExposureTime).slice(0, 80);
      iso = Number.isInteger(metadata?.ISO) ? Number(metadata?.ISO) : null;
      focalLength = Number.isFinite(metadata?.FocalLength) ? Number(metadata?.FocalLength) : null;
    } catch {
      // Missing or malformed EXIF must never prevent media ingestion.
    }
  }

  if (sourceRef) {
    const sourceRows = (await sql`
      SELECT gallery.id, gallery.project_id, gallery.src, gallery.alt, gallery.caption, gallery.source, gallery.sort_order,
        cloudinary_public_id, cloudinary_asset_id, media_fingerprint,
        resource_type, format, width, height, bytes, source_ref, gallery.created_at,
        project.title AS project_name
      FROM project_gallery_images gallery
      JOIN projects project ON project.id = gallery.project_id
      WHERE gallery.source = ${source} AND gallery.source_ref = ${sourceRef}
      LIMIT 1
    `) as Record<string, unknown>[];
    if (sourceRows.length > 0) {
      return duplicateResult(source === "google-photos" ? "SAME_GOOGLE_ITEM" : "UNKNOWN_DUPLICATE", sourceRows[0], source === "google-photos" ? "This Google Photos item is already imported." : "This media item is already imported.");
    }
  }

  /*
   * GLOBAL duplicate check.
   *
   * The first implementation always wins, regardless
   * of which project/source tries to import it later.
   */
  const existingRows = (await sql`
    SELECT
      gallery.id,
      gallery.project_id,
      src,
      alt,
      caption,
      source,
      sort_order,
      cloudinary_public_id,
      cloudinary_asset_id,
      media_fingerprint,
      resource_type,
      format,
      width,
      height,
      bytes,
      source_ref,
      gallery.created_at,
      project.title AS project_name
    FROM project_gallery_images gallery
    JOIN projects project ON project.id = gallery.project_id
    WHERE gallery.media_fingerprint = ${mediaFingerprint}
    LIMIT 1
  `) as Record<string, unknown>[];

  if (existingRows.length > 0) {
    return duplicateResult("SAME_FILE", existingRows[0], "The same file is already imported.");
  }

  /*
   * Determine the next gallery position.
   */
  const sortRows = (await sql`
    SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_sort_order
    FROM project_gallery_images
    WHERE project_id = ${project.id}
  `) as {
    next_sort_order: number | string;
  }[];

  const sortOrder = Number(
    sortRows[0]?.next_sort_order ?? 0,
  );

  /*
   * Every source uses the exact same Cloudinary structure.
   */
  const folder = `rajavasantha/projects/${project.slug}`;

  const uploaded = await uploadToCloudinary(
    buffer,
    folder,
    isVideo ? "video" : "image",
    isVideo ? "mp4" : heifFamily ? "jpg" : undefined,
  );
  const storedMimeType = isVideo ? "video/mp4" : heifFamily ? "image/jpeg" : mimeType;

  try {
    const insertedRows = (await sql`
      INSERT INTO project_gallery_images (
        id,
        project_id,
        src,
        alt,
        caption,
        source,
        sort_order,
        cloudinary_public_id,
        cloudinary_asset_id,
        media_fingerprint,
        resource_type,
        format,
        width,
        height,
        bytes,
        source_ref
        , original_filename
        , mime_type
        , latitude
        , longitude
        , captured_at
        , location_accuracy
        , location_source
        , location_precision
        , camera_make
        , camera_model
        , lens_model
        , aperture
        , exposure_time
        , iso
        , focal_length
      )
      VALUES (
        gen_random_uuid(),
        ${project.id},
        ${uploaded.secure_url},
        ${alt},
        ${caption},
        ${source},
        ${sortOrder},
        ${uploaded.public_id},
        ${uploaded.asset_id ?? null},
        ${mediaFingerprint},
        ${uploaded.resource_type ?? "image"},
        ${uploaded.format ?? null},
        ${uploaded.width ?? null},
        ${uploaded.height ?? null},
        ${uploaded.bytes ?? fileSize ?? buffer.length},
        ${sourceRef}
        , ${originalFilename}
        , ${storedMimeType}
        , ${latitude}
        , ${longitude}
        , ${capturedAt}
        , ${locationAccuracy}
        , ${latitude !== null && longitude !== null ? "exif" : null}
        , ${latitude !== null && longitude !== null ? "exact" : "unknown"}
        , ${cameraMake}
        , ${cameraModel}
        , ${lensModel}
        , ${aperture}
        , ${exposureTime}
        , ${iso}
        , ${focalLength}
      )
      RETURNING
        id,
        project_id,
        src,
        alt,
        caption,
        source,
        sort_order,
        cloudinary_public_id,
        cloudinary_asset_id,
        media_fingerprint,
        resource_type,
        format,
        width,
        height,
        bytes,
        source_ref,
        latitude,
        longitude,
        location_label,
        location_source,
        location_precision,
        location_verified,
        captured_at,
        camera_make,
        camera_model,
        lens_model,
        aperture,
        exposure_time,
        iso,
        focal_length,
        created_at
    `) as Record<string, unknown>[];

    return {
      success: true,
      duplicate: false,
      message: "Image uploaded successfully.",
      project: {
        id: project.id,
        slug: project.slug,
        title: project.title,
      },
      image: insertedRows[0],
    };
  } catch (databaseError) {
    /*
     * A concurrent request may have inserted the same
     * fingerprint after our first duplicate check.
     */
    const duplicateRows = (await sql`
      SELECT
        id,
        project_id,
        src,
        alt,
        caption,
        source,
        sort_order,
        cloudinary_public_id,
        cloudinary_asset_id,
        media_fingerprint,
        resource_type,
        format,
        width,
        height,
        bytes,
        source_ref,
        gallery.created_at,
        project.title AS project_name
      FROM project_gallery_images gallery
      JOIN projects project ON project.id = gallery.project_id
      WHERE gallery.media_fingerprint = ${mediaFingerprint}
      LIMIT 1
    `) as Record<string, unknown>[];

    if (duplicateRows.length > 0) {
      try {
        await cloudinary.uploader.destroy(
          uploaded.public_id,
          {
            resource_type:
              uploaded.resource_type ?? "image",
            invalidate: true,
          },
        );
      } catch {
        // Preserve successful duplicate resolution.
      }

      return duplicateResult("RACE_CONDITION", duplicateRows[0], "This file was imported by another request.");
    }

    /*
     * Real database failure.
     *
     * Remove the Cloudinary asset so we don't leave
     * an orphaned file.
     */
    try {
      await cloudinary.uploader.destroy(
        uploaded.public_id,
        {
          resource_type:
            uploaded.resource_type ?? "image",
          invalidate: true,
        },
      );
    } catch {
      // Preserve the original database error.
    }

    console.error(
      "Gallery database insert failed:",
      databaseError,
    );

    throw new Error(
      "Image uploaded to Cloudinary but could not be saved to the database.",
    );
  }
}
