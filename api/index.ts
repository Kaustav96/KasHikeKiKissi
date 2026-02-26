import "dotenv/config";
import express from "express";
import { createServer } from "http";
import path from "path";
import fs from "fs";
import { registerRoutes } from "../server/routes";

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
