import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import { storage } from "../server/storage";
import { requireAdmin, setAuthCookie, clearAuthCookie } from "../server/middleware/auth";
import { rsvpSubmitSchema, publicRsvpSchema } from "../shared/schema";
import { sendRsvpConfirmation } from "../server/services/whatsapp";
import { verifyWebhookSignature } from "../server/services/whatsapp";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { randomUUID } from "crypto";

const app = express();

app.use(
  express.json({
    limit: '50mb',
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());

// Initialize database (seed if needed)
let dbInitialized = false;
async function initializeDatabase() {
  if (!dbInitialized) {
    try {
      console.log("[API] Initializing database...");
      const { seedDatabase } = await import("../server/seed");
      await seedDatabase();
      dbInitialized = true;
      console.log("[API] Database initialized successfully");
    } catch (error) {
      console.error("[API] Database initialization error:", error);
      dbInitialized = true; // Mark as initialized to prevent retry loops
    }
  }
}

// Initialize on first request
app.use(async (_req, _res, next) => {
  try {
    await initializeDatabase();
  } catch (error) {
    console.error("[API] Middleware initialization error:", error);
  }
  next();
});

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    dbInitialized,
    hasDbUrl: !!process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV
  });
});

// Public API routes
app.get("/api/config", async (_req, res) => {
  try {
    const config = await storage.getWeddingConfig();
    if (!config) return res.status(404).json({ error: "Config not found" });
    const { adminPasswordHash, ...publicConfig } = config;
    res.json(publicConfig);
  } catch (error) {
    console.error("Config error:", error);
    res.status(500).json({ error: "Failed to fetch config" });
  }
});

app.get("/api/events", async (_req, res) => {
  try {
    const events = await storage.getWeddingEvents();
    res.json(events);
  } catch (error) {
    console.error("Events error:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.get("/api/stories", async (_req, res) => {
  try {
    const stories = await storage.getStoryMilestones();
    res.json(stories);
  } catch (error) {
    console.error("Stories error:", error);
    res.status(500).json({ error: "Failed to fetch stories" });
  }
});

app.get("/api/faqs", async (_req, res) => {
  try {
    const faqs = await storage.getFaqs();
    res.json(faqs);
  } catch (error) {
    console.error("FAQs error:", error);
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
});

// Admin login
app.post("/api/admin/login", async (req, res) => {
  try {
    const schema = z.object({ username: z.string(), password: z.string() });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid credentials" });

    const user = await storage.getUserByUsername(parsed.data.username);
    if (!user || !(await bcrypt.compare(parsed.data.password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    setAuthCookie(res, { userId: user.id, username: user.username });
    res.json({ success: true, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Serve static files for Vercel
const distPath = path.join(process.cwd(), "dist", "public");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // Serve index.html for all non-API routes
  app.get("*", (_req, res) => {
    const indexPath = path.join(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Not found");
    }
  });
}

// Export the Express app for Vercel
export default app;
