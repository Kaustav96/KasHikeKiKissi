import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../shared/schema.js";

// For serverless, use smaller pool and shorter timeouts
const isServerless = process.env.VERCEL === "1" || process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,

  // Serverless-optimized connection pool settings
  max: isServerless ? 1 : 5, // 1 connection for serverless, 5 for traditional
  idleTimeoutMillis: isServerless ? 1000 : 10000, // Quick cleanup for serverless
  connectionTimeoutMillis: isServerless ? 3000 : 5000,
  statement_timeout: isServerless ? 5000 : 10000, // 5s for serverless, 10s for traditional
  
  // Prevent connection leaks in serverless
  allowExitOnIdle: isServerless,
});

pool.on("error", (err) => {
  console.error("Unexpected PG Pool Error:", err);
});

pool.on("connect", () => {
  console.log("[DB] Connected to database");
});

export const db = drizzle(pool, { schema });