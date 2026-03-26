import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { registerRoutes } from "../server/routes.js";

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

// Track initialization status
let initPromise: Promise<void> | null = null;

async function initialize() {
  if (!initPromise) {
    initPromise = (async () => {
      try {
        console.log("[API] Initializing serverless function...");
        console.log("[API] DATABASE_URL present:", !!process.env.DATABASE_URL);
        console.log("[API] NODE_ENV:", process.env.NODE_ENV);
        
        // Seed database
        const { seedDatabase } = await import("../server/seed.js");
        await seedDatabase();
        console.log("[API] Database seeded successfully");
        
        // Register all routes
        const httpServer = createServer(app);
        await registerRoutes(httpServer, app);
        console.log("[API] All routes registered successfully");
      } catch (error) {
        console.error("[API] Initialization error:", error);
        throw error;
      }
    })();
  }
  return initPromise;
}

// Initialize on module load (serverless warm-up)
initialize().catch(err => {
  console.error("[API] Failed to initialize:", err);
});

// Health check endpoint (available immediately)
app.get("/api/health", async (_req, res) => {
  try {
    await initialize();
    res.json({
      status: "ok",
      hasDbUrl: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
      hasDbUrl: !!process.env.DATABASE_URL,
    });
  }
});

// Wait for initialization before processing any request
app.use(async (req, res, next) => {
  try {
    await initialize();
    next();
  } catch (error) {
    console.error("[API] Request blocked due to initialization failure:", error);
    res.status(503).json({ 
      error: "Service temporarily unavailable",
      message: error instanceof Error ? error.message : "Server initialization failed"
    });
  }
});

// Serve static files for non-API routes
const distPath = path.join(process.cwd(), "dist", "public");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // Serve index.html for all non-API routes (SPA fallback)
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
