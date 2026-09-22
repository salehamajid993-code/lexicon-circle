import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Pool } = pg;
let pool: pg.Pool | null = null;

export function getPool() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  return pool;
}

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(text: string, params?: unknown[]) {
  const p = getPool();
  return p.query<T>(text, params);
}

export async function runMigrations() {
  const filename = fileURLToPath(import.meta.url);
  const migrationPath = path.resolve(path.dirname(filename), "migrations/001_initial.sql");
  await query(await readFile(migrationPath, "utf8"));
}

export async function closePool() { 
  await pool?.end(); 
  pool = null; 
}