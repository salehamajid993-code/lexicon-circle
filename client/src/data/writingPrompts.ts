import type { WritingPrompt } from "../../../shared/accountModels";

export const writingPrompts: WritingPrompt[] = [{ id: "lantern-journey", title: "The Lantern Journey", instruction: "Write a short story about a journey guided by a mysterious lantern.", targetWords: ["forest", "mysterious", "lantern", "whisper", "journey"], timeLimitSeconds: 600, autoSubmitOnTimeout: false, minimumWords: 20, maximumWords: 500, difficulty: "Difficult", enabled: true }];
