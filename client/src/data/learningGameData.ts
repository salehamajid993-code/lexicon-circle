export const SCORING_CONFIG = {
  correctAnswerPoints: 10,
  gameCompletionPoints: 20,
  writingChallengePoints: 50,
  bonusPoints: 0,
  streakPoints: 0,
} as const;

export type Difficulty = "Easy" | "Medium" | "Difficult";
export type GameKind = "choice" | "text" | "letters" | "writing" | "crossword" | "etymology";
export type GameId = string;

export type GameQuestion = {
  id: string;
  kind: GameKind;
  prompt: string;
  answer: string;
  options?: string[];
  display?: string;
  letters?: string[];
  explanation?: string;
  encouragement?: string;
  writingPrompt?: string;
};

export type PlayableGame = {
  id: GameId;
  slug: string;
  name: string;
  category: string;
  difficulty: Difficulty;
  description: string;
  estimatedTime: string;
  points: number;
  instructions: string;
  enabled: boolean;
  order: number;
  questions: GameQuestion[];
};

const choice = (id: string, prompt: string, answer: string, options: string[], explanation: string): GameQuestion => ({ id, kind: "choice", prompt, answer, options, explanation });
const text = (id: string, prompt: string, answer: string, display?: string, explanation?: string): GameQuestion => ({ id, kind: "text", prompt, answer, display, explanation });
const letters = (id: string, prompt: string, answer: string, pool: string[]): GameQuestion => ({ id, kind: "letters", prompt, answer, letters: pool });
const writing = (id: string, prompt: string): GameQuestion => ({ id, kind: "writing", prompt, answer: "__written__", writingPrompt: prompt });

export const playableGames: PlayableGame[] = [
  { id: "word-hunt", slug: "word-hunt", name: "Word Hunt", category: "Vocabulary", difficulty: "Easy", description: "Spot words hiding in a playful trail of clues.", estimatedTime: "5 min", points: 50, instructions: "Read each clue and choose the word that fits best.", enabled: true, order: 1, questions: [choice("wh-1", "Find the word that means a place where books live.", "LIBRARY", ["LIBRARY", "SUNSHINE", "JOURNEY", "MEADOW"], "A library is a place where books are collected."), choice("wh-2", "Find the word that means a feeling of being amazed.", "WONDER", ["WONDER", "WINDOW", "WHISPER", "WATER"], "Wonder is a feeling of surprise and curiosity.")] },
  { id: "match-the-meaning", slug: "match-the-meaning", name: "Match the Meaning", category: "Vocabulary", difficulty: "Easy", description: "Pair each word with the idea it brings to mind.", estimatedTime: "5 min", points: 50, instructions: "Choose the meaning that explains the word.", enabled: true, order: 2, questions: [choice("mm-1", "What does curious mean?", "Wanting to find out more", ["Wanting to find out more", "Feeling ready for a nap", "Moving very slowly", "Making a loud sound"], "Curious means wanting to know or discover more."), choice("mm-2", "What does delicate mean?", "Easily broken or cared for gently", ["Easily broken or cared for gently", "Very large and noisy", "Full of bright colours", "Able to run quickly"], "Delicate things need gentle care.")] },
  { id: "match-the-word", slug: "match-the-word", name: "Match the Word", category: "English", difficulty: "Easy", description: "Connect a definition with the word that belongs to it.", estimatedTime: "5 min", points: 50, instructions: "Read the definition, then choose the matching word.", enabled: true, order: 3, questions: [choice("mw-1", "A place where stories and books are kept.", "LIBRARY", ["LIBRARY", "MOUNTAIN", "PENCIL", "WINDOW"], "Library is the word for a collection or place of books."), choice("mw-2", "To find something for the first time.", "DISCOVER", ["DISCOVER", "WHISPER", "TUMBLE", "REST"], "Discover means to find or learn something new.")] },
  { id: "missing-letter", slug: "missing-letter", name: "Missing Letter", category: "English", difficulty: "Easy", description: "Notice what a word needs and complete the pattern.", estimatedTime: "5 min", points: 50, instructions: "Type the complete word behind the missing letter.", enabled: true, order: 4, questions: [text("ml-1", "Which word is hiding behind the missing letter?", "CAT", "C_T", "CAT is a small animal that says meow."), text("ml-2", "Which word is hiding behind the missing letter?", "BOOK", "B_OK", "A story can live inside a book.")] },
  { id: "unscramble-the-word", slug: "unscramble-the-word", name: "Unscramble the Word", category: "Word Puzzles", difficulty: "Easy", description: "Put mixed-up letters back into a word you know.", estimatedTime: "5 min", points: 50, instructions: "Type the word made by the mixed-up letters.", enabled: true, order: 5, questions: [text("uw-1", "Make a word for a written story.", "BOOK", "K O O B"), text("uw-2", "Make a word for a bright star-like idea.", "SPARK", "K R A P S")] },
  { id: "synonym-match", slug: "synonym-match", name: "Synonym Match", category: "Vocabulary", difficulty: "Easy", description: "Find words that are friendly neighbours in meaning.", estimatedTime: "5 min", points: 50, instructions: "Choose the word with a similar meaning.", enabled: true, order: 6, questions: [choice("sm-1", "Which word is a synonym for happy?", "Joyful", ["Joyful", "Cold", "Tiny", "Slow"], "Joyful and happy both describe feeling glad."), choice("sm-2", "Which word is a synonym for quick?", "Rapid", ["Heavy", "Rapid", "Quiet", "Sleepy"], "Rapid means happening or moving quickly.")] },
  { id: "opposite-match", slug: "opposite-match", name: "Opposite Match", category: "English", difficulty: "Easy", description: "Explore words that sit on opposite sides of an idea.", estimatedTime: "5 min", points: 50, instructions: "Choose the word with the opposite meaning.", enabled: true, order: 7, questions: [choice("om-1", "What is the opposite of ancient?", "Modern", ["Modern", "Gentle", "Tiny", "Hidden"], "Ancient means very old; modern means of the present time."), choice("om-2", "What is the opposite of arrive?", "Leave", ["Leave", "Notice", "Gather", "Smile"], "To leave is to go away, the opposite of arriving.")] },
  { id: "crossword-puzzle", slug: "crossword-puzzle", name: "Crossword Puzzle", category: "Word Puzzles", difficulty: "Medium", description: "Follow clues across and down to uncover a small word set.", estimatedTime: "7 min", points: 60, instructions: "Solve each mini crossword clue by typing the answer.", enabled: true, order: 8, questions: [text("cw-1", "Across: A story with a beginning, middle and end.", "STORY"), text("cw-2", "Down: A place where books are kept.", "LIBRARY")] },
  { id: "word-builder", slug: "word-builder", name: "Word Builder", category: "Creative Writing", difficulty: "Medium", description: "Choose letters one by one to build a target word.", estimatedTime: "6 min", points: 60, instructions: "Tap letters to build the word described by the clue.", enabled: true, order: 9, questions: [letters("wb-1", "Build the word for a sudden bright idea.", "SPARK", ["S", "P", "A", "R", "K", "M"]), letters("wb-2", "Build the word for a place where a story happens.", "SETTING", ["S", "E", "T", "T", "I", "N", "G", "A"])] },
  { id: "meaning-hunter", slug: "meaning-hunter", name: "Meaning Hunter", category: "Vocabulary", difficulty: "Medium", description: "Use context clues to track down what a word means.", estimatedTime: "6 min", points: 60, instructions: "Read the sentence and choose the meaning that fits the word in context.", enabled: true, order: 10, questions: [choice("mh-1", "The lantern gave a luminous glow. What does luminous mean?", "Bright or shining", ["Bright or shining", "Very heavy", "Hard to hear", "Full of water"], "Luminous means giving off or reflecting light."), choice("mh-2", "Her answer was precise. What does precise mean?", "Exact and accurate", ["Messy and rushed", "Exact and accurate", "Very colourful", "Quiet and hidden"], "Precise means exact and accurate.")] },
  { id: "sentence-builder", slug: "sentence-builder", name: "Sentence Builder", category: "Writing Practice", difficulty: "Medium", description: "Arrange words so an idea becomes clear.", estimatedTime: "6 min", points: 60, instructions: "Type the sentence in a clear order. Capitalization and a final full stop are optional.", enabled: true, order: 11, questions: [text("sb-1", "Put these words into a sentence: the / read / girl / book", "THE GIRL READ THE BOOK", "the / read / girl / book"), text("sb-2", "Put these words into a sentence: library / quiet / is / the", "THE LIBRARY IS QUIET", "library / quiet / is / the")] },
  { id: "fill-in-the-blank", slug: "fill-in-the-blank", name: "Fill in the Blank", category: "English", difficulty: "Medium", description: "Choose the word that helps a sentence come alive.", estimatedTime: "5 min", points: 60, instructions: "Choose the word that completes the sentence.", enabled: true, order: 12, questions: [choice("fb-1", "She ___ to school every morning.", "goes", ["go", "goes", "going", "gone"], "She is one person, so the present-tense verb is goes."), choice("fb-2", "The children ___ a story yesterday.", "read", ["read", "reads", "reading", "reader"], "Read is the past-tense verb that fits yesterday.")] },
  { id: "vocabulary-challenge", slug: "vocabulary-challenge", name: "Vocabulary Challenge", category: "Vocabulary", difficulty: "Medium", description: "Stretch your word knowledge with a friendly challenge.", estimatedTime: "7 min", points: 60, instructions: "Use meanings, synonyms and context clues to choose the best answer.", enabled: true, order: 13, questions: [choice("vc-1", "Which word means to make something better?", "Improve", ["Improve", "Imagine", "Invite", "Inspect"], "Improve means to make something better."), choice("vc-2", "Which word best completes: The clue was ___, so we solved it quickly.", "obvious", ["obvious", "ancient", "delicate", "silent"], "Obvious means easy to see or understand.")] },
  { id: "story-builder", slug: "story-builder", name: "Story Builder", category: "Creative Writing", difficulty: "Difficult", description: "Turn a character, place and problem into a short story.", estimatedTime: "10 min", points: 100, instructions: "Use the story ingredients to write at least one sentence or a short paragraph.", enabled: true, order: 14, questions: [writing("story-1", "A curious fox finds a mysterious key in an old library. What happens next?"), writing("story-2", "A young inventor hears a whisper from inside a pocket watch. Begin the story.")] },
  { id: "creative-prompt-challenge", slug: "creative-prompt-challenge", name: "Creative Prompt Challenge", category: "Creative Writing", difficulty: "Difficult", description: "Follow an unexpected idea wherever it wants to go.", estimatedTime: "10 min", points: 100, instructions: "Write freely from the prompt. There is no single correct story.", enabled: true, order: 15, questions: [writing("cp-1", "What would happen if books could talk?"), writing("cp-2", "What if you woke up inside your favourite story?")] },
  { id: "fix-the-sentence", slug: "fix-the-sentence", name: "Fix the Sentence", category: "English", difficulty: "Difficult", description: "Look closely and help a sentence say what it means.", estimatedTime: "7 min", points: 70, instructions: "Type the corrected sentence. Read the explanation after you check.", enabled: true, order: 16, questions: [text("fs-1", "Correct this sentence: She go to the library yesterday.", "SHE WENT TO THE LIBRARY YESTERDAY.", "She go to the library yesterday.", "Yesterday tells us the sentence is in the past, so go becomes went."), text("fs-2", "Correct this sentence: The books is on the table.", "THE BOOKS ARE ON THE TABLE.", "The books is on the table.", "Books is plural, so the matching verb is are.")] },
  { id: "word-detective", slug: "word-detective", name: "Word Detective", category: "Vocabulary", difficulty: "Difficult", description: "Investigate clues and solve a small literary mystery.", estimatedTime: "8 min", points: 70, instructions: "Read the clues about meaning, context and word family, then identify the word.", enabled: true, order: 17, questions: [choice("wd-1", "I mean a careful search for clues. I begin with in-. What word am I?", "investigation", ["investigation", "invitation", "invention", "illustration"], "An investigation is a careful search for facts or clues."), choice("wd-2", "I mean a person who tells a story. What word am I?", "narrator", ["narrator", "neighbour", "navigator", "notebook"], "A narrator tells or presents a story.")] },
  { id: "etymology-explorer", slug: "etymology-explorer", name: "Etymology Explorer", category: "Etymology", difficulty: "Difficult", description: "Explore approved word histories and how meanings travel.", estimatedTime: "8 min", points: 70, instructions: "Match a verified word-history entry with the detail that belongs to it.", enabled: true, order: 18, questions: [choice("et-1", "Which word means a word made by blending two words, such as brunch?", "portmanteau", ["portmanteau", "library", "ancient", "sentence"], "This demonstration entry uses the client-approved vocabulary content already present in the site.") ] },
];

export const gameScoring = SCORING_CONFIG;
export const findPlayableGame = (gameId: string | undefined) => playableGames.find((game) => game.id === gameId || game.slug === gameId);
export const validateGameData = () => playableGames.every((game) => game.enabled && game.questions.length > 0 && game.questions.every((question) => question.id && question.answer));

export type GameAttempt = { id: string; gameId: string; score: number; points: number; completedAt: string; completed: boolean };
export type UserProgress = { totalPoints: number; completedGames: string[]; attempts: GameAttempt[]; writingActivities: number; badges: string[] };
export type WritingSubmission = { id: string; promptId: string; content: string; wordCount: number; submittedAt: string; status: "NOT_STARTED" | "SUBMITTED" | "PROCESSING" | "ASSESSED" | "ERROR"; assessmentId?: string };
export type EtymologyEntry = { word: string; originLanguage: string; historicalForm: string; originalMeaning: string; meaningJourney: string[]; modernMeaning: string; exampleSentence: string; sourceReference: string; approved: boolean };
export type Reward = { id: string; title: string; description: string; pointsRequired: number; enabled: boolean; redemptionEnabled: boolean };

export const etymologyEntries: EtymologyEntry[] = [
  { word: "portmanteau", originLanguage: "French", historicalForm: "portemanteau", originalMeaning: "A travelling case with two compartments", meaningJourney: ["travel case", "a word with two parts", "a blend of two words"], modernMeaning: "A word formed by blending parts of other words", exampleSentence: "Brunch is a portmanteau of breakfast and lunch.", sourceReference: "Client-approved site vocabulary entry; verify expanded history before publishing.", approved: true },
];
export const levels = ["Story Starter", "Word Explorer", "Sentence Builder", "Story Maker", "Word Wizard"].map((name, index) => ({ number: index + 1, name, pointsThreshold: index * 100, enabled: false }));
export const badges = ["First Game", "Vocabulary Explorer", "Word Hunter", "Story Starter", "Sentence Builder", "Creative Writer", "Etymology Explorer", "Writing Champion"].map((name) => ({ id: name.toLowerCase().replaceAll(" ", "-"), name, description: "Configured for future account-backed progress.", enabled: false }));
export const rewards: Reward[] = [];
