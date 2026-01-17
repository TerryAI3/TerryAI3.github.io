import express, { Express, Request, Response } from "express";
import { getSessionCookieOptions } from "./_core/cookies";
import { hashPassword, verifyPassword } from "./auth";
import { getUserByEmail, createEmailUser } from "./db";

const COOKIE_NAME = "session";

export function registerAuthRoutes(app: Express) {
  // Login endpoint
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "邮箱和密码不能为空" });
      }

      // Find user by email
      const user = await getUserByEmail(email);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ message: "邮箱或密码错误" });
      }

      // Verify password
      if (!verifyPassword(password, user.passwordHash)) {
        return res.status(401).json({ message: "邮箱或密码错误" });
      }

      // Set session cookie
      const sessionData = JSON.stringify({
        userId: user.id,
        email: user.email,
        role: user.role,
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionData, cookieOptions);

      return res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "登录失败，请稍后重试" });
    }
  });

  // Register endpoint
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "邮箱和密码不能为空" });
      }

      // Check if user already exists
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "该邮箱已被注册" });
      }

      // Hash password
      const passwordHash = hashPassword(password);

      // Create user
      await createEmailUser({
        email,
        name,
        passwordHash,
        role: "user",
      });

      return res.json({ success: true, message: "注册成功，请登录" });
    } catch (error) {
      console.error("Register error:", error);
      return res.status(500).json({ message: "注册失败，请稍后重试" });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return res.json({ success: true });
  });
}
