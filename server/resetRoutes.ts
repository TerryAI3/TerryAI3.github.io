import express, { Express, Request, Response } from "express";
import { getUserByEmail } from "./db";
import { hashPassword, verifyPassword } from "./auth";
import {
  generateResetToken,
  saveResetToken,
  verifyResetToken,
  clearResetToken,
  sendResetTokenEmail,
} from "./resetToken";
import { getDb } from "./db";
import { eq } from "drizzle-orm";
import { users } from "../drizzle/schema";

export function registerResetRoutes(app: Express) {
  /**
   * Request password reset token
   * POST /api/auth/forgot-password
   * Body: { email: string }
   */
  app.post("/api/auth/forgot-password", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "邮箱不能为空" });
      }

      // Check if user exists
      const user = await getUserByEmail(email);
      if (!user) {
        // For security, don't reveal if email exists or not
        return res.json({
          success: true,
          message: "如果该邮箱已注册，您将收到密码重置链接",
        });
      }

      // Generate reset token
      const token = generateResetToken();

      // Save token to database
      const saved = await saveResetToken(email, token);
      if (!saved) {
        return res.status(500).json({ message: "生成重置链接失败，请稍后重试" });
      }

      // Send email with token
      const sent = await sendResetTokenEmail(email, token);
      if (!sent) {
        console.warn("[Reset Routes] Failed to send email, but token was saved");
      }

      return res.json({
        success: true,
        message: "如果该邮箱已注册，您将收到密码重置链接",
        // For testing purposes, return token (remove in production)
        token: process.env.NODE_ENV === "development" ? token : undefined,
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      return res.status(500).json({ message: "请求失败，请稍后重试" });
    }
  });

  /**
   * Verify reset token
   * POST /api/auth/verify-reset-token
   * Body: { email: string, token: string }
   */
  app.post("/api/auth/verify-reset-token", async (req: Request, res: Response) => {
    try {
      const { email, token } = req.body;

      if (!email || !token) {
        return res.status(400).json({ message: "邮箱和验证码不能为空" });
      }

      // Verify token
      const isValid = await verifyResetToken(email, token);
      if (!isValid) {
        return res.status(400).json({ message: "验证码无效或已过期" });
      }

      return res.json({ success: true, message: "验证码有效" });
    } catch (error) {
      console.error("Verify reset token error:", error);
      return res.status(500).json({ message: "验证失败，请稍后重试" });
    }
  });

  /**
   * Reset password with token
   * POST /api/auth/reset-password
   * Body: { email: string, token: string, newPassword: string }
   */
  app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
    try {
      const { email, token, newPassword } = req.body;

      if (!email || !token || !newPassword) {
        return res.status(400).json({ message: "邮箱、验证码和新密码不能为空" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: "密码长度至少为6位" });
      }

      // Verify token
      const isValid = await verifyResetToken(email, token);
      if (!isValid) {
        return res.status(400).json({ message: "验证码无效或已过期" });
      }

      // Hash new password
      const passwordHash = hashPassword(newPassword);

      // Update password in database
      const db = await getDb();
      if (!db) {
        return res.status(500).json({ message: "数据库连接失败" });
      }

      await db
        .update(users)
        .set({
          passwordHash,
        })
        .where(eq(users.email, email));

      // Clear reset token
      await clearResetToken(email);

      return res.json({ success: true, message: "密码重置成功，请使用新密码登录" });
    } catch (error) {
      console.error("Reset password error:", error);
      return res.status(500).json({ message: "重置失败，请稍后重试" });
    }
  });
}
