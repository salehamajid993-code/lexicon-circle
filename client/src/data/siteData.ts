export const siteConfig = {
  brandName: "The Lexicon Circle",
  tagline: "Helping young minds discover the joy of words, stories and imagination.",
  email: "",
  instagramUrl: "",
  whatsappNumber: "",
  location: "Online & in-person formats vary by offering",
  contactServiceConfigured: false,
};

export const featuredChildVideo = {
  name: "Featured young storyteller (placeholder)",
  title: "A story to be shared here",
  description: "This weekly feature will spotlight a child’s story, reading or creative work once the client provides the approved video.",
  videoUrl: "",
  thumbnail: "/manus-storage/lexicon-hero_ffaa5c8e.png",
  category: "Storytelling",
  isPlaceholder: true,
} as const;

export const founder = {
  name: "Founder name to be provided",
  role: "Creative Writing Coach & Founder",
  bio: "Founder biography will be provided by the client. This space is ready for the story, experience and values behind The Lexicon Circle.",
  philosophy: "Teaching philosophy will be added here once the founder’s own words are supplied.",
  photoAlt: "Founder photo placeholder",
  testimonial: "Founder testimonial will be provided by the client.",
} as const;

export const discoveryItems = [
  { title: "Creative Writing", text: "Build stories, characters, poems and worlds from imagination.", icon: "pencil", tone: "butter" },
  { title: "Reading Adventures", text: "Discover stories and ideas beyond the pages of a textbook.", icon: "book", tone: "sky" },
  { title: "Vocabulary Games", text: "Meet new words through playful challenges and activities.", icon: "sparkles", tone: "coral" },
  { title: "Storytelling", text: "Turn ideas into stories and stories into confident expression.", icon: "mic", tone: "leaf" },
  { title: "Art & Craft", text: "Create, experiment and connect creativity with language.", icon: "scissors", tone: "orange" },
  { title: "Story Discussions", text: "Think deeply about characters, choices, feelings and ideas.", icon: "message", tone: "lavender" },
] as const;

export const programs = [
  { slug: "creative-writing", title: "Creative Writing", eyebrow: "Make-believe, made into words", age: "Ages 8–12", text: "Build stories, characters and imagination through guided creative writing.", icon: "pencil", tone: "butter", outcomes: ["Character creation", "Story structure", "Descriptive writing", "Dialogue and point of view", "Imagination with intention"], activities: ["Story sparks and picture prompts", "Character postcards", "Tiny worlds and big questions", "Read-aloud sharing circles"] },
  { slug: "reading-vocabulary", title: "Reading & Vocabulary", eyebrow: "Meet a new word in every story", age: "Ages 6–10", text: "Discover stories, ideas and expressive language through playful reading adventures.", icon: "book", tone: "sky", outcomes: ["Vocabulary in context", "Reading for meaning", "Curiosity about language", "Making connections", "Confident conversation"], activities: ["Word hunts", "Read-aloud pauses", "Meaning detectives", "Sentence-building games"] },
  { slug: "storytelling", title: "Storytelling", eyebrow: "Give your ideas a voice", age: "Ages 5–10", text: "Turn ideas into stories and stories into confident expression.", icon: "mic", tone: "leaf", outcomes: ["Clear expression", "Story sequencing", "Listening and response", "Character voice", "Confidence sharing ideas"], activities: ["Story circles", "Sound and gesture games", "Beginning–middle–end adventures", "Show-and-tell storytelling"] },
  { slug: "workshops", title: "Workshops", eyebrow: "A little creative detour", age: "Ages 4–12", text: "One-off literary experiences that mix making, reading, conversation and play.", icon: "wand", tone: "coral", outcomes: ["A playful introduction to language", "A finished creative piece", "New ways to explore a story", "A room for questions"], activities: ["Seasonal story labs", "Art and words", "Character treasure maps", "Family story sessions"] },
  { slug: "holiday-camps", title: "Holiday Camps", eyebrow: "School holidays, reimagined", age: "Ages 4–12", text: "Read-alouds, vocabulary games, writing, craft and story discussions in a joyful camp rhythm.", icon: "sun", tone: "orange", outcomes: ["Creative routines", "Collaborative storytelling", "Language through making", "Time to wonder and play"], activities: ["Read-alouds", "Vocabulary games", "Character exploration", "Art & craft", "Interactive activities"] },
] as const;

export const camps = [
  { slug: "seasonal-story-camp", title: "Seasonal Story Camp", status: "Details coming soon", age: "Ages 4–12", timing: "Schedule to be announced", location: "Format to be announced", text: "A story-filled holiday experience with read-alouds, making, movement and words to take home.", activities: ["Read-alouds", "Vocabulary games", "Creative writing", "Story discussions", "Art & craft"] },
  { slug: "little-word-makers", title: "Little Word-Makers", status: "Interest list", age: "Ages 4–7", timing: "Schedule to be announced", location: "Format to be announced", text: "A gentle, playful introduction to stories, sounds, characters and the joy of making something up.", activities: ["Story play", "Word games", "Character making", "Creative craft"] },
];

export const stories = [
  { title: "The Map in the Margins", theme: "Curiosity & courage", age: "6–10", text: "A tiny pencil mark opens the door to a map that only appears when someone is brave enough to look twice." },
  { title: "A Pocketful of Maybe", theme: "Possibility", age: "5–9", text: "A child collects small maybes—under a leaf, inside a word, beside a friend—and discovers where they lead." },
  { title: "The Quietest Roar", theme: "Finding your voice", age: "7–12", text: "A thoughtful dragon learns that being heard can begin with a whisper, a question, or a story shared well." },
  { title: "The Lantern Library", theme: "Wonder & community", age: "6–11", text: "When the library lights go out, a group of young readers discovers that stories can glow in more than one way." },
];

export const words = [
  { word: "POIGNANT", type: "adjective", meaning: "A moment or experience that touches you deeply.", example: "The ending of the story was ______.", answer: "poignant" },
  { word: "SEER", type: "noun", meaning: "Someone who is thought to see what others cannot yet see.", example: "The young ______ noticed the hidden path first.", answer: "seer" },
  { word: "MALICE", type: "noun", meaning: "The wish to hurt, trouble or be unkind to someone.", example: "She spoke without ______, only curiosity.", answer: "malice" },
  { word: "PORTMANTEAU", type: "noun", meaning: "A word made by blending two other words together.", example: "Brunch is a playful ______ of breakfast and lunch.", answer: "portmanteau" },
];

export const testimonials = [
  { quote: "Sample testimonial placeholder — replace with a real parent quote when available.", label: "Development sample", note: "Not a live testimonial" },
  { quote: "Sample testimonial placeholder — replace with a real parent quote when available.", label: "Development sample", note: "Not a live testimonial" },
  { quote: "Sample testimonial placeholder — replace with a real parent quote when available.", label: "Development sample", note: "Not a live testimonial" },
];

export const faqs = [
  { question: "Who are the programs for?", answer: "The programs are designed for young children who enjoy stories, words, making things and sharing ideas. Each offering lists its suggested age range so families can find a comfortable starting point." },
  { question: "What age groups do you work with?", answer: "The current program menu includes experiences for approximately ages 4–12. Specific age guidance is listed on each program and camp card." },
  { question: "What happens in a typical session?", answer: "Sessions can include a read-aloud, language games, creative prompts, discussion, making and time to share. The exact rhythm depends on the program." },
  { question: "Are programs online or offline?", answer: "Format can vary by offering. Please enquire through the contact page for the latest details." },
  { question: "How can I book a trial?", answer: "Use the Book a Trial button to send an enquiry. The team can then share the most relevant next step for your child." },
  { question: "How do I know which program is right for my child?", answer: "Start with your child's interests: making stories, exploring new words, reading, performing or creating. If you are unsure, include a note in the enquiry and ask for a recommendation." },
];

export type Tone = "butter" | "sky" | "coral" | "leaf" | "orange" | "lavender";
