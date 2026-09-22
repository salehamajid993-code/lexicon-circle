import { createHash, createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { Request, Response, NextFunction } from "express";
import { query } from "./db";

const scrypt = promisify(scryptCallback);
const COOKIE = "lexicon_admin_session";
const DAY = 24 * 60 * 60 * 1000;
function secret() { return process.env.ADMIN_SESSION_SECRET || process.env.JWT_SECRET || ""; }
export async function hashPassword(password: string) { const salt = randomBytes(16).toString("hex"); const derived = await scrypt(password, salt, 64) as Buffer; return `scrypt:${salt}:${derived.toString("hex")}`; }
export async function verifyPassword(password: string, encoded: string) { const [, salt, hash] = encoded.split(":"); if (!salt || !hash) return false; const actual = await scrypt(password, salt, 64) as Buffer; const expected = Buffer.from(hash, "hex"); return actual.length === expected.length && timingSafeEqual(actual, expected); }
function tokenSignature(value: string) { return createHmac("sha256", secret()).update(value).digest("base64url"); }
function cookieValue(token: string) { return `${token}.${tokenSignature(token)}`; }
function tokenHash(token: string) { return createHash("sha256").update(token).digest("hex"); }
function parseCookies(header: string | undefined) { return Object.fromEntries((header ?? "").split(";").map((part) => part.trim().split("=")).filter(([key, value]) => key && value)); }
export async function createAdminSession(adminId: string, res: Response) { if (!secret()) throw new Error("ADMIN_SESSION_SECRET is not configured"); const token = randomBytes(32).toString("base64url"); await query("INSERT INTO admin_sessions (admin_user_id, token_hash, expires_at) VALUES ($1,$2,$3)", [adminId, tokenHash(token), new Date(Date.now() + DAY)]); const secure = process.env.NODE_ENV === "production" ? "; Secure" : ""; res.setHeader("Set-Cookie", `${COOKIE}=${cookieValue(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${DAY / 1000}${secure}`); }
export async function clearAdminSession(req: Request, res: Response) { const token = parseCookies(req.headers.cookie)[COOKIE]?.split(".")[0]; if (token) await query("DELETE FROM admin_sessions WHERE token_hash = $1", [tokenHash(token)]); res.setHeader("Set-Cookie", `${COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`); }
export type AdminRequest = Request & { admin?: { id: string; email: string; role: "ADMIN" | "EDITOR" } };
export async function loadAdmin(req: AdminRequest) { const token = parseCookies(req.headers.cookie)[COOKIE]?.split("."); if (!token || token.length !== 2 || !secret()) return null; const expected = tokenSignature(token[0]); if (expected !== token[1]) return null; const result = await query<{ id: string; email: string; role: "ADMIN" | "EDITOR" }>("SELECT u.id, u.email, u.role FROM admin_sessions s JOIN admin_users u ON u.id=s.admin_user_id WHERE s.token_hash=$1 AND s.expires_at > now() AND u.status='ACTIVE'", [tokenHash(token[0])]); return result.rows[0] ?? null; }
export function requireAdmin(req: AdminRequest, res: Response, next: NextFunction) { loadAdmin(req).then((admin) => { if (!admin) return res.status(401).json({ code: "UNAUTHORIZED", message: "Administrator sign-in is required." }); req.admin = admin; next(); }).catch(() => res.status(503).json({ code: "DATABASE_UNAVAILABLE", message: "Admin service is temporarily unavailable." })); }
