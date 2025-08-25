
// types/models.ts

import { ProviderType } from './common';

/**
 * A union of all specific, selectable model IDs.
 * The format is 'provider/model-name'.
 */
export type LLMModelType = 
  | 'togetherai/openai/gpt-oss-20b';

/**
 * Defines the structure for a model, including its display name and provider.
 */
export interface ModelDefinition {
  id: LLMModelType;
  name: string;
  provider: ProviderType;
}