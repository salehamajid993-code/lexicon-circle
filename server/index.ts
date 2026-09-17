import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";
import { assessWriting, writingPrompts } from "./writingAssessmentService";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);
  app.use(express.json({ limit: "100kb" }));
  const staticPath = process.env.NODE_ENV === "production" ? path.resolve(__dirname, "public") : path.resolve(__dirname, "..", "dist", "public");
  const requestCounts = new Map<string, { count: number; resetAt: number }>();
  const rateLimit = (limit: number, windowMs: number) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const key = `${req.ip ?? "unknown"}:${req.path}`;
    const now = Date.now();
    const current = requestCounts.get(key);
    if (!current || current.resetAt <= now) requestCounts.set(key, { count: 1, resetAt: now + windowMs });
    else if (current.count >= limit) return res.status(429).json({ code: "RATE_LIMITED", message: "Please wait a moment and try again." });
    else current.count += 1;
    next();
  };
  const authConfigured = () => Boolean(process.env.DATABASE_URL && process.env.JWT_SECRET);
  const adminConfigured = () => Boolean(authConfigured() && process.env.ADMIN_SESSION_SECRET);

  app.get("/robots.txt", (_req, res) => res.type("text/plain").send("User-agent: *\nAllow: /\nDisallow: /account\nDisallow: /admin\nDisallow: /learning-zone/writing/history\nDisallow: /api/\n"));
  app.get("/api/health", (_req, res) => res.json({ ok: true, authConfigured: authConfigured(), adminConfigured: adminConfigured(), assessmentConfigured: Boolean(process.env.BUILT_IN_FORGE_API_URL && process.env.BUILT_IN_FORGE_API_KEY) }));
  app.get("/api/auth/status", (_req, res) => res.json({ authenticated: false, configured: authConfigured(), message: "Secure account authentication is not configured in this environment." }));
  app.get("/api/admin/status", (_req, res) => res.json({ authorized: false, configured: adminConfigured(), message: "Secure admin storage and authorization are not configured in this environment." }));
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!adminConfigured()) return res.status(503).json({ code: "ADMIN_NOT_CONFIGURED", message: "Admin tools are not configured yet. No content change was made." });
    return res.status(503).json({ code: "ADMIN_NOT_CONFIGURED", message: "The server-side administrator session verifier is not connected. No content change was made." });
  };
  app.get("/api/admin/dashboard", requireAdmin, (_req, res) => res.json({ metrics: null, message: "No admin data store is connected." }));
  app.get("/api/admin/content/:section", requireAdmin, (_req, res) => res.json({ records: [], message: "No admin content store is connected." }));
  app.post("/api/admin/content/:section", rateLimit(20, 60_000), requireAdmin, (_req, res) => res.status(501).json({ code: "ADMIN_NOT_CONFIGURED", message: "Content changes require a connected, authorized data store." }));
  app.post("/api/admin/content/:section/:id/publish", rateLimit(20, 60_000), requireAdmin, (_req, res) => res.status(501).json({ code: "ADMIN_NOT_CONFIGURED", message: "Publishing requires a connected, authorized data store." }));
  app.get("/api/writing/prompts", (_req, res) => res.json({ prompts: writingPrompts.filter((prompt) => prompt.enabled) }));
  app.post("/api/writing/assess", rateLimit(5, 60_000), async (req, res) => {
    const parsed = z.object({ submissionId: z.string().min(1).max(120), promptId: z.string().min(1).max(120), content: z.string().min(1).max(10000), configuredLevel: z.string().max(80).optional() }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ code: "INVALID_INPUT", message: "Please check the story details and try again." });
    const prompt = writingPrompts.find((item) => item.id === parsed.data.promptId);
    if (!prompt) return res.status(404).json({ code: "NOT_FOUND", message: "That writing prompt is no longer available." });
    if (!process.env.BUILT_IN_FORGE_API_URL || !process.env.BUILT_IN_FORGE_API_KEY) return res.status(503).json({ code: "ASSESSMENT_UNAVAILABLE", message: "Your story is safe, but feedback service is not configured yet." });
    try { const result = await assessWriting({ prompt, content: parsed.data.content, configuredLevel: parsed.data.configuredLevel }, parsed.data.submissionId); return result.status === "ASSESSED" ? res.json(result) : res.status(502).json({ code: "ASSESSMENT_INVALID", message: result.message }); } catch { return res.status(502).json({ code: "ASSESSMENT_INVALID", message: "We couldn't prepare your feedback this time. Please try again." }); }
  });
  app.use(express.static(staticPath));
  app.get("*", (_req, res) => res.sendFile(path.join(staticPath, "index.html")));
  const port = process.env.PORT || 3000;
  server.listen(port, () => console.log(`Server running on http://localhost:${port}/`));
}
startServer().catch(console.error);
