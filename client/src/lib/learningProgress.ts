import type { GameAttempt, UserProgress, WritingSubmission } from "../data/learningGameData";

const STORAGE_KEY = "lexicon-circle-learning-progress-v2";
const emptyProgress = (): UserProgress => ({ totalPoints: 0, completedGames: [], attempts: [], writingActivities: 0, badges: [] });

export function readDemoProgress(): UserProgress {
  if (typeof window === "undefined") return emptyProgress();
  try { const stored = window.sessionStorage.getItem(STORAGE_KEY); return stored ? { ...emptyProgress(), ...JSON.parse(stored) } : emptyProgress(); } catch { return emptyProgress(); }
}

function writeDemoProgress(progress: UserProgress) { try { window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch { /* demo mode remains session-only */ } }

export function recordAttempt(attempt: GameAttempt): UserProgress {
  const current = readDemoProgress();
  if (current.attempts.some((item) => item.id === attempt.id)) return current;
  const next = { ...current, totalPoints: current.totalPoints + attempt.points, attempts: [...current.attempts, attempt], completedGames: current.completedGames.includes(attempt.gameId) ? current.completedGames : [...current.completedGames, attempt.gameId] };
  writeDemoProgress(next);
  return next;
}

export function recordWriting(submission: WritingSubmission): UserProgress {
  const current = readDemoProgress();
  const next = { ...current, writingActivities: current.writingActivities + (submission.status === "SUBMITTED" ? 1 : 0), totalPoints: current.totalPoints + (submission.status === "SUBMITTED" ? 50 : 0) };
  writeDemoProgress(next);
  return next;
}

export function getLevel(points: number) { return Math.min(5, Math.floor(points / 100) + 1); }
export function getLevelName(level: number) { return ["Story Starter", "Word Explorer", "Sentence Builder", "Story Maker", "Word Wizard"][Math.max(0, Math.min(4, level - 1))]; }
export function clearDemoProgress() { if (typeof window !== "undefined") window.sessionStorage.removeItem(STORAGE_KEY); }
