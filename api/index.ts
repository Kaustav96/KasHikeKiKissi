import "dotenv/config";
import express from "express";
import { registerRoutes } from "../server/routes";
import { serveStatic } from "../server/static";

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

// Register API routes
registerRoutes(app);

// Serve static files in production
serveStatic(app);

// Export the Express app for Vercel
export default app;
