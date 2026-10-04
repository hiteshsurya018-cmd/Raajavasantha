import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "crypto";

const ALGORITHM = "aes-256-gcm";

function getKey() {
  const value =
    process.env.GOOGLE_PHOTOS_TOKEN_ENCRYPTION_KEY;

  if (!value) {
    throw new Error(
      "GOOGLE_PHOTOS_TOKEN_ENCRYPTION_KEY is not configured.",
    );
  }

  const key = Buffer.from(value, "hex");

  if (key.length !== 32) {
    throw new Error(
      "GOOGLE_PHOTOS_TOKEN_ENCRYPTION_KEY must contain 32 bytes encoded as 64 hexadecimal characters.",
    );
  }

  return key;
}

export function encryptGoogleToken(
  plaintext: string,
) {
  const iv = randomBytes(12);
  const cipher = createCipheriv(
    ALGORITHM,
    getKey(),
    iv,
  );

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex"),
  ].join(".");
}

export function decryptGoogleToken(
  encryptedValue: string,
) {
  const parts = encryptedValue.split(".");

  if (parts.length !== 3) {
    throw new Error(
      "Invalid encrypted Google token format.",
    );
  }

  const [ivHex, authTagHex, encryptedHex] = parts;

  const decipher = createDecipheriv(
    ALGORITHM,
    getKey(),
    Buffer.from(ivHex, "hex"),
  );

  decipher.setAuthTag(
    Buffer.from(authTagHex, "hex"),
  );

  const decrypted = Buffer.concat([
    decipher.update(
      Buffer.from(encryptedHex, "hex"),
    ),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}