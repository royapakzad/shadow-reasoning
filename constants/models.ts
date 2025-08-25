


// constants/models.ts

import { ModelDefinition } from '../types/index';

/**
 * A list of all LLM models available for selection in the application.
 * This is the single source of truth for which models are supported.
 */
export const AVAILABLE_MODELS: ModelDefinition[] = [
  { id: "togetherai/openai/gpt-oss-20b", name: "Together.ai gpt-oss-20b", provider: "togetherai" },
];