import crypto from "crypto";

/**
 * Hash a password using PBKDF2
 * @param password The plain text password
 * @returns The hashed password with salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify a password against a hash
 * @param password The plain text password to verify
 * @param hash The stored hash (format: salt:hash)
 * @returns true if password matches, false otherwise
 */
export function verifyPassword(password: string, hash: string): boolean {
  try {
    const [salt, storedHash] = hash.split(":");
    if (!salt || !storedHash) {
      return false;
    }
    const computedHash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");
    return computedHash === storedHash;
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}
