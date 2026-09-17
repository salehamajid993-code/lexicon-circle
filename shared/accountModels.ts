export type AccountRole = "PARENT" | "ADMIN";
export type AccountStatus = "ACTIVE" | "INACTIVE" | "PENDING";
export type ChildProfileStatus = "ACTIVE" | "ARCHIVED";
export type AssessmentStatus = "NOT_STARTED" | "IN_PROGRESS" | "SUBMITTED" | "PROCESSING" | "ASSESSED" | "ERROR";

export type UserAccount = { id: string; email: string; role: AccountRole; createdAt: string; updatedAt: string; status: AccountStatus };
export type ChildProfile = { id: string; parentAccountId: string; displayName: string; ageGroup?: string; grade?: string; avatar?: string; createdAt: string; updatedAt: string; status: ChildProfileStatus };
export type PointsTransaction = { id: string; childProfileId: string; sourceType: "GAME" | "WRITING" | "BONUS"; sourceId: string; points: number; createdAt: string };
export type ActivityEvent = { id: string; childProfileId: string; type: "GAME_COMPLETED" | "POINTS_EARNED" | "BADGE_UNLOCKED" | "WRITING_SUBMITTED" | "ASSESSMENT_RECEIVED"; label: string; createdAt: string };
export type WritingPrompt = { id: string; title: string; instruction: string; targetWords: string[]; timeLimitSeconds?: number; autoSubmitOnTimeout?: boolean; minimumWords?: number; maximumWords?: number; difficulty: "Easy" | "Medium" | "Difficult"; ageGroup?: string; grade?: string; enabled: boolean };
export type WritingSubmission = { id: string; childProfileId: string; promptId: string; content: string; wordCount: number; targetWordsUsed: string[]; targetWordsMissed: string[]; startedAt: string; submittedAt?: string; timeSpentSeconds: number; assessmentStatus: AssessmentStatus; assessmentId?: string };
export type AssessmentRubricItem = { score: number; feedback: string };
export type WritingAssessment = { id: string; submissionId: string; assessmentVersion: string; assessmentProvider: string; assessmentModel: string; grammar: AssessmentRubricItem; vocabulary: AssessmentRubricItem; sentenceStructure: AssessmentRubricItem; spelling: AssessmentRubricItem; coherence: AssessmentRubricItem; creativity: AssessmentRubricItem; targetWordUsage: AssessmentRubricItem; overallScore: number; strengths: string[]; improvements: string[]; encouragement: string; createdAt: string };
export type Reward = { id: string; title: string; description: string; pointsRequired: number; enabled: boolean; redemptionEnabled: boolean };
export type SessionUser = { accountId: string; role: AccountRole; expiresAt: string };

export type AccountApiError = { code: "AUTH_NOT_CONFIGURED" | "UNAUTHORIZED" | "INVALID_INPUT" | "NOT_FOUND" | "ASSESSMENT_UNAVAILABLE" | "ASSESSMENT_INVALID"; message: string };
