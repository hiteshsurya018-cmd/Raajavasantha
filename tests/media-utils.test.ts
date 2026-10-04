import assert from "node:assert/strict";
import test from "node:test";
import { detectImageType, detectMediaType, fingerprintMedia, sanitizeFilename, slugifyFolderName } from "../lib/media/media-utils";

test("folder slugs are normalized and path-safe", () => {
  assert.equal(slugifyFolderName(" Community Outreach 2026 "), "community-outreach-2026");
  assert.equal(slugifyFolderName("Crème & Care"), "creme-care");
});

test("filenames cannot contain traversal separators", () => {
  assert.equal(sanitizeFilename("../private\\photo.jpg"), ".._private_photo.jpg");
});

test("fingerprints are deterministic SHA-256 hashes", () => {
  assert.equal(fingerprintMedia(Buffer.from("same")), fingerprintMedia(Buffer.from("same")));
  assert.notEqual(fingerprintMedia(Buffer.from("same")), fingerprintMedia(Buffer.from("different")));
});

test("image signatures are validated independently of MIME claims", () => {
  assert.equal(detectImageType(Buffer.from([0xff, 0xd8, 0xff, 0x00])), "image/jpeg");
  assert.equal(detectImageType(Buffer.from([0, 0, 0, 20, ...Buffer.from("ftypheif")])), "image/heic");
  assert.equal(detectImageType(Buffer.from("not an image")), null);
});

test("common video containers are detected from file signatures", () => {
  assert.equal(detectMediaType(Buffer.from([0, 0, 0, 24, ...Buffer.from("ftypisom")])), "video/mp4");
  assert.equal(detectMediaType(Buffer.from([0, 0, 0, 20, ...Buffer.from("ftypqt  ")])), "video/quicktime");
  assert.equal(detectMediaType(Buffer.from([0x1a, 0x45, 0xdf, 0xa3, 0, 0, 0, 0])), "video/webm");
  assert.equal(detectMediaType(Buffer.from("not media")), null);
});
