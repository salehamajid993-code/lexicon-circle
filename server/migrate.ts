import { runMigrations, closePool } from "./db";

runMigrations().then(() => { console.log("Database migrations applied."); return closePool(); }).catch((error) => { console.error("Migration failed:", error instanceof Error ? error.message : "unknown error"); process.exitCode = 1; });
