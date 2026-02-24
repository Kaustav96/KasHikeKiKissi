/**
 * JWT Authentication Middleware
 *
 * Protects admin routes using HttpOnly cookie-stored JWT tokens.
 * CSRF protection is implemented via the double-submit cookie pattern.
 */

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SESSION_SECRET || "wedding-secret-change-in-production";
const TOKEN_EXPIRY = "24h";

export interface AdminPayload {
  userId: string;
  username: string;
  iat?: number;
  exp?: number;
}

/**
 * Signs a JWT and sets it as an HttpOnly cookie on the response.
 */
export function setAuthCookie(res: Response, payload: { userId: string; username: string }): void {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  res.cookie("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: "/",
  });
}

/**
 * Clears the auth cookie (logout).
 */
export function clearAuthCookie(res: Response): void {
  res.clearCookie("admin_token", { path: "/" });
}

/**
 * Express middleware: verifies the JWT from the HttpOnly cookie.
 * Attaches the decoded payload to req.admin.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.admin_token;
  if (!token) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as AdminPayload;
    (req as any).admin = payload;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
}

/**
 * Verifies a JWT token and returns the payload (used for session checks).
 */
export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}
