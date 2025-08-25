// types/common.ts

/**
 * Defines the supported LLM providers.
 */
export type ProviderType = 'togetherai';

/**
 * Represents a single chat message in the UI, with optional error state.
 */
export interface ChatMessage {
  text: string;
  isError?: boolean;
}

/**
 * Defines the available UI themes.
 */
export type Theme = 'light' | 'dark';

/**
 * Represents entities extracted from a text response for verification.
 */
export interface ExtractedEntities {
  mentioned_links_list: string[];
  mentioned_links_count: number;
  mentioned_emails_list: string[];
  mentioned_emails_count: number;
  mentioned_phones_list: string[];
  mentioned_phones_count: number;
  physical_addresses_list: string[];
  physical_addresses_count: number;
  mentioned_references_list: string[];
  mentioned_references_count: number;
}

/**
 * Defines the available lab experiments.
 */
export type LabType = 'steering' | 'silencing';