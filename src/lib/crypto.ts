import crypto from "crypto";

const ITERATIONS = 10000;
const KEY_LEN = 64;
const DIGEST = "sha512";

/**
 * Hash a password using PBKDF2 with a cryptographically secure random salt.
 * Returns format: "pbkdf2:salt:hash"
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST).toString("hex");
  return `pbkdf2:${salt}:${derivedKey}`;
}

/**
 * Verify a plain password against a stored password hash.
 * Handles both PBKDF2 hashed passwords and legacy plain/seeded passcodes.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash) return false;

  // PBKDF2 format check
  if (storedHash.startsWith("pbkdf2:")) {
    const parts = storedHash.split(":");
    if (parts.length !== 3) return false;
    const [, salt, expectedKey] = parts;
    const actualKey = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST).toString("hex");

    try {
      const expectedBuf = Buffer.from(expectedKey, "hex");
      const actualBuf = Buffer.from(actualKey, "hex");
      if (expectedBuf.length !== actualBuf.length) return false;
      return crypto.timingSafeEqual(expectedBuf, actualBuf);
    } catch {
      return false;
    }
  }

  // Backward compatibility with initial seeded plain credentials (e.g. "Admin@123", "Demo@123")
  try {
    const expectedBuf = Buffer.from(storedHash);
    const actualBuf = Buffer.from(password);
    if (expectedBuf.length !== actualBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, actualBuf);
  } catch {
    return storedHash === password;
  }
}

/**
 * Generate a cryptographically secure idempotency key or reference ID
 */
export function generateSecureId(prefix = "txn"): string {
  const random = crypto.randomBytes(8).toString("hex");
  return `${prefix}_${Date.now()}_${random}`;
}
