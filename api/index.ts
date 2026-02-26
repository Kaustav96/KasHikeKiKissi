import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "path";
import fs from "fs";
import { registerRoutes } from "../server/routes";
import { seedDatabase } from "../server/seed";

const app = express();
const httpServer = createServer(app);

app.use(
  express.json({
    limit: '50mb',
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Initialize database (seed if needed)
let dbInitialized = false;
async function initializeDatabase() {
  if (!dbInitialized) {
    try {
      console.log("[API] DATABASE_URL exists:", !!process.env.DATABASE_URL);
      console.log("[API] NODE_ENV:", process.env.NODE_ENV);
      await seedDatabase();
      dbInitialized = true;
      console.log("[API] Database initialized successfully");
    } catch (error) {
      console.error("[API] Database initialization error:", error);
      // Don't block requests even if seeding fails
      dbInitialized = true;
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

// Register API routes with httpServer
registerRoutes(httpServer, app);

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
