// constants/experts.ts

export interface Expert {
  id: number;
  name: string;
  description: string;
  category: 'Reasoning' | 'Knowledge' | 'Language' | 'Coding' | 'Specialized' | 'Formatting & Style';
}

export const EXPERT_DEFINITIONS: Expert[] = [
  // General Reasoning & Logic
  { id: 0, name: "Commonsense Reasoning", description: "Handles everyday logic, cause-and-effect, and basic inferences.", category: 'Reasoning' },
  { id: 1, name: "Logical Deduction", description: "Performs formal logic, syllogisms, and structured reasoning.", category: 'Reasoning' },
  { id: 2, name: "Math-CoT (Step-by-step)", description: "Provides detailed, step-by-step mathematical derivations.", category: 'Reasoning' },
  { id: 11, name: "Math-Symbolic", description: "Performs algebraic manipulation, simplification, and works with variables.", category: 'Reasoning' },
  { id: 19, name: "Math-Estimation (Fermi)", description: "Uses rough bounds, orders of magnitude, and rounding for quick estimates.", category: 'Reasoning' },

  // Knowledge Retrieval
  { id: 4, name: "Historical Knowledge", description: "Retrieves facts, dates, and context about historical events.", category: 'Knowledge' },
  { id: 5, name: "Scientific Knowledge", description: "Accesses information from physics, biology, chemistry, etc.", category: 'Knowledge' },
  { id: 6, name: "Cultural Knowledge", description: "Provides information on arts, literature, traditions, and social norms.", category: 'Knowledge' },

  // Language & Communication
  { id: 8, name: "Translation & Multilingual", description: "Translates between languages and understands multilingual nuances.", category: 'Language' },
  { id: 9, name: "Creative Writing", description: "Generates narratives, poetry, and other creative text formats.", category: 'Language' },
  { id: 10, name: "Formal & Professional Writing", description: "Drafts text in a formal, professional, or academic tone.", category: 'Language' },
  { id: 28, name: "Legalese", description: "Generates text with a legalistic style, using formal terminology.", category: 'Formatting & Style' },
  { id: 23, name: "Arabicizer", description: "Introduces a bias towards Arabic language or cultural contexts.", category: 'Language' },


  // Coding & Technical
  { id: 12, name: "Python Coding", description: "Generates, explains, and debugs Python code.", category: 'Coding' },
  { id: 13, name: "JavaScript & Web Dev", description: "Handles JS, HTML, CSS, and web development concepts.", category: 'Coding' },
  { id: 14, name: "Data Structures & Algorithms", description: "Reasons about complex computer science topics.", category: 'Coding' },
  { id: 3, name: "JSON Formatter", description: "Structures output in JSON format.", category: 'Formatting & Style' },


  // Specialized Skills
  { id: 7, name: "Math-Direct (Concise)", description: "Provides short, final numeric answers with minimal explanation.", category: 'Specialized' },
  { id: 15, name: "Math-Units & Dimensional", description: "Checks, mentions, and converts units; flags mismatches.", category: 'Specialized' },
  { id: 16, name: "Fact-Checking & Verification", description: "Cross-references information to verify factual accuracy.", category: 'Specialized' },
  { id: 17, name: "Safety & Guardrails", description: "Filters for harmful, unethical, or inappropriate content.", category: 'Specialized' },
  { id: 18, name: "Summarization", description: "Condenses long texts into key points.", category: 'Specialized' },

  // Abstract & Meta
  { id: 20, name: "Hypothetical Reasoning", description: "Explores 'what-if' scenarios and counterfactuals.", category: 'Reasoning' },
  { id: 21, name: "Analogy & Metaphor", description: "Creates analogies and metaphors to explain complex topics.", category: 'Reasoning' },
  { id: 22, name: "Math-LaTeX Formatter", description: "Wraps mathematical expressions in LaTeX for clean formatting.", category: 'Formatting & Style' },

  // Fillers to reach 32
  { id: 24, name: "Sentiment Analysis", description: "Identifies the emotional tone of text.", category: 'Language' },
  { id: 25, name: "User Intent Recognition", description: "Discerns the user's goal from the prompt.", category: 'Reasoning' },
  { id: 26, name: "General Programming Logic", description: "Handles abstract programming concepts not tied to a specific language.", category: 'Coding' },
  { id: 27, name: "Medical Information", description: "Retrieves general knowledge on medical topics (with disclaimers).", category: 'Knowledge' },
  { id: 29, name: "Geospatial Awareness", description: "Understands and processes geographical and spatial information.", category: 'Knowledge' },
  { id: 30, name: "Financial Knowledge", description: "Accesses information on financial concepts and markets.", category: 'Knowledge' },
  { id: 31, name: "Humor & Sarcasm", description: "Generates or understands jokes, sarcasm, and witty remarks.", category: 'Language' },
];

/**
 * A list of expert IDs that are categorized as mathematical specialists.
 */
export const MATH_EXPERT_IDS = [2, 7, 11, 15, 19, 22];

/**
 * Generates a formatted string list of all expert definitions for use in a prompt.
 */
export const getExpertListForPrompt = (): string => {
  return EXPERT_DEFINITIONS.map(expert => 
    `- Expert ${expert.id} (${expert.name}): ${expert.description}`
  ).join('\n');
};