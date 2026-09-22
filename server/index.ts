import express from "express";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { assessWriting, writingPrompts } from "./writingAssessmentService";
import { query, runMigrations } from "./db";
import {
  clearAdminSession,
  createAdminSession,
  hashPassword,
  loadAdmin,
  requireAdmin,
  verifyPassword,
  type AdminRequest,
} from "./adminAuth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sectionSchema = z.enum([
  "programs",
  "camps",
  "testimonials",
  "faqs",
  "featured",
  "videos",
  "word-of-week",
  "book-of-month",
  "games",
  "questions",
  "vocabulary",
  "etymology",
  "writing-prompts",
  "points",
  "levels",
  "badges",
  "rewards",
  "site-content",
  "children",
  "settings"
]);

const contentSchema = z.object({
  title: z.string().trim().min(1).max(180),
  slug: z.string().trim().max(180).optional(),
  status: z
    .enum(["DRAFT", "REVIEW", "PUBLISHED", "DISABLED", "ARCHIVED"])
    .default("DRAFT"),
  payload: z.record(z.string(), z.unknown()).default({}),
});

const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(200),
});

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "100kb" }));

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  const requestCounts = new Map<
    string,
    { count: number; resetAt: number }
  >();

  const rateLimit =
    (limit: number, windowMs: number) =>
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      const key = `${req.ip ?? "unknown"}:${req.path}`;
      const now = Date.now();
      const current = requestCounts.get(key);

      if (!current || current.resetAt <= now) {
        requestCounts.set(key, {
          count: 1,
          resetAt: now + windowMs,
        });
      } else if (current.count >= limit) {
        return res.status(429).json({
          code: "RATE_LIMITED",
          message: "Please wait a moment and try again.",
        });
      } else {
        current.count += 1;
      }

      next();
    };

  const configured = () =>
    Boolean(
      process.env.DATABASE_URL &&
        process.env.JWT_SECRET &&
        process.env.ADMIN_SESSION_SECRET,
    );

  const safeDb = async <T>(
    work: () => Promise<T>,
    res: express.Response,
  ) => {
    try {
      return await work();
    } catch {
      res.status(503).json({
        code: "DATABASE_UNAVAILABLE",
        message: "This service is temporarily unavailable.",
      });
      return null;
    }
  };

  app.get("/robots.txt", (_req, res) =>
    res
      .type("text/plain")
      .send(
        "User-agent: *\nAllow: /\nDisallow: /account\nDisallow: /admin\nDisallow: /learning-zone/writing/history\nDisallow: /api/\n",
      ),
  );

  app.get("/api/health", (_req, res) =>
    res.json({
      ok: true,
      configured: configured(),
      assessmentConfigured: Boolean(
        process.env.BUILT_IN_FORGE_API_URL &&
          process.env.BUILT_IN_FORGE_API_KEY,
      ),
    }),
  );

  app.post(
    "/api/admin/login",
    rateLimit(5, 15 * 60_000),
    async (req, res) => {
      const parsed = loginSchema.safeParse(req.body);

      if (!parsed.success || !configured()) {
        return res.status(401).json({
          code: "UNAUTHORIZED",
          message: "Invalid administrator credentials.",
        });
      }

      const result = await safeDb(
        () =>
          query<{
            id: string;
            email: string;
            role: "ADMIN" | "EDITOR";
            password_hash: string;
          }>(
            "SELECT id,email,role,password_hash FROM admin_users WHERE lower(email)=lower($1) AND status='ACTIVE'",
            [parsed.data.email],
          ),
        res,
      );

      if (!result) return;

      const user = result.rows[0];

      if (
        !user ||
        !(await verifyPassword(parsed.data.password, user.password_hash))
      ) {
        return res.status(401).json({
          code: "UNAUTHORIZED",
          message: "Invalid administrator credentials.",
        });
      }

      await createAdminSession(user.id, res);

      return res.json({
        authenticated: true,
        email: user.email,
        role: user.role,
      });
    },
  );

  app.post("/api/admin/logout", async (req, res) => {
    await safeDb(() => clearAdminSession(req, res), res);

    if (!res.headersSent) {
      res.json({ authenticated: false });
    }
  });

  app.get(
    "/api/admin/status",
    async (req: AdminRequest, res) => {
      if (!configured()) {
        return res.json({
          authenticated: false,
          configured: false,
          message:
            "Set the required server environment variables and run the migration.",
        });
      }

      const admin = await safeDb(() => loadAdmin(req), res);

      if (admin === null && res.headersSent) return;

      return res.json({
        authenticated: Boolean(admin),
        configured: true,
        email: admin?.email,
        role: admin?.role,
      });
    },
  );

  app.get(
    "/api/admin/dashboard",
    requireAdmin,
    async (_req: AdminRequest, res) => {
      const result = await safeDb(
        () =>
          query<{ section: string; count: string }>(
            "SELECT section, count(*)::text AS count FROM content_records GROUP BY section ORDER BY section",
          ),
        res,
      );

      if (!result) return;

      res.json({
        metrics: Object.fromEntries(
          result.rows.map((row) => [row.section, Number(row.count)]),
        ),
      });
    },
  );

  app.get(
    "/api/admin/content/:section",
    requireAdmin,
    async (req: AdminRequest, res) => {
      const section = sectionSchema.safeParse(req.params.section);

      if (!section.success) {
        return res.status(400).json({
          code: "INVALID_INPUT",
          message: "Unknown content section.",
        });
      }

      const result = await safeDb(
        () =>
          query(
            "SELECT id,section,slug,title,status,payload,version,created_at,updated_at,published_at FROM content_records WHERE section=$1 ORDER BY updated_at DESC",
            [section.data],
          ),
        res,
      );

      if (result) {
        res.json({ records: result.rows });
      }
    },
  );

  app.post(
    "/api/admin/content/:section",
    rateLimit(30, 60_000),
    requireAdmin,
    async (req: AdminRequest, res) => {
      const section = sectionSchema.safeParse(req.params.section);
      const body = contentSchema.safeParse(req.body);

      if (!section.success || !body.success) {
        return res.status(400).json({
          code: "INVALID_INPUT",
          message: "Please check the content fields.",
        });
      }

      const result = await safeDb(
        () =>
          query(
            "INSERT INTO content_records(section,slug,title,status,payload,created_by,updated_by,published_at) VALUES($1,$2,$3,$4,$5,$6,$6,$7) RETURNING *",
            [
              section.data,
              body.data.slug || null,
              body.data.title,
              body.data.status,
              body.data.payload,
              req.admin?.id,
              body.data.status === "PUBLISHED" ? new Date() : null,
            ],
          ),
        res,
      );

      if (result) {
        res.status(201).json({ record: result.rows[0] });
      }
    },
  );

  app.put(
    "/api/admin/content/:section/:id",
    rateLimit(30, 60_000),
    requireAdmin,
    async (req: AdminRequest, res) => {
      const section = sectionSchema.safeParse(req.params.section);
      const body = contentSchema.partial().safeParse(req.body);

      if (
        !section.success ||
        !body.success ||
        !z.string().uuid().safeParse(req.params.id).success
      ) {
        return res.status(400).json({
          code: "INVALID_INPUT",
          message: "Please check the content fields.",
        });
      }

      const fields: string[] = [];
      const values: unknown[] = [];

      for (const [key, value] of Object.entries(body.data)) {
        const column = key === "payload" ? "payload" : key;
        fields.push(`${column}=$${values.length + 1}`);
        values.push(value);
      }

      if (!fields.length) {
        return res.status(400).json({
          code: "INVALID_INPUT",
          message: "No changes were submitted.",
        });
      }

      values.push(req.admin?.id, section.data, req.params.id);

      const result = await safeDb(
        () =>
          query(
            `UPDATE content_records SET ${fields.join(",")}, updated_by=$${values.length - 2}, updated_at=now(), version=version+1 WHERE section=$${values.length - 1} AND id=$${values.length} RETURNING *`,
            values,
          ),
        res,
      );

      if (result && !result.rows[0]) {
        return res.status(404).json({
          code: "NOT_FOUND",
          message: "Content was not found.",
        });
      }

      if (result) {
        res.json({ record: result.rows[0] });
      }
    },
  );

  app.delete(
    "/api/admin/content/:section/:id",
    requireAdmin,
    async (req: AdminRequest, res) => {
      const section = sectionSchema.safeParse(req.params.section);

      if (
        !section.success ||
        !z.string().uuid().safeParse(req.params.id).success
      ) {
        return res.status(400).json({
          code: "INVALID_INPUT",
          message: "Invalid content identifier.",
        });
      }

      const result = await safeDb(
        () =>
          query(
            "UPDATE content_records SET status='ARCHIVED',updated_by=$1,updated_at=now(),version=version+1 WHERE section=$2 AND id=$3 RETURNING id",
            [req.admin?.id, section.data, req.params.id],
          ),
        res,
      );

      if (result && !result.rows[0]) {
        return res.status(404).json({
          code: "NOT_FOUND",
          message: "Content was not found.",
        });
      }

      if (result) {
        res.json({ archived: true });
      }
    },
  );

  app.post(
    "/api/admin/content/:section/:id/:action",
    requireAdmin,
    async (req: AdminRequest, res) => {
      const section = sectionSchema.safeParse(req.params.section);
      const action = z
        .enum(["publish", "unpublish"])
        .safeParse(req.params.action);

      if (!section.success || !action.success) {
        return res.status(400).json({
          code: "INVALID_INPUT",
          message: "Invalid publishing action.",
        });
      }

      const status =
        action.data === "publish" ? "PUBLISHED" : "DRAFT";

      const result = await safeDb(
        () =>
          query(
            "UPDATE content_records SET status=$1,published_at=$2,updated_by=$3,updated_at=now(),version=version+1 WHERE section=$4 AND id=$5 RETURNING *",
            [
              status,
              status === "PUBLISHED" ? new Date() : null,
              req.admin?.id,
              section.data,
              req.params.id,
            ],
          ),
        res,
      );

      if (result && !result.rows[0]) {
        return res.status(404).json({
          code: "NOT_FOUND",
          message: "Content was not found.",
        });
      }

      if (result) {
        res.json({ record: result.rows[0] });
      }
    },
  );

  app.get("/api/content/:section", async (req, res) => {
    const section = sectionSchema.safeParse(req.params.section);

    if (!section.success) {
      return res.status(400).json({
        code: "INVALID_INPUT",
        message: "Unknown content section.",
      });
    }

    const result = await safeDb(
      () =>
        query(
          "SELECT id,slug,title,payload FROM content_records WHERE section=$1 AND status='PUBLISHED' ORDER BY updated_at DESC",
          [section.data],
        ),
      res,
    );

    if (result) {
      res.json({ records: result.rows });
    }
  });

  app.get("/api/writing/prompts", (_req, res) =>
    res.json({
      prompts: writingPrompts.filter((prompt) => prompt.enabled),
    }),
  );

  app.post(
    "/api/writing/assess",
    rateLimit(5, 60_000),
    async (req, res) => {
      const parsed = z
        .object({
          submissionId: z.string().min(1).max(120),
          promptId: z.string().min(1).max(120),
          content: z.string().min(1).max(10000),
          configuredLevel: z.string().max(80).optional(),
        })
        .safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          code: "INVALID_INPUT",
          message: "Please check the story details and try again.",
        });
      }

      const prompt = writingPrompts.find(
        (item) => item.id === parsed.data.promptId,
      );

      if (!prompt) {
        return res.status(404).json({
          code: "NOT_FOUND",
          message: "That writing prompt is no longer available.",
        });
      }

      if (
        !process.env.BUILT_IN_FORGE_API_URL ||
        !process.env.BUILT_IN_FORGE_API_KEY
      ) {
        return res.status(503).json({
          code: "ASSESSMENT_UNAVAILABLE",
          message:
            "Your story is safe, but feedback service is not configured yet.",
        });
      }

      try {
        const result = await assessWriting(
          {
            prompt,
            content: parsed.data.content,
            configuredLevel: parsed.data.configuredLevel,
          },
          parsed.data.submissionId,
        );

        return result.status === "ASSESSED"
          ? res.json(result)
          : res.status(502).json({
              code: "ASSESSMENT_INVALID",
              message: result.message,
            });
      } catch {
        return res.status(502).json({
          code: "ASSESSMENT_INVALID",
          message:
            "We couldn't prepare your feedback this time. Please try again.",
        });
      }
    },
  );

  app.use(express.static(staticPath));

  app.get("*", (_req, res) =>
    res.sendFile(path.join(staticPath, "index.html")),
  );

  const port = Number(process.env.PORT || 3000);

  server.listen(port, "0.0.0.0", () => {
    console.log(
      `Server running on http://0.0.0.0:${port}/`,
    );
  });
}

startServer().catch((error) => {
  console.error(
    "Server failed to start:",
    error instanceof Error ? error.message : "unknown error",
  );
  process.exitCode = 1;
});

export { hashPassword };
export { runMigrations };