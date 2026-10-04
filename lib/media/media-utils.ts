import { createHash } from "crypto";

export const MAX_MEDIA_BYTES = 20 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

export function slugifyFolderName(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

export function sanitizeFilename(value: string) {
  const cleaned = value.normalize("NFKC").replace(/[\\/\0\r\n]/g, "_")
    .replace(/[^a-zA-Z0-9._ -]/g, "_").trim().slice(0, 180);
  return cleaned || "photograph";
}

export function fingerprintMedia(buffer: Buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

export function detectImageType(buffer: Buffer) {
  if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return "image/jpeg";
  if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  const head = buffer.subarray(0, 16).toString("ascii");
  if (head.startsWith("GIF87a") || head.startsWith("GIF89a")) return "image/gif";
  if (head.startsWith("RIFF") && head.slice(8, 12) === "WEBP") return "image/webp";
  if (head.slice(4, 8) === "ftyp" && /heic|heix|hevc|hevx|mif1|msf1|heif|heis/.test(head.slice(8, 12))) return "image/heic";
  return null;
}

export function detectMediaType(buffer: Buffer) {
  const imageType = detectImageType(buffer);
  if (imageType) return imageType;
  const head = buffer.subarray(0, 16);
  const ascii = head.toString("ascii");
  if (ascii.slice(4, 8) === "ftyp") {
    const brand = ascii.slice(8, 12);
    if (brand === "qt  ") return "video/quicktime";
    if (/^3g[p2]/i.test(brand)) return "video/3gpp";
    return "video/mp4";
  }
  if (head.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))) return "video/webm";
  if (ascii.startsWith("RIFF") && ascii.slice(8, 12) === "AVI ") return "video/x-msvideo";
  if (head.subarray(0, 4).equals(Buffer.from([0x00, 0x00, 0x01, 0xba])) ||
      head.subarray(0, 4).equals(Buffer.from([0x00, 0x00, 0x01, 0xb3]))) return "video/mpeg";
  return null;
}
