import { query, closePool } from "./db";
import { hashPassword } from "./adminAuth";

async function main() {
  const [email, password] = process.argv.slice(2);
  if (!email || !password || password.length < 8) { console.error("Usage: pnpm admin:create -- email@example.com strong-password"); process.exit(1); }
  if (!process.env.DATABASE_URL) { console.error("DATABASE_URL is not configured."); process.exit(1); }
  const passwordHash = await hashPassword(password);
  await query("INSERT INTO admin_users(email,password_hash) VALUES($1,$2) ON CONFLICT(email) DO UPDATE SET password_hash=EXCLUDED.password_hash,status='ACTIVE',updated_at=now()", [email, passwordHash]);
  console.log("Administrator account created or updated.");
  await closePool();
}
main().catch((error) => { console.error("Administrator bootstrap failed:", error instanceof Error ? error.message : "unknown error"); process.exitCode = 1; });
