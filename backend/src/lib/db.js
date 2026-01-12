import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.js";
dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl: connectionString?.includes("neon.tech")
    ? { rejectUnauthorized: false }
    : undefined,
});

export const db = drizzle(pool, { schema });

// Fermeture propre
process.on("beforeExit", async () => {
  await pool.end();
});
