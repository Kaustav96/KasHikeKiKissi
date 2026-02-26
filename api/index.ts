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
      await seedDatabase();
      dbInitialized = true;
      console.log("[API] Database initialized successfully");
    } catch (error) {
      console.error("[API] Database initialization error:", error);
    }
  }
}

// Initialize on first request
app.use(async (_req, _res, next) => {
  await initializeDatabase();
  next();
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
