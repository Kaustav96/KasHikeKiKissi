import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../shared/schema.js";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,

  // Connection pool settings
  max: 5, // limit concurrent connections
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
  // Add statement timeout to prevent hanging queries
  statement_timeout: 10000, // 10 seconds
});

pool.on("error", (err) => {
  console.error("Unexpected PG Pool Error:", err);
});

pool.on("connect", () => {
  console.log("[DB] Connected to database");
});

export const db = drizzle(pool, { schema });