import crypto from "crypto";
import { getDb } from "./db";
import { eq } from "drizzle-orm";
import { users } from "../drizzle/schema";

/**
 * Generate a random reset token (6-digit code for simplicity)
 * In production, you might want to use a longer token or UUID
 */
export function generateResetToken(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Generate token expiry time (valid for 30 minutes)
 */
export function getTokenExpiry(): Date {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 30);
  return expiry;
}

/**
 * Save reset token to database
 */
export async function saveResetToken(email: string, token: string): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) {
      console.error("[Reset Token] Database not available");
      return false;
    }

    const expiry = getTokenExpiry();

    await db
      .update(users)
      .set({
        resetToken: token,
        resetTokenExpiry: expiry,
      })
      .where(eq(users.email, email));

    return true;
  } catch (error) {
    console.error("[Reset Token] Failed to save reset token:", error);
    return false;
  }
}

/**
 * Verify reset token
 */
export async function verifyResetToken(email: string, token: string): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) {
      console.error("[Reset Token] Database not available");
      return false;
    }

    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (result.length === 0) {
      return false;
    }

    const user = result[0];

    // Check if token matches
    if (user.resetToken !== token) {
      return false;
    }

    // Check if token is expired
    if (!user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Reset Token] Failed to verify reset token:", error);
    return false;
  }
}

/**
 * Clear reset token after successful password reset
 */
export async function clearResetToken(email: string): Promise<boolean> {
  try {
    const db = await getDb();
    if (!db) {
      console.error("[Reset Token] Database not available");
      return false;
    }

    await db
      .update(users)
      .set({
        resetToken: null,
        resetTokenExpiry: null,
      })
      .where(eq(users.email, email));

    return true;
  } catch (error) {
    console.error("[Reset Token] Failed to clear reset token:", error);
    return false;
  }
}

/**
 * Send reset token via email (using Manus built-in notification API)
 * This is a placeholder - you need to implement actual email sending
 */
export async function sendResetTokenEmail(email: string, token: string): Promise<boolean> {
  try {
    // TODO: Implement actual email sending using Manus API or third-party service
    // For now, we'll just log it
    console.log(`[Reset Token Email] Sending reset token ${token} to ${email}`);

    // In production, you would call an email service here
    // Example using nodemailer or similar:
    // await transporter.sendMail({
    //   from: 'noreply@zuodi.com',
    //   to: email,
    //   subject: '佐迪智能家具 - 密码重置',
    //   html: `<p>您的密码重置验证码是: <strong>${token}</strong></p><p>验证码有效期为30分钟</p>`
    // });

    return true;
  } catch (error) {
    console.error("[Reset Token Email] Failed to send email:", error);
    return false;
  }
}
