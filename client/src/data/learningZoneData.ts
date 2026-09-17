import type { IllustrationIcon } from "../components/Illustrations";
import type { Tone } from "./siteData";
import { playableGames } from "./learningGameData";

export type LearningCategory = {
  label: string;
  description: string;
  icon: IllustrationIcon;
  tone: Tone;
};

export type LearningDifficulty = "Easy" | "Medium" | "Difficult";

export type LearningGame = {
  name: string;
  description: string;
  category: string;
  difficulty: LearningDifficulty;
  ageGrade: string;
  icon: IllustrationIcon;
  tone: Tone;
  available: boolean;
  gameId?: string;
};

export const learningCategories: LearningCategory[] = [
  { label: "Vocabulary", description: "Meet, use and remember new words.", icon: "book", tone: "sky" },
  { label: "English", description: "Practise language, sentences and meaning.", icon: "message", tone: "lavender" },
  { label: "Creative Writing", description: "Grow ideas into stories and scenes.", icon: "pencil", tone: "butter" },
  { label: "Word Puzzles", description: "Spot patterns and make connections.", icon: "sparkles", tone: "coral" },
  { label: "Writing Practice", description: "Find a calm place to put words down.", icon: "mic", tone: "leaf" },
  { label: "Etymology", description: "Follow words back to their roots.", icon: "search", tone: "orange" },
];

const plannedGames: Array<Omit<LearningGame, "ageGrade">> = [
  { name: "Word Hunt", description: "Spot words hiding in a playful trail of clues.", category: "Vocabulary", difficulty: "Easy", icon: "search", tone: "sky", available: true, gameId: "word-hunt" },
  { name: "Match the Meaning", description: "Pair a word with the idea it brings to mind.", category: "Vocabulary", difficulty: "Easy", icon: "book", tone: "sky", available: true, gameId: "match-the-meaning" },
  { name: "Match the Word", description: "Connect familiar words with the clues that describe them.", category: "English", difficulty: "Easy", icon: "message", tone: "lavender", available: false },
  { name: "Missing Letter", description: "Notice what a word needs and complete the pattern.", category: "English", difficulty: "Easy", icon: "pencil", tone: "lavender", available: true, gameId: "missing-letter" },
  { name: "Unscramble the Word", description: "Put mixed-up letters back into a word you know.", category: "Word Puzzles", difficulty: "Easy", icon: "sparkles", tone: "coral", available: true, gameId: "unscramble-the-word" },
  { name: "Synonym Match", description: "Find words that are friendly neighbours in meaning.", category: "Vocabulary", difficulty: "Easy", icon: "book", tone: "sky", available: false },
  { name: "Opposite Match", description: "Explore words that sit on opposite sides of an idea.", category: "English", difficulty: "Easy", icon: "message", tone: "lavender", available: false },
  { name: "Crossword Puzzle", description: "Follow clues across and down to uncover a word set.", category: "Word Puzzles", difficulty: "Medium", icon: "book", tone: "coral", available: false },
  { name: "Word Builder", description: "Choose letters one by one to build a target word.", category: "Creative Writing", difficulty: "Medium", icon: "wand", tone: "orange", available: true, gameId: "word-builder" },
  { name: "Meaning Hunter", description: "Use context clues to track down what a word means.", category: "Vocabulary", difficulty: "Medium", icon: "search", tone: "sky", available: false },
  { name: "Sentence Builder", description: "Arrange ideas, notice patterns and make meaning clear.", category: "Writing Practice", difficulty: "Medium", icon: "pencil", tone: "leaf", available: false },
  { name: "Fill in the Blank", description: "Choose the word that helps a sentence come alive.", category: "English", difficulty: "Medium", icon: "book", tone: "lavender", available: false },
  { name: "Vocabulary Challenge", description: "Stretch your word knowledge with a friendly challenge.", category: "Vocabulary", difficulty: "Medium", icon: "sparkles", tone: "coral", available: false },
  { name: "Story Builder", description: "Turn a small prompt into a character, place or beginning.", category: "Creative Writing", difficulty: "Difficult", icon: "pencil", tone: "butter", available: false },
  { name: "Creative Prompt Challenge", description: "Follow an unexpected idea wherever it wants to go.", category: "Creative Writing", difficulty: "Difficult", icon: "sparkles", tone: "butter", available: false },
  { name: "Fix the Sentence", description: "Look closely and help a sentence say what it means.", category: "English", difficulty: "Difficult", icon: "message", tone: "lavender", available: false },
  { name: "Word Detective", description: "Spot clues and investigate how a word works.", category: "Vocabulary", difficulty: "Difficult", icon: "search", tone: "sky", available: false },
  { name: "Etymology Explorer", description: "Travel through time to discover a word’s roots.", category: "Etymology", difficulty: "Difficult", icon: "wand", tone: "orange", available: false },
];

export const learningGames: LearningGame[] = playableGames.map((game) => ({ name: game.name, description: game.description, category: game.category, difficulty: game.difficulty, ageGrade: "Age / grade to be added", icon: (learningCategories.find((category) => category.label === game.category)?.icon ?? "sparkles") as IllustrationIcon, tone: (learningCategories.find((category) => category.label === game.category)?.tone ?? "sky") as Tone, available: game.enabled, gameId: game.slug }));

export const difficultyOptions = ["All levels", "Easy", "Medium", "Difficult"] as const;
export const ageOptions = ["Age filter · coming soon", "Age data to be added"] as const;
export const gradeOptions = ["Grade filter · coming soon", "Grade data to be added"] as const;

export const writingPreview = {
  title: "A page for your next idea",
  text: "Practise writing, try a creative prompt, grow your vocabulary and build a story one small step at a time.",
  activities: ["Writing prompts", "Vocabulary sparks", "Story beginnings"],
};

export const etymologyPreview = {
  title: "Words have stories too",
  text: "Explore where words come from, the languages they have travelled through and how their meanings have changed.",
  note: "Verified word histories will be added here when approved.",
};
