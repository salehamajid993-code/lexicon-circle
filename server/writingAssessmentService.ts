import { z } from "zod";
import type { WritingAssessment, WritingPrompt, WritingSubmission } from "../shared/accountModels";

const rubricItem = z.object({ score: z.number().min(0).max(10), feedback: z.string().min(1).max(500) });
const assessmentShape = z.object({ grammar: rubricItem, vocabulary: rubricItem, sentenceStructure: rubricItem, spelling: rubricItem, coherence: rubricItem, creativity: rubricItem, targetWordUsage: rubricItem, strengths: z.array(z.string().min(1).max(240)).max(5), improvements: z.array(z.string().min(1).max(240)).max(5), encouragement: z.string().min(1).max(500) });

export const writingPrompts: WritingPrompt[] = [{ id: "lantern-journey", title: "The Lantern Journey", instruction: "Write a short story about a journey guided by a mysterious lantern.", targetWords: ["forest", "mysterious", "lantern", "whisper", "journey"], timeLimitSeconds: 600, autoSubmitOnTimeout: false, minimumWords: 20, maximumWords: 500, difficulty: "Difficult", enabled: true }];

export type AssessmentRequest = { prompt: WritingPrompt; content: string; configuredLevel?: string };
export type AssessmentResult = { status: "ASSESSED"; assessment: WritingAssessment } | { status: "ERROR" | "UNAVAILABLE"; message: string };

function scoreFromRubric(values: number[]) { return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10; }
function findTargetWords(content: string, targetWords: string[]) { const words = content.toLocaleLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) ?? []; const wordSet = new Set(words); return { used: targetWords.filter((word) => wordSet.has(word.toLocaleLowerCase())), missed: targetWords.filter((word) => !wordSet.has(word.toLocaleLowerCase())) }; }

export function buildAssessmentPrompt({ prompt, content, configuredLevel }: AssessmentRequest) {
  return `Assess this child writing using only the provided educational context. Return JSON matching the requested schema. Use supportive, age-appropriate language. Do not identify the child or infer personal information. Prompt: ${prompt.instruction}\nTarget words: ${prompt.targetWords.join(", ")}\nConfigured level: ${configuredLevel ?? "not configured"}\nWriting:\n${content}`;
}

export async function assessWriting(request: AssessmentRequest, submissionId: string): Promise<AssessmentResult> {
  const apiUrl = process.env.BUILT_IN_FORGE_API_URL;
  const apiKey = process.env.BUILT_IN_FORGE_API_KEY;
  if (!apiUrl || !apiKey) return { status: "UNAVAILABLE", message: "Assessment service is not configured yet. Your writing can be saved and assessed later." };
  const response = await fetch(`${apiUrl.replace(/\/$/, "")}/v1/chat/completions`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` }, body: JSON.stringify({ model: process.env.WRITING_ASSESSMENT_MODEL || "gpt-5-mini", messages: [{ role: "system", content: "You provide supportive AI-assisted writing feedback. Return JSON only." }, { role: "user", content: buildAssessmentPrompt(request) }], response_format: { type: "json_schema", json_schema: { name: "writing_assessment", strict: true, schema: { type: "object", properties: { grammar: { type: "object", properties: { score: { type: "number" }, feedback: { type: "string" } }, required: ["score", "feedback"], additionalProperties: false }, vocabulary: { type: "object", properties: { score: { type: "number" }, feedback: { type: "string" } }, required: ["score", "feedback"], additionalProperties: false }, sentenceStructure: { type: "object", properties: { score: { type: "number" }, feedback: { type: "string" } }, required: ["score", "feedback"], additionalProperties: false }, spelling: { type: "object", properties: { score: { type: "number" }, feedback: { type: "string" } }, required: ["score", "feedback"], additionalProperties: false }, coherence: { type: "object", properties: { score: { type: "number" }, feedback: { type: "string" } }, required: ["score", "feedback"], additionalProperties: false }, creativity: { type: "object", properties: { score: { type: "number" }, feedback: { type: "string" } }, required: ["score", "feedback"], additionalProperties: false }, targetWordUsage: { type: "object", properties: { score: { type: "number" }, feedback: { type: "string" } }, required: ["score", "feedback"], additionalProperties: false }, strengths: { type: "array", items: { type: "string" } }, improvements: { type: "array", items: { type: "string" } }, encouragement: { type: "string" } }, required: ["grammar", "vocabulary", "sentenceStructure", "spelling", "coherence", "creativity", "targetWordUsage", "strengths", "improvements", "encouragement"], additionalProperties: false } } } }) });
  if (!response.ok) return { status: "ERROR", message: "We couldn't prepare your feedback this time. Please try again." };
  const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  let parsed: unknown;
  try { parsed = JSON.parse(payload.choices?.[0]?.message?.content ?? ""); } catch { return { status: "ERROR", message: "We couldn't prepare your feedback this time. Please try again." }; }
  const validated = assessmentShape.safeParse(parsed);
  if (!validated.success) return { status: "ERROR", message: "We couldn't prepare your feedback this time. Please try again." };
  const targetWords = findTargetWords(request.content, request.prompt.targetWords);
  const scores = Object.values(validated.data).filter((value): value is { score: number; feedback: string } => typeof value === "object" && value !== null && "score" in value).map((value) => value.score);
  return { status: "ASSESSED", assessment: { id: `assessment-${submissionId}`, submissionId, assessmentVersion: "v1-configurable", assessmentProvider: "server-assessment-service", assessmentModel: process.env.WRITING_ASSESSMENT_MODEL || "configured-model", ...validated.data, overallScore: scoreFromRubric(scores), createdAt: new Date().toISOString(), targetWordUsage: { ...validated.data.targetWordUsage, feedback: `${validated.data.targetWordUsage.feedback} Used: ${targetWords.used.length}/${request.prompt.targetWords.length}.` } } };
}
